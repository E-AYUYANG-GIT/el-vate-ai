import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import multer from 'multer';
import { UPLOAD_CONFIG } from '../config/uploadConfig.js';
import { AppError } from './AppError.js';

// Make sure the temp folder exists before multer tries to write into it.
fs.mkdirSync(UPLOAD_CONFIG.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_CONFIG.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${crypto.randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

function fileFilter(req, file, cb) {
  if (!UPLOAD_CONFIG.allowedMimeTypes.includes(file.mimetype)) {
    cb(
      new AppError(
        'UNSUPPORTED_FILE_TYPE',
        'That file type is not supported. Please upload a PNG, JPG, WEBP, PDF, or TXT file.'
      )
    );
    return;
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: UPLOAD_CONFIG.maxFileSizeBytes },
});

// Deletes the uploaded temp file once the response has been sent,
// whether the request succeeded or failed. Registered before the route
// handler so it's guaranteed to run regardless of what happens later.
export function cleanupUpload(req, res, next) {
  res.on('finish', () => {
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Failed to delete temp upload:', req.file.path, err.message);
      });
    }
  });
  next();
}
