import { Defaults, Events } from "../constants";
import { store } from "../store";
import {
  InteractiveMessage,
  ReplyButton,
  Section,
  SectionRow,
  Song,
  TextMessage,
} from "../types";

function simpleMessage(from: string, message: string): TextMessage {
  return {
    messaging_product: "whatsapp",
    to: from,
    text: { body: message },
  };
}

function interactiveReplyButtonsMessage(
  toPhoneNumber: string,
  message: string,
  imageUrl: string
): InteractiveMessage {
  const startButton: ReplyButton = {
    type: "reply",
    reply: {
      id: Events.INIT,
      title: "INICIAR",
    },
  };

  const endButton: ReplyButton = {
    type: "reply",
    reply: {
      id: Events.END,
      title: "TERMINAR",
    },
  };

  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: toPhoneNumber,
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "image",
        image: {
          link: imageUrl,
        },
      },
      body: {
        text: message,
      },
      footer: {
        text: Defaults.REQUESTER_NAME,
      },
      action: {
        buttons: [startButton, endButton],
      },
    },
  };
}

function interactiveListMessage(
  from: string,
  title: string,
  message: string,
  actions: Song[]
): InteractiveMessage {
  const sectionRows: SectionRow[] = actions.map((song) => ({
    id: song.trackId,
    title: song.artist.substring(0, 24),
    description: song.name.substring(0, 72),
  }));

  const sections: Section[] = [
    {
      title: "Musica disponible",
      rows: sectionRows,
    },
  ];

  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: from,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: title,
      },
      body: {
        text: message,
      },
      action: {
        button: "SELECCIONAR MUSICA",
        sections,
      },
    },
  };
}

export {
  simpleMessage,
  interactiveReplyButtonsMessage,
  interactiveListMessage,
};
