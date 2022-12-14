import axios from "axios";
import { handleExecuteAction } from "../handlers/handleExecuteAction";
import { store } from "../store";
import { Song } from "../types";

function play(trackIds: string[]) {
  const trackIdUris = trackIds.map((trackId) => `spotify:track:${trackId}`);

  return axios({
    method: "PUT", // Required, HTTP method, a string, e.g. POST, GET
    url: "https://api.spotify.com/v1/me/player/play",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${store.auth.accessToken}`,
    },
    data: {
      uris: trackIdUris,
      offset: {
        position: 0,
      },
      position_ms: 0,
    },
  });
}

function getRecomendedSongs() {
  const params = new URLSearchParams({
    seed_tracks: store.status.last5Played
      .map((song: Song) => song.trackId)
      .join(","),
    market: "EC",
    //min_popularity: "80",
  }).toString();

  console.log(params);

  return axios({
    method: "GET", // Required, HTTP method, a string, e.g. POST, GET
    url: `https://api.spotify.com/v1/recommendations?${params}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${store.auth.accessToken}`,
    },
  });
}

function playAlbum(token: string, albumId: string, positionOffset: number) {
  return axios({
    method: "PUT", // Required, HTTP method, a string, e.g. POST, GET
    url: "https://api.spotify.com/v1/me/player/play",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: {
      context_uri: `spotify:album:${albumId}`,
      offset: { position: positionOffset },
      position_ms: 0,
    },
  });
}

function queueSong(token: string, trackId: string) {
  return axios({
    method: "POST", // Required, HTTP method, a string, e.g. POST, GET
    url: `https://api.spotify.com/v1/me/player/queue?uri=spotify:track:${trackId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

function searchTracks(token: string, searchString: string) {
  const params = new URLSearchParams({
    q: searchString,
    type: "track",
  }).toString();
  return axios({
    method: "GET", // Required, HTTP method, a string, e.g. POST, GET
    url: `https://api.spotify.com/v1/search?${params}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

function getCurrentSong(token: string) {
  return axios({
    method: "GET",
    url: "https://api.spotify.com/v1/me/player/currently-playing",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

function fetchSongByTrackId(trackId: string) {
  return axios({
    method: "GET",
    url: `https://api.spotify.com/v1/tracks/${trackId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${store.auth.accessToken}`,
    },
  });
}

async function refreshToken() {
  const authCredentials = Buffer.from(
    process.env.CLIENT_ID + ":" + process.env.SECRET_ID
  ).toString("base64");

  await handleExecuteAction(
    async () => {
      const authResponse = await axios({
        method: "POST",
        url: "https://accounts.spotify.com/api/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authCredentials}`,
        },
        params: {
          grant_type: "refresh_token",
          refresh_token: store.auth.refreshToken,
        },
      });
      console.log("REFRESHING TOKEN ", authResponse.data);
      store.auth = {
        ...store.auth,
        accessToken: authResponse.data.access_token,
        expiresAt: Date.now() + authResponse.data.expires_in * 1000,
      };
    },
    () => {}
  );
}

export {
  play,
  queueSong,
  searchTracks,
  getCurrentSong,
  refreshToken,
  playAlbum,
  getRecomendedSongs,
  fetchSongByTrackId,
};
