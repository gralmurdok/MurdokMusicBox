import { Defaults, TimeDefaults } from "../constants";
import { SpotifyQueuedSong, SpotifySong } from "./song";
import { getRecomendedSongs, play } from "./spotify";
import { store } from "../store";
import { RawSong } from "../types";
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

  addSong = (newSong: SpotifyQueuedSong, shouldBePlayedIn: number) => {
    this.setSongQueue([...this.retrieveRemainingSongs(), newSong]);
    clearTimeout(this.queueRecommendedTimeout);
    newSong.delayedConsume(shouldBePlayedIn, () => {
      const remainingSongs = this.retrieveRemainingSongs();
      store.updateSongQueue(remainingSongs);
      if (remainingSongs.length === 0) {
        this.handleQueueRecommendedSongs(
          newSong.durationMs - TimeDefaults.NEXT_SONG_OFFSET_MS
        );
      }
    });
  };

  retrieveRemainingSongs = () => {
    return this.songQueue.filter((spotifySong) => !spotifySong.wasConsumed);
  };
}

export { SpotifySongQueueManager };
