import axios from "axios";
import { interactiveMessage, simpleMessage, Song, WhatsappMessage } from "./whatsappMessageBuilder";

function replyMusicBackToUser(
  whatsappToken: string,
  phoneNumberId: string,
  from: string,
  tracks: any[],
) {
  const songsList: Song[] = tracks.map((track) => ({
    trackId: track.id,
    name: track.name.substring(0, 20),
  })).slice(0, 3);

  return replyMessageBackToUser(whatsappToken, phoneNumberId, interactiveMessage(
    from,
    'elige una cancion',
    'resultados',
    songsList,
  ));
}

function replyTextMessage(  
  whatsappToken: string,
  phoneNumberId: string,
  from: string,
  message: string
) {
  return replyMessageBackToUser(whatsappToken, phoneNumberId, simpleMessage(from, message));
}

function replyMessageBackToUser(
  whatsappToken: string,
  phoneNumberId: string,
  data: WhatsappMessage,
) {
  return axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      phoneNumberId +
      "/messages?access_token=" +
      whatsappToken,
    data,
    headers: { "Content-Type": "application/json" },
  });
}

export { replyTextMessage, replyMusicBackToUser, replyMessageBackToUser };
