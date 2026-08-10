# EL-VATE.ai

AI-powered social media description writer. Built phase by phase — see the blueprint doc for the full plan.

## Status: Phase 6 done and confirmed working on real files

Uploaded files are read and folded into the AI prompt as supporting context. Tested live (by you, on your machine) with a real DataCamp certificate, both as PNG and PDF — both correctly pulled out the actual course title ("Working with Hugging Face") and used it in the generated post.

**How each file type is handled:**
- **Images (PNG/JPG/WEBP)** → sent to `Qwen/Qwen3-VL-8B-Instruct:featherless-ai`, which reads visible text in the image (not just categorizes it) and returns a short description
- **TXT** → read directly
- **PDF** → text extracted with `pdf-parse`

**Model note:** both the vision model and earlier the text model (Phase 4) needed the exact model:provider format to work — auto-routing without a provider suffix kept failing with `model_not_supported`, even with all providers enabled in the HF account. Confirmed working values are in `.env`.

**Prompt tuning that came out of live testing** (not just plumbing bugs — actual output-quality issues, fixed by rewriting `SYSTEM_PROMPT` in `promptBuilder.service.js`):
- Vision model was initially too vague ("a certificate") instead of reading the actual course title — fixed by rewriting the vision prompt to explicitly ask it to extract visible text
- Generated posts were including administrative clutter from the file — the recipient's own name, certificate ID numbers, and worse, fabricated `@mentions` for the issuer's CEO that don't correspond to any real account — fixed with explicit exclusion rules and a concrete example
- Length control ("make it long") wasn't working because there's no length selector in the UI yet — the request was buried inside the free-text message, and the model had no rule connecting that kind of embedded request to actual word-count targets. Fixed by adding research-based Short/Medium/Long tiers (grounded in LinkedIn/Instagram/Facebook engagement data) and explicitly telling the model to treat length requests found in the message as formatting instructions

**Known gap:** there's still no dedicated UI control for length/tone — it only works if the user phrases a request in their message and the model correctly interprets it. That's more fragile than a real dropdown. Worth adding to the UI in a future phase rather than continuing to rely on prompt-level interpretation.

### What's new this phase
- `server/services/vision.service.js` — describes an uploaded image via the vision model
- `server/services/fileContext.service.js` — routes each file type to the right handling, never throws
- `server/controllers/generate.controller.js` — extracts file context before calling the AI
- `server/services/promptBuilder.service.js` — significantly reworked system prompt based on real output testing (length tiers, detail-selectivity rules, no-fake-mentions rule)
- `pdf-parse` added as a dependency

## Run it

**Client**
```
cd client
npm install
npm run dev
```
Opens at http://localhost:5173

**Server**
```
cd server
npm install
cp .env.example .env   # already done for you, but if you clone fresh, do this
npm run dev
```
Runs at http://localhost:5000 — check http://localhost:5000/api/health, should return `{"success":true,"status":"ok"}`

## Structure

```
client/     React + Vite + Tailwind + Lucide
server/     Express, organized as controllers/routes/services/middleware/config
```

## Next: Phase 10 (or MVP complete — check blueprint's completion checklist)

---

## Status: Phase 9 done — Production cleanup + deployment prep

Went through the blueprint's cleanup checklist:

| Item | Status |
|---|---|
| Remove console logs | Removed one leftover debug log from Phase 6 troubleshooting. Kept `console.error()` calls — those are intentional production error logging, not debug noise, and Render's dashboard reads them as your logs. |
| Check environment variables | All present and consistent between `.env` and `.env.example`, both client and server |
| Check CORS | Already env-driven via `CLIENT_URL`, defaults to localhost for dev — just needs the real Vercel URL set in Render once deployed |
| Validate upload security | Re-confirmed: saved filenames are `randomUUID + extension` only — the original (attacker-controlled) filename never touches the actual file path, so path traversal isn't possible |
| Check rate limits | Already tested in Phase 7 |
| Check API errors | Consistent `{success, error, message}` shape throughout, confirmed again with a fresh smoke test |
| Check mobile/desktop layout | **Not verified this phase** — I don't have a browser here. Please give both a look before considering this fully done |
| Check empty state | Handled since Phase 2 ("Your generated description will show up here...") |
| Check AI failure state | Errors surface in the UI via the existing validation-error box |

### Is it ready for Vercel?

**Partially — and this is exactly why:** the blueprint itself specifies **frontend → Vercel, backend → Render**, not both on Vercel. That's not a style preference, it's a real technical constraint:

