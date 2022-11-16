import { Collection, MongoClient } from "mongodb";
import { CrossRoadsUser, CrossroadsUserDBEntry } from "../types";

async function executeDatabaseOperation(operation: (dbClient: MongoClient) => void) {
  const uri = process.env.DATABASE_URI as string;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    await operation(client);
  } finally {
    await client.close();
  }
}

async function persistUser(user: CrossRoadsUser) {
  await executeDatabaseOperation(async (dbClient) => {
    const collection: Collection = dbClient.db("crossroads").collection("users");
    const phone = user.phoneNumber;
    const name = user.name;
    const songs: string[] = [];
    const eventSong = '';
    const eventImages: string[] = [];
    const userEntry = { phone, name, songs, eventSong, eventImages };

    await collection.updateOne({ phone }, { $set: userEntry}, { upsert: true });
  });
}

async function retrieveUsersFromDb(saveUserInStore: (userEntry: CrossroadsUserDBEntry) => void) {
  await executeDatabaseOperation(async (dbClient) => {
    const collection: Collection<CrossroadsUserDBEntry> = dbClient.db("crossroads").collection("users");
    await collection.find().forEach(userEntry => saveUserInStore(userEntry));
  });
}

async function persistSongs(phoneNumber: string, trackIds: string[]) {
  await executeDatabaseOperation(async (dbClient) => {
    const collection: Collection = dbClient.db("crossroads").collection("users");
    const phone = phoneNumber;
    const songs: string[] = trackIds;
    const userEntry = { phone, songs };

    await collection.updateOne({ phone }, { $set: userEntry});
  });
}

export { persistUser, retrieveUsersFromDb, persistSongs };