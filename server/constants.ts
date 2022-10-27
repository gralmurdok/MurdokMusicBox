enum ErrorMessages {
  NOT_READY = "No habilitado, por favor acercate a la barra para solicitar la activacion del servicio de musica",
  DUPLICATED_SONG = "Oh, aquella cancion ya esta en cola",
}

enum Routes {
  APP_STATUS = "/app-status",
}

enum Defaults {
  TRACK_ID = "0000000000",
  REQUESTER_NAME = "The Crossroads Loja",
  MASTER_NUMBER = "593960521867",
}

enum TimeDefaults {
  NEXT_SONG_OFFSET_MS = 5000,
  INTERNAL_UPDATE_THRESHOLD = 2500,
  INTERNAL_UPDATE_RETRY_NUMBER = 500,
}

enum MessageType {
  TEXT= 'text',
  INTERACTIVE= 'interactive',
  IMAGE = 'image',
}

export { ErrorMessages, Routes, Defaults, TimeDefaults, MessageType };
