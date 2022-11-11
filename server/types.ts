import { Defaults, MessageType } from "./constants";

interface APIParams {
  messageBody: string;
  messageType: MessageType;
  requesterName: string;
  spotifyToken: string;
  phoneNumberId: string;
  toPhoneNumber: string;
  interactiveReply: string;
  imageId: string;
}

interface Song {
  name: string;
  trackId: string;
  artist: string;
  requesterName?: string;
  imgUrl: string;
  durationMs: number;
  remainingTime: number;
}

interface ReplyButton {
  type: "reply";
  reply: {
    id: string;
    title: string;
  };
}

interface SectionRow {
  id: string;
  title: string;
  description: string;
}

interface Section {
  title: string;
  rows: SectionRow[];
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
      type: "text" | "image";
      text?: string;
      image?: {
        link: string;
      };
    };
    body: {
      text: string;
    };
    footer?: {
      text: Defaults.REQUESTER_NAME;
    };
    action: {
      button?: string;
      buttons?: ReplyButton[];
      sections?: Section[];
    };
  };
}

interface CrossRoadsUser {
  name: string;
  phoneNumber: string;
  nextAvailableSongTimestamp: number;
  searchResults: Song[];
  searchQuery: string;
  images: String[];
}

interface PermitToken {
  token: string;
  validUntil: number;
}

type SongQueue = Record<string, Song | undefined>;

interface AppStatus {
  isAuth: boolean;
  isReady: boolean;
  isPlayingMusic: boolean;
  permitToken: PermitToken;
  currentSong: Song;
  songQueue: Song[];
  last5Played: Song[];
  wifiKey: string;
  isNextSongDefined: boolean;
  nextSongShouldBeQueuedAt: number;
}

interface Config {
  owner: string
}

interface CrossroadsImage {
  description: string;
  base64Source: string;
}

interface VisualShow {
  title: string;
  images: CrossroadsImage[];
}

interface AuthObject {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface RawArtist {
  name: string;
}

interface RawImage {
  url: string;
}

interface RawAlbum {
  name: string;
  images: RawImage[];
}

interface RawSong {
  id: string;
  name: string;
  artists: RawArtist[];
  album: RawAlbum;
  duration_ms: number;
}

interface WhatsappMessageData {
  messageType: MessageType;
  messageBody: string;
  phoneNumberId: string;
  toPhoneNumber: string;
  requesterName: string;
  interactiveReply: string;
  imageId: string;
}

interface WhatsappIncomingMessageEntryChangesValueContact {
  profile: {
    name: string;
  };
  wa_id: string;
}

interface WhatsappIncomingMessageEntryChangesValueMessage {
  context: {
    from: string;
    id: string;
  };
  from: string;
  id: string;
  timestamp: string;
  type: MessageType;
  text: {
    body: string;
  };
  interactive?: {
    type: string;
    list_reply: {
      id: string;
      title: string;
      description: string;
    };
  };
  image?: {
    id: string;
  };
}

interface WhatsappIncomingMessageEntryChangesValue {
  messaging_product: string;
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
  contacts: WhatsappIncomingMessageEntryChangesValueContact[];
  messages: WhatsappIncomingMessageEntryChangesValueMessage[];
}

interface WhatsappIncomingMessageEntryChanges {
  value: WhatsappIncomingMessageEntryChangesValue;
  field: string;
}

interface WhatsappIncomingMessageEntry {
  id: string;
  changes: WhatsappIncomingMessageEntryChanges[];
}

interface WhatsappIncomingMessage {
  object: any;
  entry: WhatsappIncomingMessageEntry[];
}

export type {
  AuthObject,
  AppStatus,
  APIParams,
  TextMessage,
  WhatsappMessage,
  InteractiveMessage,
  ReplyButton,
  Section,
  SectionRow,
  CrossRoadsUser,
  PermitToken,
  Song,
  SongQueue,
  RawSong,
  VisualShow,
  WhatsappIncomingMessage,
  WhatsappMessageData,
  CrossroadsImage,
  Config,
};
