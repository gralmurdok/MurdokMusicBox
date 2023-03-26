import { Song } from "./types";

enum ErrorMessages {
  NOT_READY = "No habilitado, por favor acercate a la barra para solicitar la activacion del servicio de musica.",
  DUPLICATED_SONG = "Oh, aquella cancion ya esta en cola",
  NOT_READY_TO_QUEUE_SONG = "Puedes pedir tu siguiente cancion en",
  SEARCH_ERROR = "Tuvimos problemas para encontrar la musica que buscas, por favor intenta otra vez, si el problema persiste acercate a la barra a reportarlo.",
  UNABLE_TO_STORE_IMAGE = "Tuvimos problemas para guardar tu imagen, por favor intenta otra vez, si el problema persiste acercate a la barra a reportarlo.",
  EVENT_UNAUTORIZED = "No eres host de ningun evento.",
}

enum SuccessMessages {
  SONG_QUEUED = "Tu cancion esta en la cola, y se reproducira en",
}

enum Routes {
  APP_STATUS = "/app-status",
}

enum Defaults {
  TRACK_ID = "0000000000",
  REQUESTER_NAME = "The Crossroads Loja",
}

enum TimeDefaults {
  NEXT_SONG_OFFSET_MS = 3000,
  INTERNAL_UPDATE_THRESHOLD = 2500,
  INTERNAL_UPDATE_RETRY_NUMBER = 500,
}

enum NumberDefaults {
  MAX_IMAGES = 4,
}

enum MessageType {
  TEXT = "text",
  INTERACTIVE_LIST_REPLY = "list_reply",
  INTERACTIVE_BUTTON_REPLY = "button_reply",
  IMAGE = "image",
  GENERAL_INTERACTIVE = "interactive",
}

enum WebsocketsActions {
  PLAYER = "player",
  START_VISUAL_SHOW = "start_visual_show",
  LOAD_IMAGE = "load_image",
}

enum Events {
  INIT = "init",
  END = "end",
}

const EVENT_SONGS: Song[] = [
  {
    name: "Happy Birthday (Instrumental)",
    trackId: "2ITBznHTVw0CojC3amtxVg",
    artist: "Los Diplomaticos",
    remainingTime: 146837,
    requesterName: "The Crossroads Loja",
    imgUrl: "https://i.scdn.co/image/ab67616d0000b273bbb3a7541c24d94d734a2fe7",
    durationMs: 156813,
  },
  {
    name: "Que Dios Te Bendiga (Canción de Cumpleaños)",
    trackId: "3D0E4U9TbWLIm00MFKCsBC",
    artist: "Peter Manjarrés",
    remainingTime: 272369,
    requesterName: "The Crossroads Loja",
    imgUrl: "https://i.scdn.co/image/ab67616d0000b2737caddaadb89043a1fedcd8bf",
    durationMs: 282040,
  },
  {
    name: "Las Mañanitas",
    trackId: "5kWzM5dWoG54dGyFb5uMuX",
    artist: "Vicente Fernández",
    remainingTime: 151704,
    requesterName: "The Crossroads Loja",
    imgUrl: "https://i.scdn.co/image/ab67616d0000b27352d5a74bfb236a66e6375ed5",
    durationMs: 161693,
  },
];

export {
  ErrorMessages,
  Routes,
  Defaults,
  TimeDefaults,
  MessageType,
  SuccessMessages,
  NumberDefaults,
  WebsocketsActions,
  Events,
  EVENT_SONGS,
};
