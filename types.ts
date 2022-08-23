interface APIParams {
  whatsappToken: string,
  spotifyToken: string,
  phoneNumberId: string,
  toPhoneNumber: string,
}

interface Song {
  name: string;
  trackId: string;
}

interface ReplyButton {
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
      buttons: ReplyButton[]
    };
  };
}

export type { APIParams, TextMessage, WhatsappMessage, Song, InteractiveMessage, ReplyButton };