import mongoose from "mongoose";
import { config } from "../config.js";
import { seedDemoDataIfNeeded } from "../utils/seed.js";

let hasConnected = false;

export async function connectMongoIfConfigured() {
  if (!config.mongodbUri) {
    console.log("MongoDB URI not provided. Using local JSON storage fallback.");
    return false;
  }

  if (hasConnected) return true;

  await mongoose.connect(config.mongodbUri, {
    dbName: config.mongodbDbName || undefined
  });

  hasConnected = true;
  console.log("MongoDB connected.");
  await seedDemoDataIfNeeded();
  return true;
}

export function isMongoEnabled() {
  return hasConnected && mongoose.connection.readyState === 1;
}
