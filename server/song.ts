import { Defaults, TimeDefaults } from "./constants";
import { play } from "./spotify";
import { store } from "./store";
import { RawSong } from "./types";

class SpotifySong {
  trackId: string;
  name: string;
  artist: string;
  imgUrl: string;
  durationMs: number;
  wasConsumed: boolean;

  constructor(
    rawSong: RawSong,
  ) {
    this.trackId = rawSong.id;
    this.name = rawSong.name;
    this.artist = rawSong.artists[0].name;
    this.imgUrl = rawSong.album.images[0].url;
    this.durationMs = rawSong.duration_ms;
    this.wasConsumed = false;
  }
}

class SpotifyQueuedSong extends SpotifySong {
  requesterName: string;

  constructor(
    rawSong: RawSong,
    requesterName: string = Defaults.REQUESTER_NAME
  ) {
    super(rawSong);
    this.requesterName = requesterName;
  }

  consume = async () => {
    if (!this.wasConsumed) {
      try {
        this.wasConsumed = true;
        await play([this.trackId]);
        store.setCurrentSong(this);
      } catch (err) {
        this.wasConsumed = false;
      }
    }
  };
}

class SpotifyCurrentSong extends SpotifySong {
  progressMs: number;
  remainingTime: number;

  constructor(rawSong: RawSong, progressMs: number = 0) {
    super(rawSong);
    this.progressMs = progressMs;
    this.remainingTime = this.durationMs - this.progressMs - TimeDefaults.NEXT_SONG_OFFSET_MS;
  }
}

export { SpotifySong, SpotifyQueuedSong, SpotifyCurrentSong };
