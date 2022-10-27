import { WhatsappIncomingMessage, WhatsappMessageData } from "../types";

function gatherDataFromMessage(incomingMessage: WhatsappIncomingMessage): WhatsappMessageData {
  const { entry } = incomingMessage;
  const { changes } = entry[0];
  const { value } = changes[0];
  const message = value.messages[0];

  return {
    messageType: message.type,
    messageBody: message.text?.body ?? '',
    phoneNumberId: value.metadata.phone_number_id,
    toPhoneNumber: message.from,
    requesterName: value.contacts[0].profile.name,
    interactiveReply: message.interactive?.list_reply.id ?? ''
  }
}

export { gatherDataFromMessage };