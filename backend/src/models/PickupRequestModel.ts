import mongoose, { Schema } from "mongoose";
import type { RequestStatus, WasteType } from "../types.js";

const pickupRequestSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    wasteType: { type: String, enum: ["plastic", "organic", "e-waste", "paper", "metal", "glass", "mixed"] satisfies WasteType[], required: true },
    quantityKg: { type: Number, required: true },
    address: { type: String, required: true },
    pickupDate: { type: String, required: true },
    notes: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    status: { type: String, enum: ["pending", "in-progress", "completed"] satisfies RequestStatus[], required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true }
  },
  {
    versionKey: false
  }
);

export const PickupRequestModel =
  mongoose.models.PickupRequest || mongoose.model("PickupRequest", pickupRequestSchema);
