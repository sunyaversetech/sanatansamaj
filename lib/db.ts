import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var _mongooseConnPromise: Promise<typeof mongoose> | undefined;
}

// A member is watching a page wait on this connection in real time (the
// checkout-verify step), so fail fast rather than hanging on the driver's
// much longer default server-selection timeout.
const CONNECT_OPTIONS = {
  serverSelectionTimeoutMS: 6000,
  connectTimeoutMS: 6000,
};

export async function connectToDb(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local (see .env.example).");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Reuse the in-flight/established connection across hot-reloads in dev and
  // across invocations in serverless — mirrors the standard Next.js +
  // Mongoose singleton pattern.
  if (!global._mongooseConnPromise) {
    global._mongooseConnPromise = mongoose.connect(uri, {
      ...CONNECT_OPTIONS,
      dbName: process.env.MONGODB_DB || "sanatansamaj",
    });
  }

  try {
    return await global._mongooseConnPromise;
  } catch (err) {
    // Don't leave a rejected promise cached — the next call should retry
    // the connection rather than immediately fail forever.
    global._mongooseConnPromise = undefined;
    throw err;
  }
}
