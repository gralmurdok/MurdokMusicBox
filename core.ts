import { queueSong, searchTracks } from "./spotify";
import { replyMusicBackToUser, replyTextMessage } from "./whatsapp";

async function handleMusicSearchViaWhatsappMessage(
  whatsappToken: string,
  spotifyToken: string,
  phoneNumberId: string,
  from: string,
  whatsappMessage: string,
) {
  try {
    const search = await searchTracks(spotifyToken, whatsappMessage);
    console.log(search.data.tracks.items);
    await replyMusicBackToUser(
      whatsappToken,
      phoneNumberId,
      from,
      search.data.tracks.items
    );
  } catch (err) {
    console.log(err);
    await replyTextMessage(
      whatsappToken,
      phoneNumberId,
      from,
      "algo salio mal, acercate a la barra para reportarlo, nosotros lo arreglaremos"
    );
  }
}

async function handleQueueSong(
  whatsappToken: string,
  spotifyToken: string,
  phoneNumberId: string,
  from: string,
  trackId: string,
) {
  try {
    const search = await queueSong(spotifyToken, trackId);
    await replyTextMessage(
      whatsappToken,
      phoneNumberId,
      from,
      "tu cancion esta en la cola"
    );
  } catch (err) {
    console.log(err);
    await replyTextMessage(
      whatsappToken,
      phoneNumberId,
      from,
      "algo salio mal, acercate a la barra para reportarlo, nosotros lo arreglaremos"
    );
  }
}

export { handleMusicSearchViaWhatsappMessage, handleQueueSong };