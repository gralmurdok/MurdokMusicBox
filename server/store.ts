import { CrossRoadsUser, AuthObject, AppStatus } from "./types";

class Store {
  auth: AuthObject;
  users: Record<string, CrossRoadsUser>;
  status: AppStatus;
  
  constructor() {
    this.auth = {
      accessToken: "",
      refreshToken: "",
      expiresIn: 0,
    };
    this.users = {};
    this.status = {
      isReady: false,
      permitToken: {
        token: '',
        validUntil: 0
      },
      currentSong: {
        name: '',
        trackId: '',
        artist: '',
        endsAt: 0,
      },
      readyToFetchCurrentSong: true,
    }
  }
}

const store = new Store();

export { store };