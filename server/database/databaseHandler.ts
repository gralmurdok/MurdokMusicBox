import { Collection, MongoClient, ObjectId } from "mongodb";
import { CrossRoadsUser, CrossroadsUserDBEntry } from "../types";

async function executeDatabaseOperation(
  operation: (dbClient: MongoClient) => void
) {
  const uri = process.env.DATABASE_URI as string;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    await operation(client);
  } catch(err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

async function persistUser(user: CrossRoadsUser) {
  await executeDatabaseOperation(async (dbClient) => {
    const collection: Collection = dbClient
      .db("crossroads")
      .collection("users");
    const phone = user.phoneNumber;
    const name = user.name;
    const songs: string[] = [];
    const eventSong = "";
    const eventImages: string[] = [];
    const userEntry = { phone, name, songs, eventSong, eventImages };

    await collection.updateOne(
      { phone },
      { $set: userEntry },
      { upsert: true }
    );
  });
}

async function retrieveUsersFromDb(
  saveUserInStore: (userEntry: CrossroadsUserDBEntry) => void
) {
  await executeDatabaseOperation(async (dbClient) => {
    const collection: Collection<CrossroadsUserDBEntry> = dbClient
      .db("crossroads")
      .collection("users");
    await collection.find().forEach((userEntry) => saveUserInStore(userEntry));
  });
}

async function persistSongs(phoneNumber: string, trackIds: string[]) {
  await executeDatabaseOperation(async (dbClient) => {
    const collection: Collection = dbClient
      .db("crossroads")
      .collection("users");
    const phone = phoneNumber;
    const songs: string[] = trackIds;
    const userEntry = { phone, songs };

    await collection.updateOne({ phone }, { $set: userEntry });
  });
}

async function persistSuggestion(
  name: string,
  phone: string,
  suggestion: string
) {
  await executeDatabaseOperation(async (dbClient) => {
    const collection: Collection = dbClient
      .db("crossroads")
      .collection("suggestions");
    const suggestionEntry = { phone, name, suggestion };
    await collection.insertOne(suggestionEntry);
  });
}

async function persistGuest(
  name: string,
  phone: string,
  level: number = 0,
  admission: number = 1,
  special: boolean = false
) {
  await executeDatabaseOperation(async (dbClient) => {
    const collection: Collection = dbClient
      .db("crossroads")
      .collection("weddingGuests");
    const guestEntry = { phone, name, level, admission, special };
    await await collection.updateOne({ phone }, { $set: guestEntry }, { upsert: true });
  });
}

async function retrieveGuest(
  id: string,
) {
  let guest = null;
  await executeDatabaseOperation(async (dbClient) => {
    const collection: Collection = dbClient
      .db("crossroads")
      .collection("weddingGuests");
    guest = await collection.findOne({ _id: new ObjectId(id) });
    console.log(guest);
  });
  return guest;
}

async function retrieveGuests() {
  let guestsInfo = null;
  await executeDatabaseOperation(async (dbClient) => {
    const collection: Collection = dbClient
      .db("crossroads")
      .collection("weddingGuests");
    const entries = await collection.find().toArray();
    const admissionCount = await collection.aggregate([
      {$group: {_id:null, total_admissions:{$sum:"$admission"}}}
    ]).toArray();

    guestsInfo = {
      entries,
      total_admissions: admissionCount[0]?.total_admissions
    }
  });
  return guestsInfo;
}

export { persistUser, retrieveUsersFromDb, persistSongs, persistSuggestion, persistGuest, retrieveGuest, retrieveGuests };
