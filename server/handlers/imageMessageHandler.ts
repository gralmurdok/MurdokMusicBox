import { NumberDefaults, ErrorMessages } from "../constants";
import {
  fetchMediaObject,
  fetchMediaURL,
  replyTextMessage,
} from "../messaging/whatsapp";
import { store } from "../store";
import { APIParams, CrossroadsImage } from "../types";
import { handleExecuteAction } from "./handleExecuteAction";

async function handleImageMessage(apiParams: APIParams) {
  if (apiParams.toPhoneNumber === store.config.owner) {
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

        const images = [...store.visualShow.images, newImage];
        store.updateVisualShow({ images });

        const successMessage = `Imagen #${images.length} recibida con exito!`;
        await replyTextMessage(apiParams.toPhoneNumber, successMessage);
      },
      async () => {
        await replyTextMessage(
          apiParams.toPhoneNumber,
          ErrorMessages.UNABLE_TO_STORE_IMAGE
        );
      }
    );
  } else {
    await replyTextMessage(
      apiParams.toPhoneNumber,
      ErrorMessages.EVENT_UNAUTORIZED
    );
  }
}

export { handleImageMessage };
