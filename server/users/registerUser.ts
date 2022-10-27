import { Defaults } from "../constants";
import { replyTextMessage } from "../messaging/whatsapp";
import { store } from "../store";
import { APIParams } from "../types";

function registerUser(apiParams: APIParams) {
  const newUser = {
    name: apiParams.requesterName,
    phoneNumber: apiParams.toPhoneNumber,
    nextAvailableSongTimestamp: Date.now(),
    searchResults: [],
    searchQuery: apiParams.messageBody,
  };
  store.addUser(newUser);

  const content = `Nombre: ${newUser.name}\nTelefono: ${newUser.phoneNumber}\nMensaje de entrada: ${newUser.searchQuery}`;
  replyTextMessage(
    { ...apiParams, toPhoneNumber: Defaults.MASTER_NUMBER },
    content
  );
}

function ensureUserIsRegistered(apiParams: APIParams) {
  const currentUser = store.getUser(apiParams.toPhoneNumber);
  if (!currentUser) {
    registerUser(apiParams);
  }
}

export { ensureUserIsRegistered };