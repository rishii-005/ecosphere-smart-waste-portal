import jwt from "jsonwebtoken";
import { config } from "../config.js";
import type { PublicUser, User } from "../types.js";

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

export function signToken(user: PublicUser): string {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwtSecret, {
    expiresIn: "7d"
  });
}
