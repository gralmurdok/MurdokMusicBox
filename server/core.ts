import { Defaults, TimeDefaults } from "./constants";
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
  const absRemainingSeconds = Math.abs(remainingSeconds);
  return `${Math.floor(absRemainingSeconds / 60)} minutos y ${Math.floor(
    absRemainingSeconds % 60
  )} segundos`;
}

async function playNextSong(forcePlaySong?: boolean) {
  const sortedSongQueue = getSortedSongQueue();
  const nextSong = sortedSongQueue[0];

  if (store.status.isReady && nextSong) {
    if (!!forcePlaySong) {
      await play(store.auth.accessToken, nextSong.trackId);
    } else {
      await queueSong(store.auth.accessToken, nextSong.trackId);
    }
    store.removeSongFromQueue(nextSong.trackId);
    store.updateCurrentSongRequester(nextSong.requesterName);
    store.updateWhenNextSongShouldBeQueued(nextSong.durationMs);
  } else if (store.status.isReady && !store.status.isPlayingMusic) {
    const currentSong = store.getCurrentSong();
    await playAlbum(
      store.auth.accessToken,
      currentSong.albumId,
      currentSong.nextDefaultSong
    );
    await updateCurrentPlayingSong();
    store.updateCurrentSongRequester(Defaults.REQUESTER_NAME);
    store.updateWhenNextSongShouldBeQueued(store.getCurrentSong().durationMs);
  }
}

async function updateCurrentPlayingSong() {
  try {
    const currentSong = await getCurrentSong(store.auth.accessToken);
    const remainingTime =
      currentSong.data.item.duration_ms - (currentSong.data.progress_ms ?? 0);
    const trackId = currentSong.data.item.id;

    store.setIsSpotifyReady(true);
    store.setIsPlayingMusic(currentSong.data.is_playing)
    store.setCurrentSong({
      trackId,
      name: currentSong.data.item.name,
      artist: currentSong.data.item.artists[0].name,
      albumId: currentSong.data.item.album.id,
      nextDefaultSong: getRandomInt(currentSong.data.item.album.total_tracks),
      endsAt: Date.now() + remainingTime,
      imgUrl: currentSong.data.item.album.images[0].url,
      durationMs: currentSong.data.item.duration_ms,
    });
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
    })
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
        const remainingSortedSongQueue = getSortedSongQueue();
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

function getSortedSongQueue() {
  return Object.keys(store.status.songQueue)
    .map((trackId) => store.status.songQueue[trackId] as QueuedSong)
    .sort((a: QueuedSong, b: QueuedSong) => a.requestedAt - b.requestedAt)
    .filter((x) => !!x);
}

async function updateAppStatus() {
  const now = Date.now();
  const shouldRefreshToken = store.auth.expiresAt < now;
  console.log(new Date(store.status.nextSongShouldBeQueuedAt).toLocaleTimeString());
  const shouldQueueNextSong = store.status.nextSongShouldBeQueuedAt < now;

  if (shouldRefreshToken) {
    await refreshToken();
  }

  if (shouldQueueNextSong) {
    try {
      await playNextSong();
    } catch(err) {
      store.updateCurrentSongRequester(Defaults.REQUESTER_NAME);
    }
  }

  // const permitTokenTimeInMinutes = parseFloat(
  //   process.env.PERMIT_REFRESH_MINS ?? "60"
  // );
  // const permitTokenInMiliseconds = now + permitTokenTimeInMinutes * 60 * 1000;
  // store.status = {
  //   ...store.status,
  //   isAuth: !!store.auth.accessToken,
  //   permitToken:
  //     store.status.permitToken.validUntil < now
  //       ? {
  //           token: generateRandomPermitToken(),
  //           validUntil: permitTokenInMiliseconds,
  //         }
  //       : store.status.permitToken,
  // };

  await updateCurrentPlayingSong();
  store.updateAuthStatus();
  console.log(getSortedSongQueue());
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