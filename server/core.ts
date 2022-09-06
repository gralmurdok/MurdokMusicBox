import {
  getCurrentSong,
  queueSong,
  refreshToken,
  searchTracks,
} from "./spotify";
import { defaultCurrentSong, store } from "./store";
import { APIParams, QueuedSong } from "./types";
import { replyMusicBackToUser, replyTextMessage } from "./whatsapp";

async function handleGetCurrentSong() {
  try {
    const currentSong = await getCurrentSong(store.auth.accessToken);
    console.log(currentSong.data);
    const remainingTime =
      currentSong.data.item.duration_ms - (currentSong.data.progress_ms ?? 0);

    const trackId = currentSong.data.item.id;

    let requesterName: string;

    if (trackId === store.status.currentSong.trackId) {
      requesterName = store.status.currentSong.requesterName;
    } else if (store.status.songQueue[trackId]) {
      requesterName = (store.status.songQueue[trackId] as QueuedSong)
        .requesterName;
    } else {
      requesterName = "The Crossroads Loja";
    }

    if (store.status.songQueue[trackId]) {
      store.status = {
        ...store.status,
        songQueue: {
          ...store.status.songQueue,
          [trackId]: undefined,
        },
      };
    }

    return {
      trackId,
      name: currentSong.data.item.name,
      artist: currentSong.data.item.artists[0].name,
      endsAt: Date.now() + remainingTime,
      imgUrl: currentSong.data.item.album.images[0].url,
      requesterName,
    };
  } catch (err) {
    console.log(err);
    return defaultCurrentSong;
  }
}

async function handleMusicSearchViaWhatsappMessage(apiParams: APIParams) {
  try {
    const search = await searchTracks(
      apiParams.spotifyToken,
      apiParams.messageBody
    );
    console.log(JSON.stringify(search.data.tracks.items[0], null, 2));
    store.users[apiParams.toPhoneNumber] = {
      ...store.users[apiParams.toPhoneNumber],
      searchResults: search.data.tracks.items
        .map((track: any) => ({
          trackId: track.id,
          name: track.name,
          artist: track.artists[0].name,
          imgUrl: track.album.images[0].url,
          requesterName: apiParams.requesterName,
        }))
        .slice(0, 5),
      searchQuery: apiParams.messageBody,
    };
    await replyMusicBackToUser(apiParams);
  } catch (err) {
    console.log(err);
    await replyTextMessage(
      apiParams,
      "algo salio mal, acercate a la barra para reportarlo, nosotros lo arreglaremos"
    );
  }
}

async function handleQueueSong(apiParams: APIParams, trackId: string) {
  const now = Date.now();
  try {
    if (getCurrentUser(apiParams).nextAvailableSongTimestamp > now) {
      const remainingMiliseconds =
        getCurrentUser(apiParams).nextAvailableSongTimestamp - now;
      const remainingSeconds = remainingMiliseconds / 1000;
      await replyTextMessage(
        apiParams,
        `puedes pedir tu siguiente cancion en ${Math.floor(
          remainingSeconds / 60
        )}:${remainingMiliseconds % 60} minutos`
      );
    } else if (store.status.songQueue[trackId]) {
      await replyTextMessage(apiParams, "oh, aquella cancion ya esta en cola");
    } else {
      const queuedSong = getCurrentUser(apiParams).searchResults.find(
        (song) => song.trackId === trackId
      );
      if (queuedSong) {
        store.status.songQueue = {
          ...store.status.songQueue,
          [queuedSong.trackId]: {
            ...queuedSong,
            requestedAt: now,
          },
        };
        await queueSong(apiParams.spotifyToken, trackId);
        await replyTextMessage(apiParams, "tu cancion esta en la cola");
        store.users[apiParams.toPhoneNumber] = {
          ...store.users[apiParams.toPhoneNumber],
          name: apiParams.requesterName,
          phoneNumber: apiParams.toPhoneNumber,
          nextAvailableSongTimestamp: now + 300 * 1000,
        };
      } else {
        await replyTextMessage(
          apiParams,
          "asegurate de escoger una cancion de tu busqueda reciente"
        );
      }
    }
  } catch (err) {
    console.log(err);
    await replyTextMessage(
      apiParams,
      "algo salio mal, acercate a la barra para reportarlo, nosotros lo arreglaremos"
    );
  }
}

function generateRandomPermitToken() {
  return (Math.floor(Math.random() * 9000) + 1000).toString();
}

async function updateAppStatus() {
  const now = Date.now();
  const permitTokenTimeInMinutes = parseFloat(
    process.env.PERMIT_REFRESH_MINS ?? "60"
  );
  const permitTokenInMiliseconds = now + permitTokenTimeInMinutes * 60 * 1000;
  const shouldRefreshToken = store.auth.expiresAt < now;

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
    currentSong: await handleGetCurrentSong(),
    songQueue: {
      ...store.status.songQueue,
      [store.status.currentSong.trackId]: undefined,
    },
  };
}

async function registerUser(apiParams: APIParams) {
  const newUser = {
    name: apiParams.requesterName,
    phoneNumber: apiParams.toPhoneNumber,
    nextAvailableSongTimestamp: Date.now(),
    authorizedUntil: Date.now(),
    searchResults: [],
    searchQuery: apiParams.messageBody,
  };
  store.users[apiParams.toPhoneNumber] = newUser;

  const content = `Nombre: ${newUser.name}\nTelefono: ${newUser.phoneNumber}\nMensaje de entrada: ${newUser.searchQuery}`;
  await replyTextMessage(
    { ...apiParams, toPhoneNumber: "593960521867" },
    content
  );

  await replyTextMessage(
    apiParams,
    "Bienvenido a Crossroads Loja, por favor ingresa el codigo de 4 digitos que esta en pantalla para usar el servicio de musica."
  );
  return newUser;
}

function getCurrentUser(apiParams: APIParams) {
  return store.users[apiParams.toPhoneNumber];
}

function isAuthorizedUser(apiParams: APIParams) {
  return getCurrentUser(apiParams).authorizedUntil > Date.now();
}

async function authorizeUser(apiParams: APIParams) {
  const now = Date.now();
  const authorizedUntil =
    store.status.permitToken.token === apiParams.messageBody
      ? now + parseFloat(process.env.PERMIT_REFRESH_MINS ?? "60") * 60 * 1000
      : now;

  if (authorizedUntil > now) {
    store.users[apiParams.toPhoneNumber] = {
      ...store.users[apiParams.toPhoneNumber],
      authorizedUntil,
    };
    await handleMusicSearchViaWhatsappMessage({
      ...apiParams,
      messageBody: store.users[apiParams.toPhoneNumber].searchQuery,
    });
  } else {
    store.users[apiParams.toPhoneNumber] = {
      ...store.users[apiParams.toPhoneNumber],
      searchQuery: apiParams.messageBody,
    };
    await replyTextMessage(
      apiParams,
      "por favor ingresa el codigo que ves en pantalla, para continuar con la busqueda"
    );
  }
}

function determineOperation(apiParams: APIParams) {
  let rv;
  if (!getCurrentUser(apiParams)) {
    rv = "register";
  } else if (!isAuthorizedUser(apiParams)) {
    rv = "authorizeUser";
  } else if (isAuthorizedUser(apiParams)) {
    rv = "receiptSongs";
  }
  return rv;
}

export {
  authorizeUser,
  registerUser,
  determineOperation,
  handleMusicSearchViaWhatsappMessage,
  handleQueueSong,
  updateAppStatus,
  getCurrentUser,
  isAuthorizedUser,
};
