import { Defaults } from "./constants";
import {
  getCurrentSong,
  play,
  queueSong,
  playAlbum,
  refreshToken,
  searchTracks,
} from "./spotify";
import { store } from "./store";
import { APIParams, QueuedSong, Song } from "./types";
import { replyMusicBackToUser, replyTextMessage } from "./whatsapp";

function getFormattedRemainigTime(remainingSeconds: number) {
  return `${Math.floor(
    remainingSeconds / 60
  )} minutos y ${Math.floor(remainingSeconds % 60)} segundos`;
}

async function playNextSong(forcePlaySong?: boolean) {
  const sortedSongQueue = getSortedSongQueue();

  if (!!forcePlaySong) {
    await play(store.auth.accessToken, sortedSongQueue[0].trackId);
  } else {
    await queueSong(store.auth.accessToken, sortedSongQueue[0].trackId);
  }

  store.status = {
    ...store.status,
    currentSong: {
      ...store.status.currentSong,
      requesterName: sortedSongQueue[0].requesterName,
    },
    songQueue: {
      ...store.status.songQueue,
      [sortedSongQueue[0].trackId]: undefined,
    },
    isPlayingFromQueue: true,
  };
  console.log("PLAYING NEXT FROM QUEUE: " + sortedSongQueue[0].artist);
}

async function handleGetCurrentSong() {
  try {
    const currentSong = await getCurrentSong(store.auth.accessToken);
    const remainingTime =
      currentSong.data.item.duration_ms - (currentSong.data.progress_ms ?? 0);
    const trackId = currentSong.data.item.id;

    return {
      ...store.status.currentSong,
      trackId,
      name: currentSong.data.item.name,
      artist: currentSong.data.item.artists[0].name,
      albumId: currentSong.data.item.album.id,
      nextDefaultSong: getRandomInt(currentSong.data.item.album.total_tracks),
      endsAt: Date.now() + remainingTime,
      imgUrl: currentSong.data.item.album.images[0].url,
      durationMs: currentSong.data.duration_ms,
    };
  } catch (err) {
    console.log(err);
    return store.status.currentSong;
  }
}

