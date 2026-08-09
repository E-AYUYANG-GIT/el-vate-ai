import { Router } from 'express';
import { generateDescription } from '../controllers/generate.controller.js';
import { validateGenerateInput } from '../middleware/validateGenerateInput.js';
import { upload, cleanupUpload } from '../middleware/upload.middleware.js';
import { generateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// Order matters: the rate limiter runs first so a blocked request never
// even touches disk (no point saving a temp file for a request we're
// about to reject). Multer parses the multipart body (populating req.body
// and req.file) before validation runs, and cleanup is registered before
// the handler so it fires no matter how the request ends.
router.post(
  '/',
  generateLimiter,
  cleanupUpload,
  upload.single('file'),
  validateGenerateInput,
  generateDescription
);

export default router;
