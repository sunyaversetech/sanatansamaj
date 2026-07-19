import { MongoClient, type Db } from "mongodb";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

function createClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to .env.local (see .env.example).",
    );
  }

  const client = new MongoClient(uri);

  if (process.env.NODE_ENV === "development") {
    // Reuse the connection across hot-reloads in dev instead of opening a new
    // one on every file change.
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  return client.connect();
}

let clientPromise: Promise<MongoClient> | undefined;

export async function getDb(): Promise<Db> {
  if (!clientPromise) clientPromise = createClientPromise();
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB || "sanatansamaj");
}
