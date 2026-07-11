import express from 'express';
import { getBlogBySlug, getBlogs } from '../controllers/blogs.controller.js';

const router = express.Router();
router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
export default router;
