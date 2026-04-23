import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { store } from "../data/store.js";
import { validate } from "../middleware/validate.js";
import { signToken, toPublicUser } from "../utils/auth.js";
import { HttpError } from "../utils/httpError.js";

const router = Router();

const signupSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6)
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});

router.post("/signup", validate(signupSchema), async (req, res, next) => {
  try {
    const existing = await store.findUserByEmail(req.body.email);
    if (existing) throw new HttpError(409, "This email is already registered.");

    const user = await store.addUser({
      id: crypto.randomUUID(),
      name: req.body.name,
      email: req.body.email,
      passwordHash: await bcrypt.hash(req.body.password, 10),
      role: "user",
      createdAt: new Date().toISOString()
    });

    const publicUser = toPublicUser(user);
    res.status(201).json({ user: publicUser, token: signToken(publicUser) });
  } catch (error) {
    next(error);
  }
});

router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const user = await store.findUserByEmail(req.body.email);
    if (!user) throw new HttpError(401, "Invalid email or password.");

    const valid = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!valid) throw new HttpError(401, "Invalid email or password.");

    const publicUser = toPublicUser(user);
    res.json({ user: publicUser, token: signToken(publicUser) });
  } catch (error) {
    next(error);
  }
});

export default router;
