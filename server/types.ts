interface APIParams {
  messageBody: string,
  requesterName: string,
  whatsappToken: string,
  spotifyToken: string,
  phoneNumberId: string,
  toPhoneNumber: string,
}

interface Song {
  name: string;
  trackId: string;
  artist: string;
}

interface ReplyButton {
  type: "reply";
  reply: {
    id: string;
    title: string;
  };
}

interface SectionRow {
  id: string,
  title: string,
  description: string,
}

interface Section {
  title: string,
  rows: SectionRow[]
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
    type: "button" | "list";
    header?: {
      type: "text";
      text: string;
    };
    body: {
      text: string;
    };
    footer?: {
      text: "The Crossroads Loja";
    };
    action: {
      button?: string,
      buttons?: ReplyButton[],
      sections?: Section[]
    };
  };
}

interface CrossRoadsUser {
  name: string;
  phoneNumber: string;
  nextAvailableSongTimestamp: number;
  authorizedUntil: number;
}

interface PermitToken {
  token: string;
  validUntil: number;
}

interface PlayingSong extends Song {
  endsAt: number;
}

interface AppStatus {
  isReady: boolean;
  permitToken: PermitToken;
  currentSong: PlayingSong;
}

interface AuthObject {
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
}

export type { PlayingSong, AuthObject, AppStatus, APIParams, TextMessage, WhatsappMessage, Song, InteractiveMessage, ReplyButton, Section, SectionRow, CrossRoadsUser, PermitToken };