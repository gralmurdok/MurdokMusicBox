import { queueSong, searchTracks } from "./spotify";
import { store } from "./store";
import { APIParams } from "./types";
import { replyMusicBackToUser, replyTextMessage } from "./whatsapp";

async function handleMusicSearchViaWhatsappMessage(
  apiParams: APIParams,
) {
  try {
    const search = await searchTracks(apiParams.spotifyToken, apiParams.messageBody);
    console.log(JSON.stringify(search.data.tracks.items[0], null, 2));
    await replyMusicBackToUser(
      apiParams,
      search.data.tracks.items
    );
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

function updateAppStatus() {
  const permitTokenTimeInMinutes = 60;
  const permitTokenInMiliseconds = Date.now() + permitTokenTimeInMinutes * 60 * 1000;

  store.status = {
    isReady: !!store.auth.accessToken,
    permitToken: store.status.permitToken.validUntil < Date.now() ? {
      token: generateRandomPermitToken(),
      validUntil: permitTokenInMiliseconds,
    } : store.status.permitToken
  };
}

async function registerUser(apiParams: APIParams) {
  const newUser = {
    name: apiParams.requesterName,
    phoneNumber: apiParams.toPhoneNumber,
    nextAvailableSongTimestamp: Date.now(),
    authorizedUntil: Date.now(),
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