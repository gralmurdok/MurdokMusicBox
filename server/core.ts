import { Defaults } from "./constants";
import { broadcastData } from "./setup";
import { SpotifyCurrentSong, SpotifyQueuedSong } from "./music/song";
import { SpotifySongQueueManager } from "./music/songQueueManager";
import {
  getCurrentSong,
  refreshToken,
  searchTracks,
  fetchSongByTrackId,
} from "./music/spotify";
import { store } from "./store";
import { APIParams, Song } from "./types";
import { replyMusicBackToUser, replyTextMessage } from "./messaging/whatsapp";

const songQueueManager = new SpotifySongQueueManager();

function getFormattedRemainigTime(remainingSeconds: number) {
  const absRemainingSeconds = Math.abs(remainingSeconds);
  return `${Math.floor(absRemainingSeconds / 60)} minutos y ${Math.floor(
    absRemainingSeconds % 60
  )} segundos`;
}

async function updateCurrentPlayingSong() {
  try {
    const currentRawSong = await getCurrentSong(store.auth.accessToken);
    const currentSong = new SpotifyCurrentSong(
      currentRawSong.data.item,
      currentRawSong.data.progress_ms
    );
    store.setIsSpotifyReady(true);
    store.setIsPlayingMusic(currentRawSong.data.is_playing);
    store.setCurrentSong(currentSong);
    store.updateLast5Played();
  } catch (err) {
    store.setIsSpotifyReady(false);
    store.setIsPlayingMusic(false);
  }
}

async function handleMusicSearchViaWhatsappMessage(apiParams: APIParams) {
  try {
    const search = await searchTracks(
      apiParams.spotifyToken,
      apiParams.messageBody
    );
    store.updateUser(apiParams.toPhoneNumber, {
      searchResults: search.data.tracks.items
        .map((track: any) => ({
          trackId: track.id,
          name: track.name,
          artist: track.artists[0].name,
          imgUrl: track.album.images[0].url,
          requesterName: apiParams.requesterName,
          durationMs: track.duration_ms,
        }))
        .slice(0, 10),
      searchQuery: apiParams.messageBody,
    });
    await replyMusicBackToUser(apiParams);
  } catch (err) {
    console.log(err);
    await replyTextMessage(
      apiParams,
      "Algo salio mal, acercate a la barra para reportarlo, nosotros lo arreglaremos"
    );
  }
}

async function handleQueueSong(apiParams: APIParams, trackId: string) {
  const currentUser = store.getUser(apiParams.toPhoneNumber);
  const currentSong = store.getCurrentSong();
  const now = Date.now();
  try {
    if (
      currentUser.phoneNumber !== Defaults.MASTER_NUMBER &&
      currentUser.nextAvailableSongTimestamp > now
    ) {
      const remainingMiliseconds =
        store.getUser(apiParams.toPhoneNumber).nextAvailableSongTimestamp - now;
      const remainingSeconds = remainingMiliseconds / 1000;
      await replyTextMessage(
        apiParams,
        `Puedes pedir tu siguiente cancion en ${getFormattedRemainigTime(
          remainingSeconds
        )}`
      );
    } else if (store.status.songQueue.find((song) => song.trackId === trackId)) {
      await replyTextMessage(apiParams, "Oh, aquella cancion ya esta en cola");
    } else {
      const currentUser = store.getUser(apiParams.toPhoneNumber);
      const newRawSongResponse = await fetchSongByTrackId(trackId);
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

      await replyTextMessage(
        apiParams,
        `Tu cancion esta en la cola, y se reproducira en ${getFormattedRemainigTime(
          remainingTime / 1000
        )}`
      );

      console.log(
        newSpotifySong.name +
          " will be played in " +
          getFormattedRemainigTime(remainingTime / 1000)
      );

      store.updateUser(apiParams.toPhoneNumber, {
        name: apiParams.requesterName,
        phoneNumber: apiParams.toPhoneNumber,
        nextAvailableSongTimestamp: now + 180 * 1000,
      });

      const content = `Nombre: ${currentUser.name}\nTelefono: ${currentUser.phoneNumber}\nCancion: ${newSpotifySong.name} - ${newSpotifySong.artist}`;
      await replyTextMessage(
        { ...apiParams, toPhoneNumber: "593960521867" },
        content
      );
    }
  } catch (err) {
    console.log(err);
    await replyTextMessage(
      apiParams,
      "Algo salio mal, acercate a la barra para reportarlo, nosotros lo arreglaremos"
    );
  }
}

function getRandomInt(limit: number) {
  return Math.floor(Math.random() * limit);
}

function generateRandomPermitToken() {
  return (getRandomInt(9000) + 1000).toString();
}

async function updateAppStatus() {
  const now = Date.now();
  const shouldRefreshToken = store.auth.expiresAt < now;

  if (shouldRefreshToken) {
    await refreshToken();
  }

  await updateCurrentPlayingSong();
  store.updateAuthStatus();
  broadcastData(store.status);
}

async function registerUser(apiParams: APIParams) {
  const newUser = {
    name: apiParams.requesterName,
    phoneNumber: apiParams.toPhoneNumber,
    nextAvailableSongTimestamp: Date.now(),
    searchResults: [],
    searchQuery: apiParams.messageBody,
  };
  store.addUser(newUser);
  await handleMusicSearchViaWhatsappMessage(apiParams);
  const content = `Nombre: ${newUser.name}\nTelefono: ${newUser.phoneNumber}\nMensaje de entrada: ${newUser.searchQuery}`;
  await replyTextMessage(
    { ...apiParams, toPhoneNumber: Defaults.MASTER_NUMBER },
    content
  );
}

function determineOperation(apiParams: APIParams) {
  let rv;
  if (!store.auth.accessToken) {
    rv = "noAuth";
  } else if (!store.getUser(apiParams.toPhoneNumber)) {
    rv = "register";
  } else {
    rv = "receiptSongs";
  }
  return rv;
}

export {
  determineOperation,
  handleMusicSearchViaWhatsappMessage,
  handleQueueSong,
  updateAppStatus,
};
