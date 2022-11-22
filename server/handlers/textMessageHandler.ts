import { ErrorMessages, EVENT_SONGS } from "../constants";
import { isSpecialEvent } from "../matchers/specialEventMatcher";
import { replyMessageBackToUser, replyMusicBackToUser, replyTextMessage } from "../messaging/whatsapp";
import { interactiveListMessage } from "../messaging/whatsappMessageBuilder";
import { SpotifySong } from "../music/song";
import { searchTracks } from "../music/spotify";
import { normalizeSongStructure, store } from "../store";
import { APIParams, RawSong } from "../types";
import { handleExecuteAction } from "./handleExecuteAction";

function handleTextMessage(apiParams: APIParams) {
  console.log("HANDLING AS TEXT MESSAGE " + apiParams.messageBody);
  if (isSpecialEvent(apiParams)) {
    handleSpecialEvent(apiParams);
  } else {
    handleMusicSearchViaWhatsappMessage(apiParams);
  }
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

async function handleSpecialEvent(apiParams: APIParams) {
  store.config.owner = apiParams.toPhoneNumber
  await replyMessageBackToUser(
    interactiveListMessage(
      store.config.owner,
      "Host de evento!",
      `Estas registrado como host de evento crossroads, por favor escribe el nombre de la cancion que deseas reproducir o elige una de la lista.`,
      EVENT_SONGS
    )
  );
}

export { handleTextMessage };
