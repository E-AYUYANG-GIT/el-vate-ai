import fs from 'fs/promises';
import { AI_CONFIG } from '../config/aiConfig.js';

const VISION_PROMPT =
  'Look at this image carefully. If it contains visible text — like a course title, ' +
  'certificate name, event name, or achievement — read it and include the specific ' +
  'title or name in your answer. Respond in one short phrase (under 15 words), for example: ' +
  '"DataCamp certificate for the course \'Working with Hugging Face\'" or ' +
  '"screenshot of a GitHub pull request titled \'Fix login bug\'". ' +
  'Only state text you can actually read in the image — never guess or invent a title, ' +
  'date, or name that is not visibly present. If there is no readable text, describe ' +
  'generally what the image shows instead.';

// Best-effort: returns a short description of the image, or null if
// anything goes wrong. Vision is a *supplement* to the user's message,
// never a requirement — so failures here should never break generation.
export async function describeImage(filePath, mimeType) {
  try {
    const buffer = await fs.readFile(filePath);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_CONFIG.requestTimeoutMs);

    let response;
    try {
      response = await fetch(`${AI_CONFIG.hfBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AI_CONFIG.hfApiKey}`,
        },
        body: JSON.stringify({
          model: AI_CONFIG.visionModel,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: VISION_PROMPT },
                { type: 'image_url', image_url: { url: dataUrl } },
              ],
            },
          ],
          max_tokens: 60,
          temperature: 0.3,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error('Vision API error:', response.status, errorBody);
      return null;
    }

    const data = await response.json();
    const description = data?.choices?.[0]?.message?.content?.trim();
    return description || null;
  } catch (err) {
    console.error('Vision processing failed:', err.message);
    return null;
  }
}
