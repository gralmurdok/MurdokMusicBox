import axios from "axios";
import { store } from "./store";
import { APIParams, Song, WhatsappMessage } from "./types";
import {
  interactiveListMessage,
  simpleMessage,
} from "./whatsappMessageBuilder";

function replyMusicBackToUser(apiParams: APIParams) {
  const songsList: Song[] = store
    .getUser(apiParams.toPhoneNumber)
    .searchResults.map((song) => ({
      ...song,
      name: song.name,
    }));

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

function fetchMediaURL(apiParams: APIParams, mediaId: string) {
  return axios({
    method: "GET", // Required, HTTP method, a string, e.g. POST, GET
    url:
      `https://graph.facebook.com/v12.0/${mediaId}` +
      "?access_token=" +
      apiParams.whatsappToken,
    headers: { "Content-Type": "application/json" },
  });
}

function fetchMediaObject(apiParams: APIParams, url: string) {
  return axios({
    method: "GET", // Required, HTTP method, a string, e.g. POST, GET
    url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiParams.whatsappToken}`,
    },
    responseType: "arraybuffer",
  });
}

export {
  replyTextMessage,
  replyMusicBackToUser,
  replyMessageBackToUser,
  fetchMediaURL,
  fetchMediaObject,
};
