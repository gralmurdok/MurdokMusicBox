import axios from "axios";
import { getCurrentUser } from "./core";
import { APIParams, Song, WhatsappMessage } from "./types";
import {
  interactiveListMessage,
  simpleMessage,
} from "./whatsappMessageBuilder";

function replyMusicBackToUser(apiParams: APIParams) {
  const songsList: Song[] = getCurrentUser(apiParams).searchResults.map(
    (song) => ({
      ...song,
      name: song.name,
    })
  );

  return replyMessageBackToUser(
    apiParams,
    interactiveListMessage(
      apiParams.toPhoneNumber,
      "Resultados de tu busqueda",
      `hemos encontrado ${songsList.length} canciones que coinciden con: ${apiParams.messageBody}`,
      songsList
    )
  );
}

function replyTextMessage(apiParams: APIParams, message: string) {
  return replyMessageBackToUser(
    apiParams,
    simpleMessage(apiParams.toPhoneNumber, message)
  );
}

function replyMessageBackToUser(apiParams: APIParams, data: WhatsappMessage) {
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
