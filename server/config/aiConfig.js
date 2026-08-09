// Keeps model selection out of the code that calls it, so swapping
// models later is a config change, not a rewrite (Section 9).
export const AI_CONFIG = {
  textModel: process.env.HF_TEXT_MODEL || 'Qwen/Qwen2.5-7B-Instruct',
  visionModel: process.env.HF_VISION_MODEL || 'Qwen/Qwen3-VL-8B-Instruct:featherless-ai',
  hfApiKey: process.env.HF_API_KEY,
  hfBaseUrl: 'https://router.huggingface.co/v1',
  requestTimeoutMs: 30000,
};
