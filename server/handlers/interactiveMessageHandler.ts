import { Defaults, ErrorMessages } from "../constants";
import { replyTextMessage } from "../messaging/whatsapp";
import { SpotifyQueuedSong } from "../music/song";
import { SpotifySongQueueManager } from "../music/songQueueManager";
import { fetchSongByTrackId } from "../music/spotify";
import { store } from "../store";
import { APIParams, Song } from "../types";
import { getFormattedRemainigTime } from "../utils";

const songQueueManager = new SpotifySongQueueManager();

async function handleInteractiveMessage(apiParams: APIParams) {
  console.log('HANDLING AS INTERACTIVE MESSAGE ' + apiParams.interactiveReply);
  if (isDuplicatedSong(apiParams)) {
    await handleDuplicatedSong(apiParams);
  } else {
    await handleQueueSong(apiParams);
  }
}

function isDuplicatedSong(apiParams: APIParams) {
  const currentSong = store.getCurrentSong();
  const songQueue = store.status.songQueue;
  const scheduledSongList = [...songQueue, currentSong];

  return !!scheduledSongList.find((song: Song) => song.trackId === apiParams.interactiveReply);
}

async function handleDuplicatedSong(apiParams: APIParams) {
  await replyTextMessage(apiParams, ErrorMessages.DUPLICATED_SONG);
}

async function handleQueueSong(apiParams: APIParams) {
  const currentSong = store.getCurrentSong();
  const newRawSongResponse = await fetchSongByTrackId(apiParams.interactiveReply);
  const newSpotifySong = new SpotifyQueuedSong(
    newRawSongResponse.data,
    apiParams.requesterName
  );
  const remainingTimeInMs = songQueueManager
    .retrieveRemainingSongs()
    .reduce((accum: number, song: Song) => {
      return accum + song.durationMs;
    }, currentSong.remainingTime);

  const remainingTime =
    currentSong.requesterName === Defaults.REQUESTER_NAME
      ? 0
      : remainingTimeInMs;
  songQueueManager.addSong(newSpotifySong, remainingTime);

  handleUpdateAndNotifyUser(apiParams, remainingTime);
}

async function handleUpdateAndNotifyUser(apiParams: APIParams, remainingTime: number) {
  await replyTextMessage(
    apiParams,
    `Tu cancion esta en la cola, y se reproducira en ${getFormattedRemainigTime(
      remainingTime / 1000
    )}`
  );

  store.updateUser(apiParams.toPhoneNumber, {
    name: apiParams.requesterName,
    phoneNumber: apiParams.toPhoneNumber,
    nextAvailableSongTimestamp: Date.now() + 180 * 1000,
  });
}

export { handleInteractiveMessage };