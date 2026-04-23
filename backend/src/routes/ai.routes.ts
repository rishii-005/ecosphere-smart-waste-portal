import OpenAI from "openai";
import { Router } from "express";
import { z } from "zod";
import { config } from "../config.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { HttpError } from "../utils/httpError.js";

const router = Router();

const aiSchema = z.object({
  body: z.object({
    message: z.string().min(2).max(2000),
    imageBase64: z.string().optional(),
    mimeType: z.string().optional()
  })
});

const openai = config.openaiApiKey
  ? new OpenAI({
      apiKey: config.openaiApiKey,
      baseURL: config.openaiBaseUrl || undefined
    })
  : null;

router.post("/recycling-advice", requireAuth, validate(aiSchema), async (req, res, next) => {
  try {
    if (!openai) {
      return res.json({
        answer:
          "Demo mode: separate the item by material, clean dry recyclables, keep organic waste for composting, and contact an authorized e-waste center for batteries or electronics. Add OPENAI_API_KEY, OPENAI_BASE_URL, and OPENAI_MODEL in backend/.env for live AI responses."
      });
    }

    const input = [
      {
        role: "system" as const,
        content:
          "You are EcoGuide, a municipal recycling assistant. Give safe, practical, location-neutral waste sorting advice. Use short sections: Category, What to do, Safety, Eco tip. Never invent local laws or pickup promises."
      },
      {
        role: "user" as const,
        content: req.body.imageBase64
          ? [
              { type: "input_text" as const, text: req.body.message },
              {
                type: "input_image" as const,
                image_url: `data:${req.body.mimeType || "image/jpeg"};base64,${req.body.imageBase64}`
              }
            ]
          : req.body.message
      }
    ];

    const response = await openai.responses.create({
      model: config.openaiModel,
      input,
      temperature: 0.3,
      max_output_tokens: 600
    });

    res.json({ answer: response.output_text });
  } catch (error) {
    next(error instanceof Error ? new HttpError(502, `AI service error: ${error.message}`) : error);
  }
});

export default router;
