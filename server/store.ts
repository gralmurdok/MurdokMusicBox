import { Defaults } from "./constants";
import { CrossRoadsUser, AuthObject, AppStatus } from "./types";
const defaultCurrentSong = {
  name: "Bienvenidos!",
  trackId: Defaults.TRACK_ID,
  artist: "Reproduce musica en spotify para empezar.",
  albumId: "",
  nextDefaultSong: 0,
  endsAt: 0,
  requesterName: Defaults.REQUESTER_NAME,
  imgUrl: "",
  durationMs: 0,
};

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
      isAuth: false,
      isReady: false,
      isPlayingMusic: false,
      permitToken: {
        token: "",
        validUntil: 0,
      },
      currentSong: defaultCurrentSong,
      songQueue: {},
      wifiKey: "",
      isNextSongDefined: false,
      nextSongShouldBeQueuedAt: Date.now(),
    };
  }
}

const store = new Store();

export { store, defaultCurrentSong };
