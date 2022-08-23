import axios from "axios";
import { replyMusicBackToUser, replyTextMessage } from "./whatsapp";

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
  console.log(token);
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

async function handleMusicManagement(
  token: string,
  phoneNumberId: string,
  from: string,
  whatsappMessage: string,
  trackId: string
) {
  try {
    if (trackId) {
      await queueSong(token, trackId as string);
    } else {
      const search = await searchTracks(token, whatsappMessage);
      console.log(search.data.tracks.items);
      // await replyMusicBackToUser(
      //   token,
      //   phoneNumberId,
      //   from,
      //   search.data.tracks.items
      // );
    }
  } catch (err) {
    console.log(err);
    await replyTextMessage(
      token,
      phoneNumberId,
      from,
      "algo salio mal, acercate a la barra para reportarlo, nosotros lo arreglaremos"
    );
  }
}

export { play, queueSong, searchTracks, handleMusicManagement };
