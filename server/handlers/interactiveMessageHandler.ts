import { Defaults, ErrorMessages, SuccessMessages } from "../constants";
import { replyTextMessage } from "../messaging/whatsapp";
import { SpotifyQueuedSong } from "../music/song";
import { SpotifySongQueueManager } from "../music/songQueueManager";
import { fetchSongByTrackId } from "../music/spotify";
import { store } from "../store";
import { APIParams, Song } from "../types";
import { getFormattedRemainigTime } from "../utils";

const songQueueManager = new SpotifySongQueueManager();

async function handleInteractiveMessage(apiParams: APIParams) {
  console.log("HANDLING AS INTERACTIVE MESSAGE " + apiParams.interactiveReply);
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
    currentUser.phoneNumber !== Defaults.MASTER_NUMBER &&
    currentUser.nextAvailableSongTimestamp > Date.now()
  );
}

async function handleNotReadyToQueueNextSong(apiParams: APIParams) {
  const remainingMiliseconds =
    store.getUser(apiParams.toPhoneNumber).nextAvailableSongTimestamp -
    Date.now();
  const remainingSeconds = remainingMiliseconds / 1000;
  await replyTextMessage(
    apiParams,
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
    (song: Song) => song.trackId === apiParams.interactiveReply
  );
}

async function handleDuplicatedSong(apiParams: APIParams) {
  await replyTextMessage(apiParams, ErrorMessages.DUPLICATED_SONG);
}

async function handleQueueSong(apiParams: APIParams) {
  const newRawSongResponse = await fetchSongByTrackId(
    apiParams.interactiveReply
  );
  const newSpotifySong = new SpotifyQueuedSong(
    newRawSongResponse.data,
    apiParams
  );

  songQueueManager.addSong(newSpotifySong);

  store.updateUser(apiParams.toPhoneNumber, {
    name: apiParams.requesterName,
    phoneNumber: apiParams.toPhoneNumber,
    nextAvailableSongTimestamp: Date.now() + 180 * 1000,
  });

  handleUpdateAndNotifyUser(apiParams, songQueueManager.getCurrentSongPlayingTime());
}

async function handleUpdateAndNotifyUser(
  apiParams: APIParams,
  remainingTime: number
) {
  if (remainingTime > 0) {
    await replyTextMessage(
      apiParams,
      `${SuccessMessages.SONG_QUEUED} ${getFormattedRemainigTime(
        remainingTime / 1000
      )}`
    );
  }
}

export { handleInteractiveMessage };
