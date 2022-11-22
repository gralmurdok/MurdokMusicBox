import { broadcastData } from "../setup";
import { SpotifyCurrentSong } from "../music/song";
import { getCurrentSong, refreshToken } from "../music/spotify";
import { store } from "../store";
import { WebsocketsActions } from "../constants";
import { handleExecuteAction } from "./handleExecuteAction";

async function updateCurrentPlayingSong() {
  await handleExecuteAction(
    async () => {
      const currentRawSong = await getCurrentSong(store.auth.accessToken);
      const currentSong = new SpotifyCurrentSong(
        currentRawSong.data.item,
        currentRawSong.data.progress_ms
      );
      store.setIsSpotifyReady(true);
      store.setIsPlayingMusic(currentRawSong.data.is_playing);
      store.setCurrentSong(currentSong);
      store.updateLast5Played();
    },
    async () => {
      store.setIsSpotifyReady(false);
      store.setIsPlayingMusic(false);
    }
  );
}

async function updateAppStatus() {
  const now = Date.now();
  const shouldRefreshToken = store.auth.expiresAt < now;

  if (shouldRefreshToken) {
    await refreshToken();
  }

  await updateCurrentPlayingSong();
  store.updateAuthStatus();
  broadcastData(WebsocketsActions.PLAYER, store.status);
}

export { updateAppStatus };
