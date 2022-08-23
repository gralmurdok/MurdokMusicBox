import { InteractiveMessage, ReplyButton, Song, TextMessage } from "./types";

function simpleMessage(from: string, message: string): TextMessage {
  return {
    messaging_product: "whatsapp",
    to: from,
    text: { body: message },
  };
}

function interactiveMessage(from: string, title: string, message: string, actions: Song[]): InteractiveMessage {
  const buttons: ReplyButton[] = actions.map((song) => ({
    type: "reply",
    reply: {
      id: song.trackId,
      title: song.name,
    },
  }));

  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: from,
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "text",
        text: title,
      },
      body: {
        text: message,
      },
      footer: {
        text: "The Crossroads Loja",
      },
      action: {
        buttons
      },
    },
  };
}

export { simpleMessage, interactiveMessage };
