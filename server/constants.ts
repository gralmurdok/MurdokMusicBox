enum ErrorMessages {
  NOT_READY = "No habilitado, por favor acercate a la barra para solicitar la activacion del servicio de musica.",
  DUPLICATED_SONG = "Oh, aquella cancion ya esta en cola",
  NOT_READY_TO_QUEUE_SONG = "Puedes pedir tu siguiente cancion en",
  SEARCH_ERROR = "Tuvimos problemas para encontrar la musica que buscas, por favor intenta otra vez, si el problema persiste acercate a la barra a reportarlo.",
  UNABLE_TO_STORE_IMAGE = "Tuvimos problemas para guardar tu imagen, por favor intenta otra vez, si el problema persiste acercate a la barra a reportarlo.",
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
  NEXT_SONG_OFFSET_MS = 8000,
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
};
