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
      }
    }
  }
}

const store = new Store();

export { store };