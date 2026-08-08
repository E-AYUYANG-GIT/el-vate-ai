import { Router } from 'express';
import { generateDescription } from '../controllers/generate.controller.js';
import { validateGenerateInput } from '../middleware/validateGenerateInput.js';
import { upload, cleanupUpload } from '../middleware/upload.middleware.js';

const router = Router();

// Order matters: multer parses the multipart body (populating req.body
// and req.file) before validation runs, and cleanup is registered before
// the handler so it fires no matter how the request ends.
router.post(
  '/',
  cleanupUpload,
  upload.single('file'),
  validateGenerateInput,
  generateDescription
);

export default router;
