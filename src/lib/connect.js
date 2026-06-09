import "./mongoDns.js";
import dns from "node:dns";
import mongoose from "mongoose";

let connectionPromise = null;
let resolvedMongoUri = null;

const atlasSrvFallbacks = {
  "cluster0.ymku2eu.mongodb.net": {
    hosts: [
      "ac-0sedrgs-shard-00-00.ymku2eu.mongodb.net:27017",
      "ac-0sedrgs-shard-00-01.ymku2eu.mongodb.net:27017",
      "ac-0sedrgs-shard-00-02.ymku2eu.mongodb.net:27017",
    ],
    options: "authSource=admin&replicaSet=atlas-gdx4mu-shard-0",
  },
};

async function getMongoUri() {
  const uri = process.env.MONGODB_URI;

  if (!uri?.startsWith("mongodb+srv://")) {
    return uri;
  }

  if (resolvedMongoUri) {
    return resolvedMongoUri;
  }

  const match = uri.match(
    /^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]+)(.*)$/,
  );

  if (!match) {
    return uri;
  }

  const [, username, password, hostname, database] = match;
  const fallback = atlasSrvFallbacks[hostname];
  const [hosts, txtOptions] = fallback
    ? [fallback.hosts.join(","), fallback.options]
    : await Promise.all([
        dns.promises
          .resolveSrv(`_mongodb._tcp.${hostname}`)
          .then((records) =>
            records.map((record) => `${record.name}:${record.port}`).join(","),
          ),
        dns.promises
          .resolveTxt(hostname)
          .then((records) => records.flat().join("&"))
          .catch(() => ""),
      ]);

  const options = new URLSearchParams(txtOptions);

  options.set("tls", "true");
  options.set("retryWrites", "true");
  options.set("w", "majority");

  resolvedMongoUri = `mongodb://${username}:${password}@${hosts}/${database}?${options.toString()}`;

  return resolvedMongoUri;
}

export const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    if (!connectionPromise) {
      dns.setServers(["1.1.1.1", "8.8.8.8"]);

      const mongoUri = await getMongoUri();

      connectionPromise = mongoose.connect(mongoUri, {
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
