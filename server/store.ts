import { WebsocketsActions, Defaults } from "./constants";
import { broadcastData } from "./setup";
import { SpotifyQueuedSong, SpotifySong } from "./music/song";
import {
  CrossRoadsUser,
  AuthObject,
  AppStatus,
  Song,
  VisualShow,
  Config,
} from "./types";

const defaultCurrentSong = {
  name: "Bienvenidos!",
  trackId: Defaults.TRACK_ID,
  artist: "Reproduce musica en spotify para empezar.",
  remainingTime: 0,
  requesterName: Defaults.REQUESTER_NAME,
  imgUrl: "",
  durationMs: 0,
};

function normalizeSongStructure(spotifySong: SpotifySong): Song {
  return {
    trackId: spotifySong.trackId,
    name: spotifySong.name,
    artist: spotifySong.artist,
    requesterName: spotifySong.requesterName,
    imgUrl: spotifySong.imgUrl,
    durationMs: spotifySong.durationMs,
    remainingTime: spotifySong.remainingTime,
  };
}

class Store {
  auth: AuthObject;
  users: Record<string, CrossRoadsUser>;
  status: AppStatus;
  visualShow: VisualShow;
  mode: WebsocketsActions;
  config: Config;

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
      songQueue: [],
      last5Played: [],
      wifiKey: "",
      isNextSongDefined: false,
      nextSongShouldBeQueuedAt: Date.now(),
    };
    this.visualShow = {
      title: "",
      images: [],
    };
    this.mode = WebsocketsActions.PLAYER;
    this.config = {
      owner: "",
      specialSong: defaultCurrentSong,
    };
  }

  updateSongQueue(songQueue: SpotifyQueuedSong[]) {
    store.status = {
      ...store.status,
      songQueue: songQueue.map(normalizeSongStructure),
    };
  }

  setIsSpotifyReady(isReady: boolean) {
    this.status = {
      ...this.status,
      isReady,
    };
  }

  setIsPlayingMusic(isPlayingMusic: boolean) {
    this.status = {
      ...this.status,
      isPlayingMusic,
    };
  }

  setNormalizedSong(normalizedSong: Partial<Song>) {
    this.status = {
      ...this.status,
      currentSong: {
        ...this.status.currentSong,
        ...normalizedSong,
        requesterName: normalizedSong.requesterName
          ? normalizedSong.requesterName
          : this.status.currentSong.requesterName,
      },
    };
  }

  setCurrentSong(currentSong: SpotifySong) {
    const normalizedSong = normalizeSongStructure(currentSong);
    this.setNormalizedSong(normalizedSong);
  }

  addUser(newUser: CrossRoadsUser) {
    this.users = {
      ...this.users,
      [newUser.phoneNumber]: newUser,
    };
  }

  updateUser(phoneNumber: string, userInfo: Partial<CrossRoadsUser>) {
    this.users = {
      ...this.users,
      [phoneNumber]: {
        ...this.users[phoneNumber],
        ...userInfo,
      },
    };
  }

  updateLast5Played() {
    const currentSong = store.getCurrentSong();

    if (
      !this.status.last5Played.find(
        (playedSong: Song) => playedSong.trackId === currentSong.trackId
      )
    ) {
      this.status = {
        ...this.status,
        last5Played: [...this.status.last5Played, currentSong].slice(-5),
      };

      console.log(store.status.last5Played);
    }
  }

  updateAuthStatus() {
    this.status = {
      ...this.status,
      isAuth: !!this.auth.accessToken,
    };
  }

  getUser(phoneNumber: string) {
    return this.users[phoneNumber];
  }

  getCurrentSong() {
    return store.status.currentSong;
  }

  updateVisualShow(visualShow: Partial<VisualShow>) {
    this.visualShow = {
      ...this.visualShow,
      ...visualShow,
    };
  }
}

const store = new Store();

export { store, defaultCurrentSong, normalizeSongStructure };
