import "./mongoDns.js";
import dns from "node:dns";
import mongoose from "mongoose";

const mongoCache = globalThis.__schoolMongoCache || {
  connectionPromise: null,
  resolvedMongoUri: null,
  dnsConfigured: false,
};

globalThis.__schoolMongoCache = mongoCache;

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

  if (mongoCache.resolvedMongoUri) {
    return mongoCache.resolvedMongoUri;
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

  mongoCache.resolvedMongoUri = `mongodb://${username}:${password}@${hosts}/${database}?${options.toString()}`;

  return mongoCache.resolvedMongoUri;
}

async function connectWithRetry(mongoUri, retries = 2) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await mongoose.connect(mongoUri, {
        dbName: "school",
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 15000,
      });
    } catch (error) {
      lastError = error;
      mongoCache.connectionPromise = null;

      if (attempt === retries) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }

  throw lastError;
}

export const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    if (mongoose.connection.readyState === 2) {
      await (mongoCache.connectionPromise || mongoose.connection.asPromise());
      return;
    }

    if (!mongoCache.connectionPromise) {
      if (!mongoCache.dnsConfigured) {
        dns.setServers(["1.1.1.1", "8.8.8.8"]);
        mongoCache.dnsConfigured = true;
      }

      const mongoUri = await getMongoUri();

      mongoCache.connectionPromise = connectWithRetry(mongoUri);
    }

    await mongoCache.connectionPromise;

    if (mongoose.connection.readyState !== 1) {
      mongoCache.connectionPromise = null;
      throw new Error("MongoDB connection did not reach connected state");
    }

    console.log("MongoDB connected");
  } catch (error) {
    mongoCache.connectionPromise = null;
    console.log("MongoDB error:", error);
    throw error;
  }
};
