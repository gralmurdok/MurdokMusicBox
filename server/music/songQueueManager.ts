import { Defaults, EventType, TimeDefaults } from "../constants";
import { SpotifyQueuedSong, SpotifySong } from "./song";
import { getRecomendedSongs, play } from "./spotify";
import { store } from "../store";
import { RawSong, Song } from "../types";
import { handleExecuteAction } from "../handlers/handleExecuteAction";
import { broadcastData } from "../setup";

class SpotifySongQueueManager {
  songQueue: SpotifyQueuedSong[];
  queueRecommendedTimeout: any;
  specialSong?: SpotifyQueuedSong;

  constructor() {
    this.songQueue = [];
  }

  handleQueueRecommendedSongs = (shouldBePlayedIn: number) => {
    console.log('QUEUED RECOMMENDED SONGS');
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

  onSongEnding = (durationMs: number) => {
    const remainingSongs = this.retrieveRemainingSongs();
    store.updateSongQueue(remainingSongs);
    if (remainingSongs.length === 0) {
      this.handleQueueRecommendedSongs(
        durationMs - TimeDefaults.NEXT_SONG_OFFSET_MS
      );
    }
    broadcastData(EventType.PLAYER, store.status);
  };

  playSpecialSong = () => {
    this.pauseSongs();
    this.specialSong?.setOnEndSong((durationMs) => setTimeout(this.resumeSongs, durationMs));
    this.specialSong?.delayedConsume(0);
  };

  addSpecialSong = (newSong: SpotifyQueuedSong) => {
    this.specialSong = newSong;
  };

  addSong = (newSong: SpotifyQueuedSong) => {
    const delayInMs = this.getCurrentSongPlayingTime();
    this.setSongQueue([...this.retrieveRemainingSongs(), newSong]);
    clearTimeout(this.queueRecommendedTimeout);
    newSong.setOnEndSong((songDurationInMs: number) => this.onSongEnding(songDurationInMs));
    newSong.delayedConsume(
      delayInMs
    );
  };

  getCurrentSongPlayingTime = () => {
    const currentSong = store.getCurrentSong();
    const remainingTimeInMs = this.retrieveRemainingSongs().reduce(
      (accum: number, song: Song) => {
        return accum + song.durationMs;
      },
      currentSong.remainingTime
    );
    const canForcePlay = currentSong.requesterName === Defaults.REQUESTER_NAME;
    return canForcePlay ? 0 : remainingTimeInMs;
  };

  pauseSongs = () => {
    clearTimeout(this.queueRecommendedTimeout);
    this.songQueue.forEach(async (song: SpotifyQueuedSong) => {
      await song.pause();
    });
  };

  resumeSongs = () => {
    if (this.songQueue.length > 0) {
      let delayInMs = 0;
      this.retrieveRemainingSongs().forEach(async (song: SpotifyQueuedSong) => {
        await song.delayedConsume(
          delayInMs
        );
        delayInMs = delayInMs + song.durationMs;
      });
    } else {
      this.handleQueueRecommendedSongs(0);
    }
  };

  retrieveRemainingSongs = () => {
    return this.songQueue.filter((spotifySong) => !spotifySong.wasConsumed);
  };
}

export { SpotifySongQueueManager };
