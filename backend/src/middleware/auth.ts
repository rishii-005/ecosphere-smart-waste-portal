import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import type { AuthRequestUser, Role } from "../types.js";
import { HttpError } from "../utils/httpError.js";

declare global {
  namespace Express {
    interface Request {
      user?: AuthRequestUser;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return next(new HttpError(401, "Authentication token is missing."));

  try {
    req.user = jwt.verify(token, config.jwtSecret) as AuthRequestUser;
    next();
  } catch {
    next(new HttpError(401, "Authentication token is invalid or expired."));
  }
}

export function requireRole(role: Role) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new HttpError(401, "Please sign in first."));
    if (req.user.role !== role) return next(new HttpError(403, "You do not have permission."));
    next();
  };
}
