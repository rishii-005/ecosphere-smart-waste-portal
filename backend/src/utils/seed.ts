import { UserModel } from "../models/UserModel.js";
import { PickupRequestModel } from "../models/PickupRequestModel.js";

const passwordHash = "$2a$10$U.0n0fecze..SGilfShkDuzI1WkTrb.OWvNQC0AV0xzdoIiQ/RzpC";

export async function seedDemoDataIfNeeded() {
  const usersCount = await UserModel.countDocuments();
  if (usersCount > 0) return;

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
}
