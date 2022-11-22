import { MessageType } from "../constants";
import {
  WhatsappIncomingMessage,
  WhatsappIncomingMessageEntryChangesValueMessage,
  WhatsappMessageData,
} from "../types";

function gatherDataFromMessage(
  incomingMessage: WhatsappIncomingMessage
): WhatsappMessageData {
  const { entry } = incomingMessage;
  const { changes } = entry[0];
  const { value } = changes[0];
  const message = value.messages[0];
  const messageType = determineMessageType(message);

  return {
    messageType,
    messageBody: message.text?.body ?? "",
    phoneNumberId: value.metadata.phone_number_id,
    toPhoneNumber: message.from,
    requesterName: value.contacts[0].profile.name,
    interactiveListReply: message.interactive?.list_reply?.id ?? "",
    interactiveButtonReply: message.interactive?.button_reply?.id ?? "",
    imageId: message.image?.id ?? "",
  };
}

function determineMessageType(
  message: WhatsappIncomingMessageEntryChangesValueMessage
) {
  return message.type === MessageType.GENERAL_INTERACTIVE && message.interactive
    ? message.interactive.type
    : message.type;
}

export { gatherDataFromMessage };
