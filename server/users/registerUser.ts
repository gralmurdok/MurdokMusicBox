import { persistUser, retrieveUsersFromDb } from "../database/databaseHandler";
import { replyTextMessage } from "../messaging/whatsapp";
import { store } from "../store";
import { APIParams, CrossRoadsUser, CrossroadsUserDBEntry } from "../types";

async function loadDatabaseUsers() {
  await retrieveUsersFromDb((user: CrossroadsUserDBEntry) => {
    const newUser: CrossRoadsUser = {
      name: user.name,
      phoneNumber: user.phone,
      nextAvailableSongTimestamp: Date.now(),
      searchResults: [],
      searchQuery: "",
      images: user.songs,
      songs: user.songs,
    };

    store.addUser(newUser);
  });
}

function registerUser(apiParams: APIParams) {
  const newUser: CrossRoadsUser = {
    name: apiParams.requesterName,
    phoneNumber: apiParams.toPhoneNumber,
    nextAvailableSongTimestamp: Date.now(),
    searchResults: [],
    searchQuery: apiParams.messageBody,
    images: [],
    songs: [],
  };
  store.addUser(newUser);
  const content = `Nombre: ${newUser.name}\nTelefono: ${newUser.phoneNumber}\nMensaje de entrada: ${newUser.searchQuery}`;
  replyTextMessage(process.env.MASTER_PHONE_NUMBER as string, content);
  persistUser(newUser);
}

function ensureUserIsRegistered(apiParams: APIParams) {
  const currentUser = store.getUser(apiParams.toPhoneNumber);
  if (!currentUser) {
    registerUser(apiParams);
  }
}

export { ensureUserIsRegistered, loadDatabaseUsers };
