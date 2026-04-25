import { Router } from "express";
import { z } from "zod";
import { store } from "../data/store.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { emitNotification, emitRequestCreated, emitRequestUpdated } from "../socket/index.js";
import type { RequestStatus } from "../types.js";
import { HttpError } from "../utils/httpError.js";

const router = Router();

const requestSchema = z.object({
  body: z.object({
    wasteType: z.enum(["plastic", "organic", "e-waste", "paper", "metal", "glass", "mixed"]),
    quantityKg: z.coerce.number().min(1, "Quantity must be at least 1 kg.").max(500, "Quantity cannot exceed 500 kg."),
    address: z.string().trim().min(8, "Please enter a full pickup address."),
    pickupDate: z.string().min(10, "Please select a pickup date."),
    notes: z.string().trim().max(500, "Notes cannot exceed 500 characters.").optional().or(z.literal("")),
    imageUrl: z.string().optional().or(z.literal(""))
  })
});

const statusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "in-progress", "completed"])
  }),
  params: z.object({
    id: z.string().min(1)
  })
});

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const all = await store.requests();
    if (req.user?.role === "admin") {
      const users = await store.users();
      const safeUsers = users.map((user) => {
        const userRequests = all.filter((item) => item.userId === user.id);
        const totalQuantityKg = userRequests.reduce((sum, item) => sum + item.quantityKg, 0);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          totalRequests: userRequests.length,
          totalQuantityKg,
          latestRequestAt: userRequests[0]?.createdAt || null,
          requests: userRequests
        };
      });

      res.json({ requests: all, users: safeUsers });
      return;
    }

    const requests = all.filter((item) => item.userId === req.user?.id);
    res.json({ requests });
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, validate(requestSchema), async (req, res, next) => {
  try {
    const user = await store.findUserById(req.user!.id);
    if (!user) throw new HttpError(401, "User account was not found.");

    const now = new Date().toISOString();
    const request = await store.addRequest({
      id: crypto.randomUUID(),
      userId: user.id,
      userName: user.name,
      wasteType: req.body.wasteType,
      quantityKg: Number(req.body.quantityKg),
      address: req.body.address,
      pickupDate: req.body.pickupDate,
      notes: req.body.notes || "",
      imageUrl: req.body.imageUrl || "",
      status: "pending",
      createdAt: now,
      updatedAt: now
    });

    emitRequestCreated(request);
    res.status(201).json({ request });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", requireAuth, requireRole("admin"), validate(statusSchema), async (req, res, next) => {
  try {
    const status = req.body.status as RequestStatus;
    const request = await store.updateRequest(String(req.params.id), { status });
    if (!request) throw new HttpError(404, "Pickup request not found.");

    const notification = await store.addNotification({
      id: crypto.randomUUID(),
      userId: request.userId,
      title: "Pickup status updated",
      message: `Your ${request.wasteType} pickup is now ${status}.`,
      read: false,
      createdAt: new Date().toISOString()
    });

    emitRequestUpdated(request);
    emitNotification(notification);
    res.json({ request, notification });
  } catch (error) {
    next(error);
  }
});

router.get("/stats/summary", requireAuth, async (req, res, next) => {
  try {
    const all = await store.requests();
    const visible = req.user?.role === "admin" ? all : all.filter((item) => item.userId === req.user?.id);
    const byStatus = visible.reduce<Record<RequestStatus, number>>(
      (acc, item) => ({ ...acc, [item.status]: acc[item.status] + 1 }),
      { pending: 0, "in-progress": 0, completed: 0 }
    );
    const byWasteType = visible.reduce<Record<string, number>>((acc, item) => {
      acc[item.wasteType] = (acc[item.wasteType] || 0) + item.quantityKg;
      return acc;
    }, {});

    res.json({
      total: visible.length,
      byStatus,
      byWasteType,
      recent: visible.slice(0, 5)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
