import { Defaults } from "./constants";
import { broadcastData } from "./setup";
import {
  getCurrentSong,
  play,
  queueSong,
  refreshToken,
  searchTracks,
  getRecomendedSongs,
} from "./spotify";
import { store } from "./store";
import { APIParams, QueuedSong, Song } from "./types";
import { replyMusicBackToUser, replyTextMessage } from "./whatsapp";

function getFormattedRemainigTime(remainingSeconds: number) {
  const absRemainingSeconds = Math.abs(remainingSeconds);
  return `${Math.floor(absRemainingSeconds / 60)} minutos y ${Math.floor(
    absRemainingSeconds % 60
  )} segundos`;
}

async function fallbackToRecommendedSongs() {
  const recomendedSongs = await getRecomendedSongs();
  const tracks = recomendedSongs.data.tracks;
  const trackIds = tracks.map((track: { id: string }) => track.id);
  await play(trackIds);
  store.updateCurrentSongRequester(Defaults.REQUESTER_NAME);
  store.updateWhenNextSongShouldBeQueued(tracks[0].duration_ms);
}

function consumeSongFromQueue(nextSong: QueuedSong) {
  store.removeSongFromQueue(nextSong.trackId);
  store.updateCurrentSongRequester(nextSong.requesterName);
  store.updateWhenNextSongShouldBeQueued(nextSong.durationMs);
}

async function playNextSong(forcePlaySong?: boolean) {
  const sortedSongQueue = store.getSortedSongQueue();
  const nextSong = sortedSongQueue[0];

  if (store.status.isReady && nextSong) {
    if (!!forcePlaySong) {
      await play([nextSong.trackId]);
    } else {
      await queueSong(store.auth.accessToken, nextSong.trackId);
    }
    consumeSongFromQueue(nextSong);
  } else if (store.status.isReady && !store.status.isPlayingMusic) {
    await fallbackToRecommendedSongs();
  }
}

async function updateCurrentPlayingSong() {
  try {
    const currentRawSong = await getCurrentSong(store.auth.accessToken);
    const remainingTime =
      currentRawSong.data.item.duration_ms -
      (currentRawSong.data.progress_ms ?? 0);
    const trackId = currentRawSong.data.item.id;

    store.setIsSpotifyReady(true);
    store.setIsPlayingMusic(currentRawSong.data.is_playing);
    const currentSong = {
      trackId,
      name: currentRawSong.data.item.name,
      artist: currentRawSong.data.item.artists[0].name,
      albumId: currentRawSong.data.item.album.id,
      nextDefaultSong: getRandomInt(
        currentRawSong.data.item.album.total_tracks
      ),
      endsAt: Date.now() + remainingTime,
      imgUrl: currentRawSong.data.item.album.images[0].url,
      durationMs: currentRawSong.data.item.duration_ms,
    };
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
    } else if (store.status.songQueue[trackId]) {
      await replyTextMessage(apiParams, "Oh, aquella cancion ya esta en cola");
    } else {
      const currentUser = store.getUser(apiParams.toPhoneNumber);
      const queuedSong = currentUser.searchResults.find(
        (song) => song.trackId === trackId
      );
      if (queuedSong) {
        const forcePlayNextSong =
          currentSong.requesterName === Defaults.REQUESTER_NAME;
        const remainingSortedSongQueue = store.getSortedSongQueue();
        store.addSongToQueue(queuedSong);

        if (forcePlayNextSong) {
          await playNextSong(true);
          await replyTextMessage(apiParams, "Tu cancion se reproducira ahora.");
        } else {
          const remainingMilisecondsOfCurrentSong =
            currentSong.endsAt - Date.now();
          const remainingSeconds =
            remainingSortedSongQueue.reduce((accum: number, song: Song) => {
              return accum + song.durationMs;
            }, remainingMilisecondsOfCurrentSong) / 1000;

          await replyTextMessage(
            apiParams,
            `Tu cancion esta en la cola, y se reproducira en ${getFormattedRemainigTime(
              remainingSeconds
            )}`
          );
        }

        store.updateUser(apiParams.toPhoneNumber, {
          name: apiParams.requesterName,
          phoneNumber: apiParams.toPhoneNumber,
          nextAvailableSongTimestamp: now + 180 * 1000,
        });

        broadcastData(store.status);

        const content = `Nombre: ${currentUser.name}\nTelefono: ${currentUser.phoneNumber}\nCancion: ${queuedSong.name} - ${queuedSong.artist}`;
        await replyTextMessage(
          { ...apiParams, toPhoneNumber: "593960521867" },
          content
        );
      } else {
        await replyTextMessage(
          apiParams,
          "Asegurate de escoger una cancion de tu busqueda reciente"
        );
      }
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
  const shouldQueueNextSong = store.status.nextSongShouldBeQueuedAt < now;

  if (shouldRefreshToken) {
    await refreshToken();
  }

  if (shouldQueueNextSong) {
    try {
      await playNextSong();
    } catch (err) {
      console.log(err);
      store.updateCurrentSongRequester(Defaults.REQUESTER_NAME);
    }
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
  registerUser,
  determineOperation,
  handleMusicSearchViaWhatsappMessage,
  handleQueueSong,
  updateAppStatus,
};
