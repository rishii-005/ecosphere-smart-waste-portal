import { Router } from "express";
import { store } from "../data/store.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const notifications = await store.notificationsForUser(req.user!.id);
    res.json({ notifications });
  } catch (error) {
    next(error);
  }
});

export default router;
