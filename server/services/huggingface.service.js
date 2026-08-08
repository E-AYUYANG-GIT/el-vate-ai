import { AI_CONFIG } from '../config/aiConfig.js';
import { AppError } from '../middleware/AppError.js';
import { buildMessages } from './promptBuilder.service.js';

export async function generateWithAI({ message, fileContext, length, tone, emojiLevel }) {
  if (!AI_CONFIG.hfApiKey) {
    throw new AppError(
      'AI_CONFIG_ERROR',
      'The AI service is not configured yet. Missing HF_API_KEY.',
      500
    );
  }

  const messages = buildMessages({ message, fileContext, length, tone, emojiLevel });

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
        model: AI_CONFIG.textModel,
        messages,
        max_tokens: 400,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new AppError(
        'AI_TIMEOUT',
        "The AI is taking too long to respond. Please try again in a moment.",
        504
      );
    }
    throw new AppError(
      'AI_UNREACHABLE',
      "Couldn't reach the AI service. Please try again in a moment.",
      502
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    console.error('Hugging Face API error:', response.status, errorBody);

    if (response.status === 401 || response.status === 403) {
      throw new AppError(
        'AI_CONFIG_ERROR',
        'The AI service rejected the request. Please check the server configuration.',
        500
      );
    }
    if (response.status === 404) {
      throw new AppError(
        'AI_MODEL_UNAVAILABLE',
        'The AI model is currently unavailable. Please try again later.',
        502
      );
    }
    if (response.status === 429) {
      throw new AppError(
        'AI_RATE_LIMIT',
        "We're getting a lot of requests right now. Please wait a moment and try again.",
        429
      );
    }
    throw new AppError(
      'AI_ERROR',
      'The AI service had a problem generating your description. Please try again.',
      502
    );
  }

  const data = await response.json();
  const description = data?.choices?.[0]?.message?.content?.trim();

  if (!description) {
    console.error('Hugging Face API returned no content:', JSON.stringify(data));
    throw new AppError(
      'AI_ERROR',
      'The AI did not return a usable response. Please try again.',
      502
    );
  }

  return description;
}
