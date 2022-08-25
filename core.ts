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

export { handleMusicSearchViaWhatsappMessage, handleQueueSong };