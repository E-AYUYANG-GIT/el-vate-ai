import { AppError } from './AppError.js';

export const MAX_MESSAGE_LENGTH = 1500;

// Words with no real content on their own — even padded out
// ("test test test") they still don't describe anything worth
// writing a post about. Checked against the full trimmed message.
const PLACEHOLDER_WORDS = new Set([
  'test',
  'testing',
  'tests',
  'sample',
  'asdf',
  'asd',
  'lorem',
  'lorem ipsum',
  'hello world',
  'hello',
  'placeholder',
  'example',
  'n/a',
  'na',
  'idk',
  'none',
]);

// Minimum number of real words (letters only — emojis, punctuation,
// and symbols don't count) needed before there's enough context to
// write an honest post from. Prevents inputs like "Test" or "🌟"
// from reaching the AI (and getting billed) with nothing to say.
const MIN_REAL_WORDS = 5;

function countRealWords(message) {
  const wordsOnly = message
    .replace(/[^\p{L}\p{N}\s]/gu, ' ') // strip emojis/punctuation/symbols
    .trim();

  if (!wordsOnly) return 0;

  return wordsOnly.split(/\s+/).filter(Boolean).length;
}

function isPlaceholder(message) {
  const normalized = message.trim().toLowerCase();

  if (PLACEHOLDER_WORDS.has(normalized)) return true;

  // Catch padded placeholders like "test test test test" — every
  // distinct word in the message is itself a placeholder word.
  const words = normalized.split(/\s+/).filter(Boolean);
  return words.length > 0 && words.every((w) => PLACEHOLDER_WORDS.has(w));
}

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

  if (isPlaceholder(message) || countRealWords(message) < MIN_REAL_WORDS) {
    throw new AppError(
      'INSUFFICIENT_CONTEXT',
      "That's not quite enough to work with yet. Tell us a bit more about what happened — what you did, learned, or accomplished."
    );
  }

  next();
}