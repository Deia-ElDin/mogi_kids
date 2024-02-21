import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { connection: null, promise: null };

export const connectToDb = async () => {
  if (cached.connection)  
  {
    return cached.connection;
  }  

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
