import axios from "axios";
import { APIParams, Song, WhatsappMessage } from "./types";
import { interactiveMessage, simpleMessage } from "./whatsappMessageBuilder";

function replyMusicBackToUser(
  apiParams: APIParams,
  tracks: any[],
) {
  const songsList: Song[] = tracks.map((track, index) => ({
    trackId: track.id,
    name: `${index}. ${track.name}`.substring(0, 20),
  })).slice(0, 3);

  return replyMessageBackToUser(apiParams, interactiveMessage(
    apiParams.toPhoneNumber,
    'elige una cancion',
    'resultados',
    songsList,
  ));
}

function replyTextMessage(  
  apiParams: APIParams,
  message: string
) {
  return replyMessageBackToUser(apiParams, simpleMessage(apiParams.toPhoneNumber, message));
}

function replyMessageBackToUser(
  apiParams: APIParams,
  data: WhatsappMessage,
) {
  return axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      apiParams.phoneNumberId +
      "/messages?access_token=" +
      apiParams.whatsappToken,
    data,
    headers: { "Content-Type": "application/json" },
  });
}

export { replyTextMessage, replyMusicBackToUser, replyMessageBackToUser };
