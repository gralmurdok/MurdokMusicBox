import { handleMusicSearchViaWhatsappMessage } from "../core";
import { replyTextMessage } from "../messaging/whatsapp";
import { APIParams } from "../types";

function handleTextMessage(apiParams: APIParams) {
  console.log('HANDLING AS TEXT MESSAGE ' + apiParams.messageBody);
  handleMusicSearchViaWhatsappMessage(apiParams);
}

export { handleTextMessage };