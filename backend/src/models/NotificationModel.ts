import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: String, required: true }
  },
  {
    versionKey: false
  }
);

export const NotificationModel =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
