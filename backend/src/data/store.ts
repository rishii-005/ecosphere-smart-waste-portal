import { existsSync } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isMongoEnabled } from "../db/mongoose.js";
import { NotificationModel } from "../models/NotificationModel.js";
import { PickupRequestModel } from "../models/PickupRequestModel.js";
import { UserModel } from "../models/UserModel.js";
import type { DatabaseShape, NotificationItem, PickupRequest, User } from "../types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbCandidates = [
  process.env.DB_PATH,
  path.resolve(process.cwd(), "src", "data", "db.json"),
  path.resolve(process.cwd(), "backend", "src", "data", "db.json"),
  path.resolve(__dirname, "db.json"),
  path.resolve(__dirname, "..", "..", "src", "data", "db.json")
].filter((candidate): candidate is string => Boolean(candidate));

const dbPath = dbCandidates.find((candidate) => existsSync(candidate)) || dbCandidates[0];

let cache: DatabaseShape | null = null;

async function readDatabase(): Promise<DatabaseShape> {
  if (cache) return cache;
  const raw = await fs.readFile(dbPath, "utf-8");
  cache = JSON.parse(raw) as DatabaseShape;
  return cache;
}

async function writeDatabase(db: DatabaseShape): Promise<void> {
  cache = db;
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}

export const store = {
  async all() {
    if (isMongoEnabled()) {
      const [users, requests, notifications] = await Promise.all([
        UserModel.find().lean<User[]>(),
        PickupRequestModel.find().sort({ createdAt: -1 }).lean<PickupRequest[]>(),
        NotificationModel.find().sort({ createdAt: -1 }).lean<NotificationItem[]>()
      ]);
      return { users, requests, notifications };
    }
    return readDatabase();
  },

  async users() {
    if (isMongoEnabled()) {
      return UserModel.find().lean<User[]>();
    }
    return (await readDatabase()).users;
  },

  async findUserByEmail(email: string) {
    const users = await this.users();
    return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  },

  async findUserById(id: string) {
    const users = await this.users();
    return users.find((user) => user.id === id);
  },

  async addUser(user: User) {
    if (isMongoEnabled()) {
      await UserModel.create(user);
      return user;
    }
    const db = await readDatabase();
    db.users.push(user);
    await writeDatabase(db);
    return user;
  },

  async requests() {
    if (isMongoEnabled()) {
      return PickupRequestModel.find().sort({ createdAt: -1 }).lean<PickupRequest[]>();
    }
    return (await readDatabase()).requests;
  },

  async addRequest(request: PickupRequest) {
    if (isMongoEnabled()) {
      await PickupRequestModel.create(request);
      return request;
    }
    const db = await readDatabase();
    db.requests.unshift(request);
    await writeDatabase(db);
    return request;
  },

  async updateRequest(id: string, patch: Partial<PickupRequest>) {
    if (isMongoEnabled()) {
      const request = await PickupRequestModel.findOneAndUpdate(
        { id },
        { ...patch, updatedAt: new Date().toISOString() },
        { new: true }
      ).lean<PickupRequest | null>();
      return request;
    }
    const db = await readDatabase();
    const index = db.requests.findIndex((request) => request.id === id);
    if (index === -1) return null;
    db.requests[index] = { ...db.requests[index], ...patch, updatedAt: new Date().toISOString() };
    await writeDatabase(db);
    return db.requests[index];
  },

  async addNotification(notification: NotificationItem) {
    if (isMongoEnabled()) {
      await NotificationModel.create(notification);
      return notification;
    }
    const db = await readDatabase();
    db.notifications.unshift(notification);
    await writeDatabase(db);
    return notification;
  },

  async notificationsForUser(userId: string) {
    if (isMongoEnabled()) {
      return NotificationModel.find({ userId }).sort({ createdAt: -1 }).lean<NotificationItem[]>();
    }
    return (await readDatabase()).notifications.filter((item) => item.userId === userId);
  }
};
