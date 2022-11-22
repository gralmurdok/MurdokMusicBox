import axios from "axios";
import { store } from "../store";
import { APIParams, Song, WhatsappMessage } from "../types";
import {
  interactiveListMessage,
  simpleMessage,
} from "./whatsappMessageBuilder";

function getWhatsappToken() {
  return process.env.WHATSAPP_TOKEN;
}

function replyMusicBackToUser(apiParams: APIParams) {
  const songsList: Song[] = store
    .getUser(apiParams.toPhoneNumber)
    .searchResults.map((song) => ({
      ...song,
      name: song.name,
    }));

  return replyMessageBackToUser(
    interactiveListMessage(
      apiParams.toPhoneNumber,
      "Resultados de tu busqueda",
      `hemos encontrado ${songsList.length} canciones que coinciden con: ${apiParams.messageBody}`,
      songsList
    )
  );
}

function replyTextMessage(phoneNumber: string, message: string) {
  console.log(message);
  return replyMessageBackToUser(simpleMessage(phoneNumber, message));
}

function replyMessageBackToUser(data: WhatsappMessage) {
  return axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url:
      "https://graph.facebook.com/v12.0/" +
      process.env.MUSIC_BOX_PHONE_NUMBER_ID +
      "/messages?access_token=" +
      getWhatsappToken(),
    data,
    headers: { "Content-Type": "application/json" },
  }).catch((err) => console.log(err));
}

function fetchMediaURL(apiParams: APIParams) {
  return axios({
    method: "GET", // Required, HTTP method, a string, e.g. POST, GET
    url:
      `https://graph.facebook.com/v12.0/${apiParams.imageId}` +
      "?access_token=" +
      getWhatsappToken(),
    headers: { "Content-Type": "application/json" },
  });
}

function fetchMediaObject(apiParams: APIParams, url: string) {
  return axios({
    method: "GET", // Required, HTTP method, a string, e.g. POST, GET
    url,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getWhatsappToken()}`,
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
