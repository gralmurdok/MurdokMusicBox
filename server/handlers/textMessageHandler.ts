import { ErrorMessages } from "../constants";
import { replyMusicBackToUser, replyTextMessage } from "../messaging/whatsapp";
import { SpotifySong } from "../music/song";
import { searchTracks } from "../music/spotify";
import { normalizeSongStructure, store } from "../store";
import { APIParams, RawSong } from "../types";
import { handleExecuteAction } from "./handleExecuteAction";

function handleTextMessage(apiParams: APIParams) {
  console.log("HANDLING AS TEXT MESSAGE " + apiParams.messageBody);
  handleMusicSearchViaWhatsappMessage(apiParams);
}

async function handleMusicSearchViaWhatsappMessage(apiParams: APIParams) {
  await handleExecuteAction(
    async () => {
      const search = await searchTracks(
        apiParams.spotifyToken,
        apiParams.messageBody
      );
      store.updateUser(apiParams.toPhoneNumber, {
        searchResults: search.data.tracks.items
          .map((track: RawSong) =>
            normalizeSongStructure(new SpotifySong(track))
          )
          .slice(0, 10),
        searchQuery: apiParams.messageBody,
      });
      await replyMusicBackToUser(apiParams);
    },
    async () => {
      await replyTextMessage(
        apiParams.toPhoneNumber,
        ErrorMessages.SEARCH_ERROR
      );
    }
  );
}

export { handleTextMessage };
