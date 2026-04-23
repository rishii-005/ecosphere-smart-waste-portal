import mongoose, { Schema } from "mongoose";
import type { Role } from "../types.js";

const userSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"] satisfies Role[], required: true },
    createdAt: { type: String, required: true }
  },
  {
    versionKey: false
  }
);

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
