import express from 'express';
import { subscribeNewsletter } from '../controllers/newsletter.controller.js';

const router = express.Router();
router.post('/', subscribeNewsletter);

export default router;
