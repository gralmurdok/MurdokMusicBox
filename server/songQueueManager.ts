import { SpotifyQueuedSong } from "./song";
import { store } from "./store";

class SpotifySongQueueManager {
  songQueue: SpotifyQueuedSong[];

  constructor() {
    this.songQueue = [];
  }

  consumeNext = () => {
    const remainingSongs = this.retrieveRemainingSongs();
    if (remainingSongs.length > 0) {
      const nextSong = remainingSongs[0];
      nextSong.consume();
    } else {
      console.log("running out of songs");
    }
  };

  addSong = (newSong: SpotifyQueuedSong, shouldBePlayedIn: number) => {
    this.songQueue = [...this.songQueue, newSong];
    store.status = {
      ...store.status,
      songQueue: this.retrieveRemainingSongs(),
    }

    setTimeout(async () => {
      await newSong.consume();
    }, shouldBePlayedIn);
  };

  retrieveRemainingSongs = () => {
    return this.songQueue.filter((spotifySong) => !spotifySong.wasConsumed);
  };
}

export { SpotifySongQueueManager };
