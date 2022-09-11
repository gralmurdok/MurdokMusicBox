import {
  InteractiveMessage,
  ReplyButton,
  Section,
  SectionRow,
  Song,
  TextMessage,
} from "./types";

function simpleMessage(from: string, message: string): TextMessage {
  return {
    messaging_product: "whatsapp",
    to: from,
    text: { body: message },
  };
}

function interactiveReplyButtonsMessage(
  from: string,
  message: string,
  song: Song
): InteractiveMessage {
  const button: ReplyButton = {
    type: "reply",
    reply: {
      id: song.trackId,
      title: "Play",
    },
  };

  return {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: from,
    type: "interactive",
    interactive: {
      type: "button",
      header: {
        type: "image",
        image: {
          link: song.imgUrl,
        },
      },
      body: {
        text: message,
      },
      footer: {
        text: "The Crossroads Loja",
      },
      action: {
        buttons: [button],
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
    description: song.name.substring(0, 100),
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
