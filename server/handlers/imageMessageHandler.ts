import { NumberDefaults, ErrorMessages } from "../constants";
import { fetchMediaObject, fetchMediaURL, replyTextMessage } from "../messaging/whatsapp";
import { store } from "../store";
import { APIParams } from "../types";

async function handleImageMessage(apiParams: APIParams) {
  console.log('HANDLING AS IMAGE MESSAGE ' + apiParams.imageId);
  try {
    const mediaURL = await fetchMediaURL(apiParams);
    const media = await fetchMediaObject(apiParams, mediaURL.data.url);
    const base64Image = "data:" +
      media.headers["content-type"] +
      ";base64," +
      Buffer.from(media.data).toString("base64");

    const images = [base64Image, ...store.getUser(apiParams.toPhoneNumber).images].slice(0, 4)
    store.updateUser(apiParams.toPhoneNumber, { images });
    
    const successMessage = `Imagen ${images.length}/${NumberDefaults.MAX_IMAGES} recibida con exito!`;
    await replyTextMessage(
      apiParams,
      successMessage,
    );

  } catch (err) {
    await replyTextMessage(
      apiParams,
      ErrorMessages.UNABLE_TO_STORE_IMAGE,
    );
  }
}

export { handleImageMessage };