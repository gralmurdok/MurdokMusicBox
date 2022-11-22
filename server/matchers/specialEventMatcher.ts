import { store } from "../store";
import { APIParams } from "../types";

function isSpecialEvent(apiParams: APIParams) {
    return store.config.specialEventCode && apiParams.messageBody === store.config.specialEventCode;
}

export { isSpecialEvent };