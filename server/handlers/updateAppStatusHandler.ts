import { broadcastData } from "../setup";
import { SpotifyCurrentSong } from "../music/song";
import {
  getCurrentSong,
  refreshToken,
} from "../music/spotify";
import { store } from "../store";

async function updateCurrentPlayingSong() {
  try {
    const currentRawSong = await getCurrentSong(store.auth.accessToken);
    const currentSong = new SpotifyCurrentSong(
      currentRawSong.data.item,
      currentRawSong.data.progress_ms
    );
    store.setIsSpotifyReady(true);
    store.setIsPlayingMusic(currentRawSong.data.is_playing);
    store.setCurrentSong(currentSong);
    store.updateLast5Played();
  } catch (err) {
    store.setIsSpotifyReady(false);
    store.setIsPlayingMusic(false);
  }
}

async function updateAppStatus() {
  const now = Date.now();
  const shouldRefreshToken = store.auth.expiresAt < now;

  if (shouldRefreshToken) {
    await refreshToken();
  }

  await updateCurrentPlayingSong();
  store.updateAuthStatus();
  broadcastData(store.status);
}

export {
  updateAppStatus,
};
