import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { DatabaseShape, NotificationItem, PickupRequest, User } from "../types.js";

const __filename = fileURLToPath(import.meta.url);
path.dirname(__filename);
const dbPath = process.env.DB_PATH || path.resolve(process.cwd(), "src", "data", "db.json");

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
    return readDatabase();
  },

  async users() {
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
    const db = await readDatabase();
    db.users.push(user);
    await writeDatabase(db);
    return user;
  },

  async requests() {
    return (await readDatabase()).requests;
  },

  async addRequest(request: PickupRequest) {
    const db = await readDatabase();
    db.requests.unshift(request);
    await writeDatabase(db);
    return request;
  },

  async updateRequest(id: string, patch: Partial<PickupRequest>) {
    const db = await readDatabase();
    const index = db.requests.findIndex((request) => request.id === id);
    if (index === -1) return null;
    db.requests[index] = { ...db.requests[index], ...patch, updatedAt: new Date().toISOString() };
    await writeDatabase(db);
    return db.requests[index];
  },

  async addNotification(notification: NotificationItem) {
    const db = await readDatabase();
    db.notifications.unshift(notification);
    await writeDatabase(db);
    return notification;
  },

  async notificationsForUser(userId: string) {
    return (await readDatabase()).notifications.filter((item) => item.userId === userId);
  }
};
