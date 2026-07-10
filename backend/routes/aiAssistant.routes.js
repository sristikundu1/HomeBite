import express from 'express';
import { chatWithAssistant } from '../controllers/aiAssistant.controller.js';

const router = express.Router();
const requests = new Map();

function assistantRateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip;
  const recent = (requests.get(key) || []).filter((time) => now - time < 60_000);
  if (recent.length >= 15) return res.status(429).json({ success: false, message: 'Too many AI requests. Please wait a moment.', errors: null });
  recent.push(now);
  requests.set(key, recent);
  next();
}

router.post('/chat', assistantRateLimit, chatWithAssistant);

export default router;
