import { existsSync } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NotificationModel } from "../models/NotificationModel.js";
import { PickupRequestModel } from "../models/PickupRequestModel.js";
import { UserModel } from "../models/UserModel.js";
import type { DatabaseShape } from "../types.js";

const passwordHash = "$2a$10$U.0n0fecze..SGilfShkDuzI1WkTrb.OWvNQC0AV0xzdoIiQ/RzpC";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbCandidates = [
  process.env.DB_PATH,
  path.resolve(process.cwd(), "src", "data", "db.json"),
  path.resolve(process.cwd(), "backend", "src", "data", "db.json"),
  path.resolve(__dirname, "..", "data", "db.json")
].filter((candidate): candidate is string => Boolean(candidate));

async function readLegacyDb() {
  const dbPath = dbCandidates.find((candidate) => existsSync(candidate));
  if (!dbPath) return null;

  const raw = await fs.readFile(dbPath, "utf-8");
  return JSON.parse(raw) as DatabaseShape;
}

export async function seedDemoDataIfNeeded() {
  const usersCount = await UserModel.countDocuments();
  if (usersCount > 0) return;

  const legacyDb = await readLegacyDb();
  if (legacyDb && legacyDb.users.length > 0) {
    await UserModel.insertMany(legacyDb.users, { ordered: false });
    if (legacyDb.requests.length > 0) {
      await PickupRequestModel.insertMany(legacyDb.requests, { ordered: false });
    }
    if (legacyDb.notifications.length > 0) {
      await NotificationModel.insertMany(legacyDb.notifications, { ordered: false });
    }
    console.log("Legacy JSON data migrated to MongoDB.");
    return;
  }

  await UserModel.insertMany([
    {
      id: "admin-001",
      name: "City Admin",
      email: "admin@smartwaste.local",
      passwordHash,
      role: "admin",
      createdAt: "2026-04-19T10:00:00.000Z"
    },
    {
      id: "user-001",
      name: "Asha Citizen",
      email: "asha@example.com",
      passwordHash,
      role: "user",
      createdAt: "2026-04-19T10:01:00.000Z"
    }
  ]);

  await PickupRequestModel.insertMany([
    {
      id: "req-001",
      userId: "user-001",
      userName: "Asha Citizen",
      wasteType: "plastic",
      quantityKg: 4,
      address: "12 Green Street, Bengaluru",
      pickupDate: "2026-04-22",
      notes: "Mostly PET bottles, cleaned and packed.",
      imageUrl: "",
      status: "pending",
      createdAt: "2026-04-19T10:04:00.000Z",
      updatedAt: "2026-04-19T10:04:00.000Z"
    },
    {
      id: "req-002",
      userId: "user-001",
      userName: "Asha Citizen",
      wasteType: "organic",
      quantityKg: 7,
      address: "12 Green Street, Bengaluru",
      pickupDate: "2026-04-20",
      notes: "Kitchen scraps for composting.",
      imageUrl: "",
      status: "completed",
      createdAt: "2026-04-18T09:30:00.000Z",
      updatedAt: "2026-04-19T09:20:00.000Z"
    }
  ]);

  await NotificationModel.insertMany([
    {
      id: "notif-001",
      userId: "user-001",
      title: "Pickup scheduled",
      message: "Your pickup request has been scheduled successfully.",
      read: false,
      createdAt: "2026-04-19T10:05:00.000Z"
    }
  ]);
}
