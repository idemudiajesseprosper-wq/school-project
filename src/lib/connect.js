import mongoose from "mongoose";

let connectionPromise = null;

export const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    if (!connectionPromise) {
      connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
        dbName: "school",
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
      });
    }

    await connectionPromise;

    if (mongoose.connection.readyState !== 1) {
      connectionPromise = null;
      throw new Error("MongoDB connection did not reach connected state");
    }

    console.log("MongoDB connected");
  } catch (error) {
    connectionPromise = null;
    console.log("MongoDB error:", error);
    throw error;
  }
};
