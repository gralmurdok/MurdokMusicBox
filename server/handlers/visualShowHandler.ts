import { EventType } from "../constants";
import { broadcastData } from "../setup";
import { store } from "../store";

function startVisualShow() {
  let index = 0;

  const interval = setInterval(() => {
    broadcastData(EventType.LOAD_IMAGE, index);
    index = index < store.visualShow.images.length ? index + 1 : 0;

    if (store.mode === EventType.PLAYER) {
      clearInterval(interval);
    }
  }, 5000);
}

export { startVisualShow };
