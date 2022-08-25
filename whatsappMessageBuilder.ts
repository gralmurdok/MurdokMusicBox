import { InteractiveMessage, ReplyButton, Section, SectionRow, Song, TextMessage } from "./types";

function simpleMessage(from: string, message: string): TextMessage {
  return {
    messaging_product: "whatsapp",
    to: from,
    text: { body: message },
  };
}

function interactiveReplyButtonsMessage(from: string, title: string, message: string, actions: Song[]): InteractiveMessage {
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

function interactiveListMessage(from: string, title: string, message: string, actions: Song[]): InteractiveMessage {
  const sectionRows: SectionRow[] = actions.map((song) => ({
    id: song.trackId,
    title: song.name,
    description: song.artist,
  }));

  const sections: Section[] = [{
    title: "Musica disponible",
    rows: sectionRows
  }];

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
        button: "Lista de canciones",
        sections
      },
    },
  };
}

export { simpleMessage, interactiveReplyButtonsMessage, interactiveListMessage };
