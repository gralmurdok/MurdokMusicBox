import { Defaults, TimeDefaults } from "./constants";
import { CrossRoadsUser, AuthObject, AppStatus, PlayingSong, Song } from "./types";
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

  updateCurrentSongRequester(requesterName: string) {
    this.status = {
      ...this.status,
      currentSong: {
        ...this.status.currentSong,
        requesterName,
      }
    }
  }

  updateWhenNextSongShouldBeQueued(songDurationInMs: number) {
    this.status = {
      ...this.status,
      nextSongShouldBeQueuedAt: Date.now() + songDurationInMs - TimeDefaults.NEXT_SONG_OFFSET_MS,
    };
  }

  removeSongFromQueue(trackId: string) {
    this.status = {
      ...this.status,
      songQueue: {
        ...this.status.songQueue,
        [trackId]: undefined,
      }
    }
  }

  setIsSpotifyReady(isReady: boolean) {
    this.status = {
      ...this.status,
      isReady,
    }
  }

  setIsPlayingMusic(isPlayingMusic: boolean) {
    this.status = {
      ...this.status,
      isPlayingMusic,
    }
  }

  setCurrentSong(currentSong: Partial<PlayingSong>) {
    this.status =  {
      ...this.status,
      currentSong: {
        ...this.status.currentSong,
        ...currentSong,
      }
    };
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
      }
    }
  }

  addSongToQueue(queuedSong: Song) {
    this.status.songQueue = {
      ...this.status.songQueue,
      [queuedSong.trackId]: {
        ...queuedSong,
        requestedAt: Date.now(),
      },
    };
  }

  updateAuthStatus() {
    this.status = {
      ...this.status,
      isAuth: !!this.auth.accessToken
    }
  }

  getUser(phoneNumber: string) {
    return this.users[phoneNumber]
  }

  getCurrentSong() {
    return store.status.currentSong;
  }
}

const store = new Store();

export { store, defaultCurrentSong };
