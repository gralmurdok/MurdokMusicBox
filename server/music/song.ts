import { Defaults, SuccessMessages, TimeDefaults } from "../constants";
import { play } from "./spotify";
import { store } from "../store";
import { APIParams, RawSong } from "../types";
import { handleExecuteAction } from "../handlers/handleExecuteAction";
import { replyTextMessage } from "../messaging/whatsapp";

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

  constructor(rawSong: RawSong) {
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
  apiParams: Partial<APIParams>;
  requesterName: string;

  constructor(
    rawSong: RawSong,
    apiParams = {
      requesterName: Defaults.REQUESTER_NAME as string,
    }
  ) {
    super(rawSong);
    this.requesterName = apiParams.requesterName;
    this.apiParams = apiParams;
  }

  consume = async () => {
    if (!this.wasConsumed) {
      await handleExecuteAction(
        async () => {
          await play([this.trackId]);
          store.setCurrentSong(this);
          if (this.apiParams.phoneNumberId) {
            await replyTextMessage(
              this.apiParams as APIParams,
              SuccessMessages.SONG_PLAYED
            );
          }
        },
        () => {}
      );
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
    this.remainingTime =
      this.durationMs - this.progressMs - TimeDefaults.NEXT_SONG_OFFSET_MS;
  }
}

export { SpotifySong, SpotifyQueuedSong, SpotifyCurrentSong };
