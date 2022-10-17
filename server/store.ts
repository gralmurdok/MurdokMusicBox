import { Defaults, TimeDefaults } from "./constants";
import {
  CrossRoadsUser,
  AuthObject,
  AppStatus,
  PlayingSong,
  Song,
  SongQueue,
  QueuedSong,
} from "./types";
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
      last5Played: {},
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
      },
    };
  }

  updateWhenNextSongShouldBeQueued(songDurationInMs: number) {
    this.status = {
      ...this.status,
      nextSongShouldBeQueuedAt:
        Date.now() + songDurationInMs - TimeDefaults.NEXT_SONG_OFFSET_MS,
    };
  }

  removeSongFromQueue(trackId: string) {
    this.status = {
      ...this.status,
      songQueue: {
        ...this.status.songQueue,
        [trackId]: undefined,
      },
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

  setCurrentSong(currentSong: Partial<PlayingSong>) {
    this.status = {
      ...this.status,
      currentSong: {
        ...this.status.currentSong,
        ...currentSong,
      },
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
      },
    };
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

  updateLast5Played() {
    const currentSong = store.getCurrentSong();

    if (!this.status.last5Played[currentSong.trackId]) {
      const last5PlayedQueue = {
        ...this.status.last5Played,
        [currentSong.trackId]: {
          ...currentSong,
          requestedAt: Date.now(),
        },
      };

      const last5Played = getDescendentSortedList(last5PlayedQueue)
        .slice(0, 5)
        .reduce((accum: SongQueue, song: QueuedSong) => {
          return {
            ...accum,
            [song.trackId]: song,
          };
        }, {});

      this.status = {
        ...this.status,
        last5Played: last5Played,
      };

      console.log(store.getSortedLast5Played().map((x) => x.name));
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

  getSortedSongQueue() {
    return getAscendentSortedList(this.status.songQueue);
  }

  getSortedLast5Played() {
    return getAscendentSortedList(this.status.last5Played);
  }
}

function transformToList(songQueue: SongQueue) {
  return Object.keys(songQueue)
    .map((trackId) => songQueue[trackId] as QueuedSong)
    .filter((x) => !!x);
}

function getAscendentSortedList(songQueue: SongQueue) {
  return transformToList(songQueue).sort(
    (a: QueuedSong, b: QueuedSong) => a.requestedAt - b.requestedAt
  );
}

function getDescendentSortedList(songQueue: SongQueue) {
  return transformToList(songQueue).sort(
    (a: QueuedSong, b: QueuedSong) => b.requestedAt - a.requestedAt
  );
}

const store = new Store();

export { store, defaultCurrentSong };
