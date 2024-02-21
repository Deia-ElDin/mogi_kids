import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { connection: null, promise: null };

export const connectToDb = async () => {
  console.log("Connecting to Mongo 1");

  if (cached.connection) return cached.connection;

  console.log("Connecting to Mongo 2");

  if (!MONGODB_URI) throw new Error("Failed to connect to database");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "database",
      bufferCommands: false,
    });

  cached.connection = await cached.promise;

  console.log("connectToDb");
  return cached.connection;
};
