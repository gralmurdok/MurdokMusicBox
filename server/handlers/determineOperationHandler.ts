import { MessageType } from "../constants";
import { handleInteractiveMessage } from "./interactiveMessageHandler";
import { handleTextMessage } from "./textMessageHandler";
import { APIParams } from "../types";
import { ensureUserIsRegistered } from "../users/registerUser";
import { handleImageMessage } from "./imageMessageHandler";

async function handleOperationByMessageType(apiParams: APIParams) {
  ensureUserIsRegistered(apiParams);

  switch (apiParams.messageType) {
    case MessageType.TEXT:
      await handleTextMessage(apiParams);
      break;
    case MessageType.INTERACTIVE:
      await handleInteractiveMessage(apiParams);
      break;
    case MessageType.IMAGE:
      await handleImageMessage(apiParams);
      break;
  }
}

export { handleOperationByMessageType };