- Vercel's backend hosting is serverless — functions spin up per-request and don't persist memory between calls
- Our rate limiter (Phase 7) keeps its counts in memory. On Vercel, each function instance would have its own separate count, so someone could bypass the limit just by hitting different instances — the limiter would basically stop working
- Our file uploads (Phase 5) get written to local disk temporarily. Serverless functions don't reliably guarantee that disk access, so uploads could fail or behave inconsistently

None of that applies to the **frontend** — it's a static Vite build, which is exactly what Vercel is built for.

### How to actually deploy

**Frontend → Vercel:**
1. Push this repo to GitHub
2. In Vercel, import the repo, set **Root Directory** to `client`
3. Add environment variable `VITE_API_URL` = your Render backend's URL (you'll get this in step 2 below) — Vite bakes this in at build time, so set it before deploying
4. Deploy — Vercel auto-detects Vite and handles the build

**Backend → Render:**
1. In Render, create a new **Web Service**, connect the same repo, set **Root Directory** to `server`
2. Build command: `npm install` — Start command: `npm start`
3. Add environment variables: `HF_API_KEY`, `HF_TEXT_MODEL`, `HF_VISION_MODEL`, and `CLIENT_URL` (set this to your Vercel URL from step above)
4. Deploy

**Then go back and update `VITE_API_URL` in Vercel** to point at your actual Render URL once you have it, and redeploy the frontend so the build picks up the change (env var changes need a rebuild in Vite, they're not read at runtime).

Note: Render's free tier spins down after inactivity and takes a few seconds to wake up on the first request — expected behavior, not a bug, if the first generate after a while feels slow.

### What's new this phase
- Removed leftover debug logging from `generate.controller.js`
- Added `engines: { node: ">=18.0.0" }` to `server/package.json` for deployment consistency
- Deployment steps above (no blueprint conflict — this matches what the blueprint's Gap 4 already decided)

---

## Status: Phase 8 done

UX polish pass against the blueprint's 8-item checklist:

| Item | What changed |
|---|---|
| Loading animation | Was static "Elevating..." text — now has a subtle 3-dot bounce animation |
| Copy confirmation | Already done in Phase 2 (checkmark + "Copied" for 1.8s) |
| Error states | Added `role="alert"` for accessibility; empty hint lists no longer render an empty bullet list |
| Upload preview | Was filename-only — now shows an actual thumbnail for images, a file icon for PDF/TXT |
| Character count | Already done in Phase 2 |
| Disabled states | Was Generate-button-only — now the textarea, file upload, and remove-file button are all disabled while a request is in flight, so you can't edit something that's already being submitted |
| Responsive spacing | Already responsive since Phase 2 (unchanged) |
| Keyboard navigation | Added Ctrl+Enter (Cmd+Enter on Mac) to submit from the textarea, and `aria-live="polite"` on the output panel so screen readers announce new results automatically |

**Verified:** build compiles clean, and I confirmed the animation utility classes (`animate-bounce`, `animate-pulse`) actually compiled into the output CSS rather than just assuming the class names were right.

**Not verified:** actual visual appearance and feel — I don't have a browser in this environment to see it render. Worth a quick look on your end, especially the thumbnail preview and the bounce animation timing (per the blueprint's "keep animations subtle" — let me know if it feels like too much or too little).

### What's new this phase
- `client/src/components/InputPanel.jsx` — thumbnail preview (image files) / file icon (PDF/TXT), disabled states during generation, Ctrl+Enter submit
- `client/src/components/OutputPanel.jsx` — animated loading state, `aria-live` region

---

## Status: Phase 7 done and tested

Rate limiting via `express-rate-limit`, two tiers:
- **General** — 100 requests/15min per IP, applies to the whole API (basic abuse protection)
- **Generate** — 10 requests/15min per IP, applies only to `/api/generate` (the expensive one — AI + optional vision calls)

The stricter limiter runs *before* file upload handling, so a blocked request never wastes time saving a temp file it's about to reject anyway.

**Tested locally (no network needed — rate limiting happens before any AI call):**
- Set the generate limit to 3 temporarily, confirmed requests 1-3 pass through (to the AI stage) and requests 4+ get a clean `429 RATE_LIMIT_EXCEEDED`
- Confirmed `RateLimit-*` headers are present on responses
- Confirmed `/api/health` and `/api/generate` have independent limits — hammering one doesn't affect the other
- Confirmed the general limiter works independently by testing it in isolation

### What's new this phase
- `server/config/rateLimitConfig.js` — limits, tunable via env vars with sensible defaults
- `server/middleware/rateLimit.middleware.js` — the two limiters, using the same `{success, error, message}` error shape as the rest of the app
- Also fixed a stale reference in `.env.example` — it still listed the non-working `google/gemma-2-2b-it` from before Phase 4's model swap
