import { Events } from "../constants";
import { APIParams } from "../types";
import { endVisualShow, startVisualShow } from "./visualShowHandler";

function handleInteractiveButtonMessage(apiParams: APIParams) {
  if (apiParams.interactiveButtonReply === Events.INIT) {
    startVisualShow(apiParams.toPhoneNumber);
  } else if (apiParams.interactiveButtonReply === Events.END) {
    endVisualShow(apiParams.toPhoneNumber);
  }
}

export { handleInteractiveButtonMessage };
