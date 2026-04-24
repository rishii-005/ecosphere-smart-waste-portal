export type Role = "user" | "admin";
export type WasteType = "plastic" | "organic" | "e-waste" | "paper" | "metal" | "glass" | "mixed";
export type RequestStatus = "pending" | "in-progress" | "completed";

export interface User {
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

export interface AdminUserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  totalRequests: number;
  totalQuantityKg: number;
  latestRequestAt: string | null;
  requests: PickupRequest[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface StatsSummary {
  total: number;
  byStatus: Record<RequestStatus, number>;
  byWasteType: Record<string, number>;
  recent: PickupRequest[];
}
