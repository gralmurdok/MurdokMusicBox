import { WebsocketsActions } from "../constants";
import {
  replyMessageBackToUser,
  replyTextMessage,
} from "../messaging/whatsapp";
import { broadcastData } from "../setup";
import { defaultCurrentSong, store } from "../store";
import { songQueueManager } from "./interactiveListMessageHandler";

function startVisualShow(requesterPhoneNumber: string) {
  if (requesterPhoneNumber === store.config.owner) {
    broadcastData(WebsocketsActions.LOAD_IMAGE, undefined);
    songQueueManager.playSpecialSong();

    let index = 0;

    const interval = setInterval(() => {
      if (store.mode === WebsocketsActions.PLAYER) {
        clearInterval(interval);
      } else {
        broadcastData(WebsocketsActions.LOAD_IMAGE, index);
        index = index < store.visualShow.images.length - 1 ? index + 1 : 0;
      }
    }, 5000);
  } else {
    replyTextMessage(
      requesterPhoneNumber,
      "No tienes ningun evento pendiente."
    );
  }
}

function endVisualShow(requesterPhoneNumber: string) {
  if (requesterPhoneNumber === store.config.owner) {
    // resets event data
    store.config = {
      owner: "",
      specialSong: defaultCurrentSong,
    };
    store.visualShow = {
      title: "",
      images: [],
    };
    songQueueManager.resumeSongs();
    broadcastData(WebsocketsActions.PLAYER, store.status);
  } else {
    replyTextMessage(requesterPhoneNumber, "No tienes ningun evento en curso.");
  }
}

export { startVisualShow, endVisualShow };
