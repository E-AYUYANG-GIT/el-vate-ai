import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const UPLOAD_CONFIG = {
  // Temp storage — files get deleted right after each request finishes.
  uploadDir: path.join(__dirname, '..', 'uploads', 'tmp'),
  maxFileSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: [
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/pdf',
    'text/plain',
  ],
};
