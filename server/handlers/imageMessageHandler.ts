import { NumberDefaults, ErrorMessages, EventType } from "../constants";
import {
  fetchMediaObject,
  fetchMediaURL,
  replyTextMessage,
} from "../messaging/whatsapp";
import { broadcastData } from "../setup";
import { store } from "../store";
import { APIParams, CrossroadsImage } from "../types";
import { handleExecuteAction } from "./handleExecuteAction";
import { songQueueManager } from "./interactiveMessageHandler";
import { startVisualShow } from "./visualShowHandler";

async function handleImageMessage(apiParams: APIParams) {
  await handleExecuteAction(
    async () => {
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

      const images = [...store.visualShow.images, newImage].slice(
        0,
        NumberDefaults.MAX_IMAGES
      );
      store.updateVisualShow({ images });

      const successMessage = `Imagen ${images.length}/${NumberDefaults.MAX_IMAGES} recibida con exito!`;
      await replyTextMessage(apiParams.toPhoneNumber, successMessage);

      if (images.length === NumberDefaults.MAX_IMAGES) {
        broadcastData(EventType.LOAD_IMAGE, undefined);
        startVisualShow();
        songQueueManager.playSpecialSong();
      }
    },
    async () => {
      await replyTextMessage(
        apiParams.toPhoneNumber,
        ErrorMessages.UNABLE_TO_STORE_IMAGE
      );
    }
  );
}

export { handleImageMessage };
