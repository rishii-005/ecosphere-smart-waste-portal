export type Role = "user" | "admin";
export type WasteType = "plastic" | "organic" | "e-waste" | "paper" | "metal" | "glass" | "mixed";
export type RequestStatus = "pending" | "in-progress" | "completed";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface PickupRequest {
  id: string;
  userId: string;
  userName: string;
  wasteType: WasteType;
  quantityKg: number;
  address: string;
  pickupDate: string;
  notes?: string;
  imageUrl?: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface DatabaseShape {
  users: User[];
  requests: PickupRequest[];
  notifications: NotificationItem[];
}

export interface AuthRequestUser {
  id: string;
  email: string;
  role: Role;
}
