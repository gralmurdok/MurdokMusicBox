import { Defaults } from "./constants";
import { SpotifyQueuedSong } from "./song";

interface APIParams {
  messageBody: string;
  requesterName: string;
  whatsappToken: string;
  spotifyToken: string;
  phoneNumberId: string;
  toPhoneNumber: string;
}

interface Song {
  name: string;
  trackId: string;
  artist: string;
  requesterName: string;
  imgUrl: string;
  durationMs: number;
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
}

interface PermitToken {
  token: string;
  validUntil: number;
}

interface PlayingSong extends Song {
  nextDefaultSong: number;
  albumId: string;
  remainingTime: number;
}

interface QueuedSong extends Song {
  requestedAt: number;
}

type SongQueue = Record<string, QueuedSong | undefined>;

interface AppStatus {
  isAuth: boolean;
  isReady: boolean;
  isPlayingMusic: boolean;
  permitToken: PermitToken;
  currentSong: PlayingSong;
  songQueue: SpotifyQueuedSong[];
  last5Played: SongQueue;
  wifiKey: string;
  isNextSongDefined: boolean;
  nextSongShouldBeQueuedAt: number;
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

export type {
  PlayingSong,
  AuthObject,
  AppStatus,
  APIParams,
  TextMessage,
  WhatsappMessage,
  Song,
  InteractiveMessage,
  ReplyButton,
  Section,
  SectionRow,
  CrossRoadsUser,
  PermitToken,
  QueuedSong,
  SongQueue,
  RawSong,
};
