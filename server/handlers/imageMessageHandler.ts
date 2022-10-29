import { NumberDefaults, ErrorMessages, EventType } from "../constants";
import {
  fetchMediaObject,
  fetchMediaURL,
  replyTextMessage,
} from "../messaging/whatsapp";
import { broadcastData } from "../setup";
import { store } from "../store";
import { APIParams, CrossroadsImage } from "../types";

async function handleImageMessage(apiParams: APIParams) {
  console.log("HANDLING AS IMAGE MESSAGE " + apiParams.imageId);
  try {
    const mediaURL = await fetchMediaURL(apiParams);
    const media = await fetchMediaObject(apiParams, mediaURL.data.url);
    const base64Image =
      "data:" +
      media.headers["content-type"] +
      ";base64," +
      Buffer.from(media.data).toString("base64");
    const newImage: CrossroadsImage = {
      description: apiParams.messageBody,
      base64Source: base64Image,
    };

    const images = [newImage, ...store.visualShow.images].slice(
      0,
      NumberDefaults.MAX_IMAGES
    );
    store.updateVisualShow({ images });

    const successMessage = `Imagen ${images.length}/${NumberDefaults.MAX_IMAGES} recibida con exito!`;
    await replyTextMessage(apiParams, successMessage);

    broadcastData(EventType.START_VISUAL_SHOW, base64Image);
  } catch (err) {
    await replyTextMessage(apiParams, ErrorMessages.UNABLE_TO_STORE_IMAGE);
  }
}

export { handleImageMessage };
