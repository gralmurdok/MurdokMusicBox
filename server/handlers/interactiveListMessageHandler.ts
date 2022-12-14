import { ErrorMessages, SuccessMessages } from "../constants";
import { persistSongs } from "../database/databaseHandler";
import { replyTextMessage } from "../messaging/whatsapp";
import { SpotifyQueuedSong } from "../music/song";
import { SpotifySongQueueManager } from "../music/songQueueManager";
import { fetchSongByTrackId } from "../music/spotify";
import { store } from "../store";
import { APIParams, Song } from "../types";
import { getFormattedRemainigTime } from "../utils";

const songQueueManager = new SpotifySongQueueManager();

async function handleInteractiveListMessage(apiParams: APIParams) {
  console.log(
    "HANDLING AS INTERACTIVE MESSAGE " + apiParams.interactiveListReply
  );
  if (isDuplicatedSong(apiParams)) {
    await handleDuplicatedSong(apiParams);
  } else if (isNotReadyToQueueNextSong(apiParams)) {
    await handleNotReadyToQueueNextSong(apiParams);
  } else {
    await handleQueueSong(apiParams);
  }
}

function isNotReadyToQueueNextSong(apiParams: APIParams) {
  const currentUser = store.getUser(apiParams.toPhoneNumber);
  return (
    currentUser.phoneNumber !== process.env.MASTER_PHONE_NUMBER &&
    currentUser.nextAvailableSongTimestamp > Date.now()
  );
}

async function handleNotReadyToQueueNextSong(apiParams: APIParams) {
  const remainingMiliseconds =
    store.getUser(apiParams.toPhoneNumber).nextAvailableSongTimestamp -
    Date.now();
  const remainingSeconds = remainingMiliseconds / 1000;
  await replyTextMessage(
    apiParams.toPhoneNumber,
    `${ErrorMessages.NOT_READY_TO_QUEUE_SONG} ${getFormattedRemainigTime(
      remainingSeconds
    )}`
  );
}

function isDuplicatedSong(apiParams: APIParams) {
  const currentSong = store.getCurrentSong();
  const songQueue = store.status.songQueue;
  const scheduledSongList = [...songQueue, currentSong];

  return !!scheduledSongList.find(
    (song: Song) => song.trackId === apiParams.interactiveListReply
  );
}

async function handleDuplicatedSong(apiParams: APIParams) {
  await replyTextMessage(
    apiParams.toPhoneNumber,
    ErrorMessages.DUPLICATED_SONG
  );
}

async function handleQueueSong(apiParams: APIParams) {
  const newRawSongResponse = await fetchSongByTrackId(
    apiParams.interactiveListReply
  );
  const newSpotifySong = new SpotifyQueuedSong(
    newRawSongResponse.data,
    apiParams
  );
  const currentRemainingTime = songQueueManager.getCurrentSongPlayingTime();

  if (apiParams.toPhoneNumber === store.config.owner) {
    songQueueManager.addSpecialSong(newSpotifySong);
    await replyTextMessage(
      apiParams.toPhoneNumber,
      `*Cancion de evento recibida:* ${newSpotifySong.name} de ${newSpotifySong.artist}, ahora envia algunas *imagenes* que seran proyectadas mientras dura el evento.`
    );
  } else {
    songQueueManager.addSong(newSpotifySong);
    await replyTextMessage(
      apiParams.toPhoneNumber,
      `${SuccessMessages.SONG_QUEUED} ${getFormattedRemainigTime(
        currentRemainingTime / 1000
      )}`
    );

    const currentUserSongs = store.getUser(apiParams.toPhoneNumber).songs;
    const songs = currentUserSongs.includes(apiParams.interactiveListReply)
      ? currentUserSongs
      : [apiParams.interactiveListReply, ...currentUserSongs];

    store.updateUser(apiParams.toPhoneNumber, {
      name: apiParams.requesterName,
      phoneNumber: apiParams.toPhoneNumber,
      nextAvailableSongTimestamp: Date.now() + 180 * 1000,
      songs,
    });

    persistSongs(apiParams.toPhoneNumber, songs);
  }
}

export { handleInteractiveListMessage, songQueueManager };
