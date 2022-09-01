import axios from "axios";

function play(token: string) {
  return axios({
    method: "PUT", // Required, HTTP method, a string, e.g. POST, GET
    url: "https://api.spotify.com/v1/me/player/play?device_id=7e3b778fefb21987775df97c7d5a5531e55b0b92",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

export { play, queueSong, searchTracks, getCurrentSong };