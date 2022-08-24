import { CrossRoadsUser } from "./types";

class Store {
  users: Record<string, CrossRoadsUser>;
  
  constructor() {
    this.users = {};
  }
}

const store = new Store();

export { store };