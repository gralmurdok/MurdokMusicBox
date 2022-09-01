import { getCurrentSong, queueSong, refreshToken, searchTracks } from "./spotify";
import { store } from "./store";
import { APIParams, PlayingSong } from "./types";
import { replyMusicBackToUser, replyTextMessage } from "./whatsapp";

async function handleGetCurrentSong() {
  try {
    console.log('fetching current song...')
    const currentSong = await getCurrentSong(store.auth.accessToken);
    const remainingTime = currentSong.data.item.duration_ms - (currentSong.data.progress_ms ?? 0);
    return {
      trackId: currentSong.data.item.id,
      name: currentSong.data.item.name,
      artist: currentSong.data.item.artists[0].name,
      endsAt: Date.now() + remainingTime,
      imgUrl: currentSong.data.item.album.images[0].url,
      requesterName: 'Silvana Robles',
    }
  } catch(err) {
    console.log(err);
    store.status = {
      ...store.status,
      readyToFetchCurrentSong: false,
    }
    return {
      trackId: 'Not playing',
      name: 'Not playing',
      artist: 'Not playing',
      endsAt: 0,
      requesterName: '',
      imgUrl: '',
    }
  }
}

async function handleMusicSearchViaWhatsappMessage(
  apiParams: APIParams,
) {
  try {
    const search = await searchTracks(apiParams.spotifyToken, apiParams.messageBody);
    console.log(JSON.stringify(search.data.tracks.items[0], null, 2));
    store.users[apiParams.toPhoneNumber] = {
      ...store.users[apiParams.toPhoneNumber],
      searchResults: search.data.tracks.items.map((track: any) => ({
        trackId: track.id,
        name: track.name,
        artist: track.artists[0].name,
        imgUrl: track.album.images[0].url,
        requesterName: apiParams.requesterName,
      })).slice(0, 5),
    }
    
    await replyMusicBackToUser(apiParams);
  } catch (err) {
    console.log(err);
    await replyTextMessage(
      apiParams,
      "algo salio mal, acercate a la barra para reportarlo, nosotros lo arreglaremos"
    );
  }
}

async function handleQueueSong(
  apiParams: APIParams,
  trackId: string,
) {
  try {
    if (store.users[apiParams.toPhoneNumber]?.nextAvailableSongTimestamp > Date.now()) {
      await replyTextMessage(
        apiParams,
        "solo puedes pedir una cancion cada 5 minutos"
      );
      console.log(store.users);
    } else {
      await queueSong(apiParams.spotifyToken, trackId);

      // store.songQueue = {
      //   ...store.songQueue,
      //   {
      //     requestedAt: Date.now(),

      //   }
      // }

      await replyTextMessage(
        apiParams,
        "tu cancion esta en la cola"
      );
      store.users[apiParams.toPhoneNumber] = {
        ...store.users[apiParams.toPhoneNumber],
        name: apiParams.requesterName,
        phoneNumber: apiParams.toPhoneNumber,
        nextAvailableSongTimestamp: Date.now() + 300 * 1000,
      };
      store.status = {
        ...store.status,
        readyToFetchCurrentSong: true,
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
  const permitTokenTimeInMinutes = 60;
  const permitTokenInMiliseconds = now + permitTokenTimeInMinutes * 60 * 1000;
  const shouldFetchCurrentSong = store.status.currentSong.endsAt < now;
  const shouldRefreshToken = store.auth.expiresAt < now;

  if (shouldRefreshToken) {
    await refreshToken();
  }

  store.status = {
    ...store.status,
    isReady: !!store.auth.accessToken,
    permitToken: store.status.permitToken.validUntil < now ? {
      token: generateRandomPermitToken(),
      validUntil: permitTokenInMiliseconds,
    } : store.status.permitToken,
    currentSong: store.status.readyToFetchCurrentSong && shouldFetchCurrentSong ? await handleGetCurrentSong() : store.status.currentSong
  };
}

async function registerUser(apiParams: APIParams) {
  const newUser = {
    name: apiParams.requesterName,
    phoneNumber: apiParams.toPhoneNumber,
    nextAvailableSongTimestamp: Date.now(),
    authorizedUntil: Date.now(),
    searchResults: [],
  };
  store.users[apiParams.toPhoneNumber] = newUser;
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
  const authorizedUntil = store.status.permitToken.token === apiParams.messageBody ? now + 60 * 60 * 1000 : now;

  if (authorizedUntil > now) {
    store.users[apiParams.toPhoneNumber] = {
      ...store.users[apiParams.toPhoneNumber],
      authorizedUntil,
    }
    await replyTextMessage(
      apiParams,
      "Genial, ahora escribe una cancion o artista y nosotros la agregaremos a la cola de reproduccion para ti."
    );
  } else {
    await replyTextMessage(
      apiParams,
      "codigo incorrecto, ingresa nuevamente el codigo que ves en pantalla"
    );
  }
}

function determineOperation(apiParams: APIParams) {
  let rv;
  if (!getCurrentUser(apiParams)) {
    rv = 'register';
  } else if (!isAuthorizedUser(apiParams)) {
    rv = 'authorizeUser'
  } else if (isAuthorizedUser(apiParams)) {
    rv = 'receiptSongs'
  }
  return rv;
}

export { authorizeUser, registerUser, determineOperation, handleMusicSearchViaWhatsappMessage, handleQueueSong, updateAppStatus, getCurrentUser, isAuthorizedUser };
