interface Song {
  name: string;
  trackId: string;
}

interface Button {
  type: "reply";
  reply: {
    id: string;
    title: string;
  };
}

interface WhatsappMessage {
  messaging_product: "whatsapp";
  to: string;
}

interface TextMessage extends WhatsappMessage {
  text: {
    body: string;
  };
}

interface InteractiveMessage extends WhatsappMessage {
  recipient_type: "individual";
  type: "interactive";
  interactive: {
    type: "button";
    header: {
      type: "text";
      text: string;
    };
    body: {
      text: string;
    };
    footer: {
      text: "The Crossroads Loja";
    };
    action: {
      buttons: Button[]
    };
  };
}

function simpleMessage(from: string, message: string): TextMessage {
  return {
    messaging_product: "whatsapp",
    to: from,
    text: { body: message },
  };
}

function interactiveMessage(from: string, title: string, message: string, actions: Song[]): InteractiveMessage {
  const buttons: Button[] = actions.map((song) => ({
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

export type { TextMessage, WhatsappMessage, Song };
export { simpleMessage, interactiveMessage };
