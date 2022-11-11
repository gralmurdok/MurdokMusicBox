import { Defaults } from "../constants";
import { replyTextMessage } from "../messaging/whatsapp";
import { store } from "../store";
import { APIParams, CrossRoadsUser } from "../types";

function registerUser(apiParams: APIParams) {
  const newUser: CrossRoadsUser = {
    name: apiParams.requesterName,
    phoneNumber: apiParams.toPhoneNumber,
    nextAvailableSongTimestamp: Date.now(),
    searchResults: [],
    searchQuery: apiParams.messageBody,
    images: [],
  };
  store.addUser(newUser);

  const content = `Nombre: ${newUser.name}\nTelefono: ${newUser.phoneNumber}\nMensaje de entrada: ${newUser.searchQuery}`;
  replyTextMessage(process.env.MASTER_PHONE_NUMBER2 as string, content);
}

function ensureUserIsRegistered(apiParams: APIParams) {
  const currentUser = store.getUser(apiParams.toPhoneNumber);
  if (!currentUser) {
    registerUser(apiParams);
  }
}

export { ensureUserIsRegistered };
