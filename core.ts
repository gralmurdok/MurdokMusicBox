import { queueSong, searchTracks } from "./spotify";
import { APIParams } from "./types";
import { replyMusicBackToUser, replyTextMessage } from "./whatsapp";

async function handleMusicSearchViaWhatsappMessage(
  apiParams: APIParams,
  whatsappMessage: string,
) {
  try {
    const search = await searchTracks(apiParams.spotifyToken, whatsappMessage);
    console.log(search.data.tracks.items);
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
    await queueSong(apiParams.spotifyToken, trackId);
    await replyTextMessage(
      apiParams,
      "tu cancion esta en la cola"
    );
  } catch (err) {
    console.log(err);
    await replyTextMessage(
      apiParams,
      "algo salio mal, acercate a la barra para reportarlo, nosotros lo arreglaremos"
    );
  }
}

export { handleMusicSearchViaWhatsappMessage, handleQueueSong };