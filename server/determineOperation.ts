import { MessageType } from "./constants";
import { handleInteractiveMessage } from "./handlers/interactiveMessageHandler";
import { handleTextMessage } from "./handlers/textMessageHandler";
import { APIParams } from "./types";
import { ensureUserIsRegistered } from "./users/registerUser";

async function handleOperationByMessageType(apiParams: APIParams) {
  ensureUserIsRegistered(apiParams);

  switch(apiParams.messageType) {
    case MessageType.TEXT:
      await handleTextMessage(apiParams);
      break;
    case MessageType.INTERACTIVE:
      await handleInteractiveMessage(apiParams);
      break;
    case MessageType.IMAGE:
      // handleImageMessage(apiParams.messageBody);
      break;
  }
}

export { handleOperationByMessageType };