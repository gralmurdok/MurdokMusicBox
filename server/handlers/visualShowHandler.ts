import { EventType } from "../constants";
import { broadcastData } from "../setup";
import { store } from "../store";

function startVisualShow() {
  let index = 0;

  const interval = setInterval(() => {
    if (store.mode === EventType.PLAYER) {
      clearInterval(interval);
    }

    broadcastData(EventType.LOAD_IMAGE, index);
    index = index < store.visualShow.images.length - 1 ? index + 1 : 0;
  }, 5000);
}

export { startVisualShow };
