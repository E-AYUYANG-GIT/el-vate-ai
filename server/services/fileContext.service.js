import fs from 'fs/promises';
import { PDFParse } from 'pdf-parse';
import { describeImage } from './vision.service.js';

const IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_TEXT_CONTEXT_CHARS = 2000;

// Turns an uploaded file into a short piece of context text to fold into
// the AI prompt. Always resolves to a string or null — never throws —
// because a file problem should never block generating from the
// message alone (Section 48: "supplement, not replace").
export async function extractFileContext(file) {
  if (!file) return null;

  if (IMAGE_TYPES.includes(file.mimetype)) {
    return describeImage(file.path, file.mimetype);
  }

  if (file.mimetype === 'text/plain') {
    try {
      const content = await fs.readFile(file.path, 'utf-8');
      return content.slice(0, MAX_TEXT_CONTEXT_CHARS);
    } catch (err) {
      console.error('Failed to read text file:', err.message);
      return null;
    }
  }

  if (file.mimetype === 'application/pdf') {
    try {
      const buffer = await fs.readFile(file.path);
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      await parser.destroy();
      // pdf-parse inserts "-- N of M --" page separators even for pages
      // with no real text (e.g. scanned images) — strip those before
      // deciding whether there's anything worth using.
      const text = result.text
        .replace(/--\s*\d+\s*of\s*\d+\s*--/g, '')
        .trim();
      return text ? text.slice(0, MAX_TEXT_CONTEXT_CHARS) : null;
    } catch (err) {
      console.error('Failed to parse PDF:', err.message);
      return null;
    }
  }

  return null;
}
