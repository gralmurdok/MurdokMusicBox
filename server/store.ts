import { CrossRoadsUser, AuthObject, AppStatus } from "./types";
const defaultCurrentSong = {
  name: "Bienvenidos!",
  trackId: "",
  artist: "Reproduce musica en spotify para empezar.",
  albumId: "",
  nextDefaultSong: 0,
  endsAt: 0,
  requesterName: "The Crossroads",
  imgUrl: "",
}

class Store {
  auth: AuthObject;
  users: Record<string, CrossRoadsUser>;
  status: AppStatus;

  constructor() {
    this.auth = {
      accessToken: "",
      refreshToken: "",
      expiresAt: 0,
    };
    this.users = {};
    this.status = {
      isReady: false,
      permitToken: {
        token: "",
        validUntil: 0,
      },
      currentSong: defaultCurrentSong,
      songQueue: {},
      wifiKey: "",
      isPlayingFromQueue: false,
      isNextSongDefined: false,
    };
  }
}

const store = new Store();

export { store, defaultCurrentSong };