async function handleMusicSearchViaWhatsappMessage(apiParams: APIParams) {
  try {
    const search = await searchTracks(
      apiParams.spotifyToken,
      apiParams.messageBody
    );
    store.users[apiParams.toPhoneNumber] = {
      ...store.users[apiParams.toPhoneNumber],
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
    };
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
  const currentUser = getCurrentUser(apiParams);
  const now = Date.now();
  try {
    if (currentUser.phoneNumber !== Defaults.MASTER_NUMBER && currentUser.nextAvailableSongTimestamp > now) {
      const remainingMiliseconds =
        getCurrentUser(apiParams).nextAvailableSongTimestamp - now;
      const remainingSeconds = remainingMiliseconds / 1000;
      await replyTextMessage(apiParams, `Puedes pedir tu siguiente cancion en ${getFormattedRemainigTime(remainingSeconds)}`);
    } else if (store.status.songQueue[trackId]) {
      await replyTextMessage(apiParams, "Oh, aquella cancion ya esta en cola");
    } else {
      const queuedSong = getCurrentUser(apiParams).searchResults.find(
        (song) => song.trackId === trackId
      );
      if (queuedSong) {
        const forcePlayNextSong =
          store.status.currentSong.requesterName === Defaults.REQUESTER_NAME;
        const remainingSortedSongQueue = getSortedSongQueue();

        store.status.songQueue = {
          ...store.status.songQueue,
          [queuedSong.trackId]: {
            ...queuedSong,
            requestedAt: now,
          },
        };

        if (forcePlayNextSong) {
          await playNextSong(true);
          await replyTextMessage(apiParams, "Tu cancion se reproducira ahora.");
        } else {
          const remainingMilisecondsOfCurrentSong = store.status.currentSong.endsAt - Date.now();
          const remainingSeconds = remainingSortedSongQueue.reduce((accum: number, song: Song) => {
            return accum + song.durationMs;
          }, remainingMilisecondsOfCurrentSong) / 1000;

          await replyTextMessage(
            apiParams,
            `Tu cancion esta en la cola, y se reproducira en ${getFormattedRemainigTime(
              remainingSeconds
            )}`
          );
        }

        store.users[apiParams.toPhoneNumber] = {
          ...store.users[apiParams.toPhoneNumber],
          name: apiParams.requesterName,
          phoneNumber: apiParams.toPhoneNumber,
          nextAvailableSongTimestamp: now + 180 * 1000,
        };
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

function getSortedSongQueue() {
  return Object.keys(store.status.songQueue)
    .map((trackId) => store.status.songQueue[trackId] as QueuedSong)
    .sort((a: QueuedSong, b: QueuedSong) => a.requestedAt - b.requestedAt)
    .filter((x) => !!x);
}

async function updateAppStatus() {
  const currentSong = await handleGetCurrentSong();
  const sortedSongQueue = getSortedSongQueue();
  const now = Date.now();
  const permitTokenTimeInMinutes = parseFloat(
    process.env.PERMIT_REFRESH_MINS ?? "60"
  );
  const permitTokenInMiliseconds = now + permitTokenTimeInMinutes * 60 * 1000;
  const shouldRefreshToken = store.auth.expiresAt < now;
  const untilNextSong = currentSong.endsAt - now;

  if (shouldRefreshToken) {
    await refreshToken();
  }

  store.status = {
    ...store.status,
    isReady: !!store.auth.accessToken,
    permitToken:
      store.status.permitToken.validUntil < now
        ? {
            token: generateRandomPermitToken(),
            validUntil: permitTokenInMiliseconds,
          }
        : store.status.permitToken,
    currentSong,
  };

  if (untilNextSong < 10000 && !store.status.isNextSongDefined) {
    const shouldPlayNextQueuedSong =
      sortedSongQueue.length > 0 &&
      sortedSongQueue[0].trackId !== currentSong.trackId;
    setTimeout(async () => {
      try {
        if (shouldPlayNextQueuedSong) {
          await playNextSong();
        } else if (store.status.isPlayingFromQueue) {
          await playAlbum(
            store.auth.accessToken,
            currentSong.albumId,
            currentSong.nextDefaultSong
          );
          store.status = {
            ...store.status,
            currentSong: {
              ...store.status.currentSong,
              requesterName: Defaults.REQUESTER_NAME,
            },
            isPlayingFromQueue: false,
          };
          console.log("PLAYING NEXT FROM ALBUM: " + currentSong.artist);
        }
      } catch (err) {
        console.log(err);
      }
    }, untilNextSong - 1000);

    store.status = {
      ...store.status,
      isNextSongDefined: true,
    };
  } else {
    store.status = {
      ...store.status,
      isNextSongDefined: false,
    };
  }
}

async function registerUser(apiParams: APIParams) {
  const newUser = {
    name: apiParams.requesterName,
    phoneNumber: apiParams.toPhoneNumber,
    nextAvailableSongTimestamp: Date.now(),
    searchResults: [],
    searchQuery: apiParams.messageBody,
  };
  store.users = {
    ...store.users,
    [apiParams.toPhoneNumber]: newUser,
  };

  await handleMusicSearchViaWhatsappMessage(apiParams);

  const content = `Nombre: ${newUser.name}\nTelefono: ${newUser.phoneNumber}\nMensaje de entrada: ${newUser.searchQuery}`;
  await replyTextMessage(
    { ...apiParams, toPhoneNumber: "593960521867" },
    content
  );

  return newUser;
}

function getCurrentUser(apiParams: APIParams) {
  return store.users[apiParams.toPhoneNumber];
}

function determineOperation(apiParams: APIParams) {
  let rv;
  if (!getCurrentUser(apiParams)) {
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
  getCurrentUser,
};
