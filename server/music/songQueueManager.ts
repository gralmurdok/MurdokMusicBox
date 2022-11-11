import { Defaults, TimeDefaults } from "../constants";
import { SpotifyQueuedSong, SpotifySong } from "./song";
import { getRecomendedSongs, play } from "./spotify";
import { store } from "../store";
import { RawSong, Song } from "../types";
import { handleExecuteAction } from "../handlers/handleExecuteAction";

class SpotifySongQueueManager {
  songQueue: SpotifyQueuedSong[];
  queueRecommendedTimeout: any;

  constructor() {
    this.songQueue = [];
  }

  handleQueueRecommendedSongs = (shouldBePlayedIn: number) => {
    this.queueRecommendedTimeout = setTimeout(async () => {
      await handleExecuteAction(
        async () => {
          const recomendedSongs = await getRecomendedSongs();
          const tracks = recomendedSongs.data.tracks;
          const trackIds = tracks.map((track: { id: string }) => track.id);

          recomendedSongs.data.tracks
            .map((x: RawSong) => new SpotifySong(x))
            .forEach((x: SpotifySong) => console.log(x));

          await play(trackIds);
          store.setCurrentSong(new SpotifyQueuedSong(tracks[0]));
        },
        async () => {
          const last5Played = store.status.last5Played;
          await play(last5Played.map((song) => song.trackId));
          store.setNormalizedSong({
            ...last5Played[0],
            requesterName: Defaults.REQUESTER_NAME,
          });
        },
        () => {
          store.setNormalizedSong({ requesterName: Defaults.REQUESTER_NAME });
        }
      );
    }, shouldBePlayedIn);
  };

  setSongQueue = (songQueue: SpotifyQueuedSong[]) => {
    this.songQueue = songQueue;
    store.updateSongQueue(songQueue);
  };

  onConsumeSong = (durationMs: number) => {
    const remainingSongs = this.retrieveRemainingSongs();
    store.updateSongQueue(remainingSongs);
    if (remainingSongs.length === 0) {
      this.handleQueueRecommendedSongs(
        durationMs - TimeDefaults.NEXT_SONG_OFFSET_MS
      );
    }
  }

  addSong = (newSong: SpotifyQueuedSong) => {
    this.setSongQueue([...this.retrieveRemainingSongs(), newSong]);
    clearTimeout(this.queueRecommendedTimeout);
    newSong.delayedConsume(this.getCurrentSongPlayingTime(), this.onConsumeSong);
  };

  getCurrentSongPlayingTime = () => {
    const currentSong = store.getCurrentSong();
    const remainingTimeInMs = this
      .retrieveRemainingSongs()
      .reduce((accum: number, song: Song) => {
        return accum + song.durationMs;
      }, currentSong.remainingTime);
    const canForcePlay = currentSong.requesterName === Defaults.REQUESTER_NAME;
    return canForcePlay ? 0 : remainingTimeInMs;
  }

  pauseSongs = () => {
    clearTimeout(this.queueRecommendedTimeout);
    this.songQueue.forEach((song: SpotifyQueuedSong) => {
      clearTimeout(song.timeout);
    });
  }

  resumeSongs = () => {
    this.songQueue.forEach((song: SpotifyQueuedSong) => {
      song.delayedConsume(this.getCurrentSongPlayingTime(), this.onConsumeSong);
    })
  }

  retrieveRemainingSongs = () => {
    return this.songQueue.filter((spotifySong) => !spotifySong.wasConsumed);
  };
}

export { SpotifySongQueueManager };
