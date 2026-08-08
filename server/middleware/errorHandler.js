import multer from 'multer';
import { AppError } from './AppError.js';
import { UPLOAD_CONFIG } from '../config/uploadConfig.js';

// One shape for every error response, everywhere in the app:
// { success: false, error: "CODE", message: "human-readable text" }
//
// Route handlers should throw AppError for expected problems (bad input,
// rate limit, etc). Anything else that reaches here is unexpected, so we
// log it server-side and never leak its details to the client.
export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      error: err.code,
      message: err.message,
    });
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const maxMb = UPLOAD_CONFIG.maxFileSizeBytes / (1024 * 1024);
      return res.status(400).json({
        success: false,
        error: 'FILE_TOO_LARGE',
        message: `That file is too big. Please keep it under ${maxMb}MB.`,
      });
    }
    return res.status(400).json({
      success: false,
      error: 'UPLOAD_ERROR',
      message: 'There was a problem with your file upload. Please try again.',
    });
  }

  console.error('Unexpected error:', err);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_ERROR',
    message: 'Something went wrong on our end. Please try again in a moment.',
  });
}

// Catches errors thrown inside async route handlers and forwards them to
// errorHandler, so we don't need try/catch in every controller.
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
