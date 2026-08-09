import { generateWithAI } from '../services/huggingface.service.js';
import { extractFileContext } from '../services/fileContext.service.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const generateDescription = asyncHandler(async (req, res) => {
  const { message, length, tone, emojiLevel } = req.body;

  const fileContext = await extractFileContext(req.file);

  if (req.file) {
    console.log(`[generate] file: ${req.file.originalname} (${req.file.mimetype}) → context extracted: ${fileContext ? 'yes' : 'no'}`);
  }

  const description = await generateWithAI({
    message,
    fileContext,
    length,
    tone,
    emojiLevel,
  });

  res.json({
    success: true,
    description,
  });
});
