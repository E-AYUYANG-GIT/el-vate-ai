import { AppError } from './AppError.js';

export const MAX_MESSAGE_LENGTH = 1500;

export function validateGenerateInput(req, res, next) {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    throw new AppError(
      'VALIDATION_ERROR',
      'Please type something you want to share first.'
    );
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    throw new AppError(
      'MESSAGE_TOO_LONG',
      `Your message is a bit long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`
    );
  }

  next();
}
