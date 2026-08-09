// Two tiers: a light limit across the whole API (basic abuse protection),
// and a much stricter one specifically on /api/generate, since that's
// the endpoint that costs real money (AI + optional vision calls) and
// is the one worth protecting most carefully once many users are hitting it.
export const RATE_LIMIT_CONFIG = {
  general: {
    windowMs: Number(process.env.RATE_LIMIT_GENERAL_WINDOW_MS) || 15 * 60 * 1000, // 15 min
    max: Number(process.env.RATE_LIMIT_GENERAL_MAX) || 100,
  },
  generate: {
    windowMs: Number(process.env.RATE_LIMIT_GENERATE_WINDOW_MS) || 15 * 60 * 1000, // 15 min
    max: Number(process.env.RATE_LIMIT_GENERATE_MAX) || 10,
  },
};
