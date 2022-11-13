import { MessageType } from "../constants";
import { handleInteractiveListMessage } from "./interactiveListMessageHandler";
import { handleTextMessage } from "./textMessageHandler";
import { APIParams } from "../types";
import { ensureUserIsRegistered } from "../users/registerUser";
import { handleImageMessage } from "./imageMessageHandler";
import { handleInteractiveButtonMessage } from "./interactiveButtonMessageHandler";

async function handleOperationByMessageType(apiParams: APIParams) {
  ensureUserIsRegistered(apiParams);

  switch (apiParams.messageType) {
    case MessageType.TEXT:
      await handleTextMessage(apiParams);
      break;
    case MessageType.INTERACTIVE_LIST_REPLY:
      await handleInteractiveListMessage(apiParams);
      break;
    case MessageType.INTERACTIVE_BUTTON_REPLY:
      await handleInteractiveButtonMessage(apiParams);
      break;
    case MessageType.IMAGE:
      await handleImageMessage(apiParams);
      break;
  }
}

export { handleOperationByMessageType };
