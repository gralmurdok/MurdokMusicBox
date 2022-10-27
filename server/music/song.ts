import { Defaults, TimeDefaults } from "../constants";
import { play } from "./spotify";
import { store } from "../store";
import { RawSong } from "../types";

class SpotifySong {
  trackId: string;
  name: string;
  artist: string;
  imgUrl: string;
  durationMs: number;
  wasConsumed: boolean;
  requesterName?: string;
  progressMs: number;
  remainingTime: number;
  timeout: any;

  constructor(
    rawSong: RawSong,
  ) {
    this.trackId = rawSong.id;
    this.name = rawSong.name;
    this.artist = rawSong.artists[0].name;
    this.imgUrl = rawSong.album.images[0].url;
    this.durationMs = rawSong.duration_ms;
    this.wasConsumed = false;
    this.progressMs = 0;
    this.remainingTime = 0;
  }
}

class SpotifyQueuedSong extends SpotifySong {
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
        await play([this.trackId]);
        store.setCurrentSong(this);
      } catch (err) {
        // do nothing
      }
      this.wasConsumed = true;
    }
  };

  delayedConsume(shouldBePlayedIn: number, callback: () => void) {
    this.timeout = setTimeout(async () => {
      await this.consume();
      callback();
    }, shouldBePlayedIn);
  }
}

class SpotifyCurrentSong extends SpotifySong {
  constructor(rawSong: RawSong, progressMs: number = 0) {
    super(rawSong);
    this.progressMs = progressMs;
    this.remainingTime = this.durationMs - this.progressMs - TimeDefaults.NEXT_SONG_OFFSET_MS;
  }
}

export { SpotifySong, SpotifyQueuedSong, SpotifyCurrentSong };
