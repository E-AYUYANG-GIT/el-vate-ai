import { Paperclip, X, Sparkles } from 'lucide-react'

const MAX_CHARS = 1500

const PLACEHOLDER = `Please type a message you want to share, or emotions you want to show, or level of comprehension or grammar. So that I can comprehend what you want to share.

Example:
A small win to be able to finish DataCamp course learning and earn certificate. Use simple emojis not too much, and a humble way to share experience.`

function InputPanel({
  message,
  setMessage,
  file,
  setFile,
  onGenerate,
  isGenerating,
  validationError,
}) {
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (selected) setFile(selected)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="font-[family-name:var(--font-heading)] text-lg text-[var(--color-navy)] mb-2">
          What do you want to share?
        </h2>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
          placeholder={PLACEHOLDER}
          rows={9}
          className="w-full resize-none rounded-lg border border-[var(--color-ink)]/15 bg-white px-4 py-3 text-sm leading-relaxed text-[var(--color-ink)] placeholder:text-[var(--color-ink)]/40 focus:border-[var(--color-navy)]"
        />

        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-[var(--color-ink)]/50">
            {message.length} / {MAX_CHARS}
          </span>
        </div>

        {validationError && (
          <div className="mt-2 rounded-lg bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/30 px-4 py-3 text-sm text-[var(--color-ink)]">
            <p className="font-medium mb-1">{validationError.title}</p>
            <ul className="list-disc list-inside text-[var(--color-ink)]/70 space-y-0.5">
              {validationError.hints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        {!file ? (
          <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-[var(--color-ink)]/25 bg-white px-4 py-3 text-sm text-[var(--color-ink)]/70 hover:border-[var(--color-navy)]/50 transition-colors">
            <Paperclip size={16} className="text-[var(--color-navy)]" />
            <span>Add a photo or file (optional)</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.pdf,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex items-center justify-between rounded-lg border border-[var(--color-navy)]/20 bg-white px-4 py-3 text-sm">
            <span className="truncate text-[var(--color-ink)]/80">{file.name}</span>
            <button
              onClick={() => setFile(null)}
              aria-label="Remove file"
              className="text-[var(--color-ink)]/50 hover:text-[var(--color-ink)] cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <p className="text-xs text-[var(--color-ink)]/40 mt-1.5">
          Certificate, screenshot, achievement, event photo, course completion, document, project screenshot
        </p>
      </div>

      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="flex items-center justify-center gap-2 rounded-lg bg-[var(--color-navy)] px-6 py-3 text-sm font-medium text-[var(--color-cream)] hover:bg-[var(--color-navy)]/90 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <Sparkles size={16} />
        {isGenerating ? 'Elevating...' : 'Generate'}
      </button>
    </div>
  )
}

export default InputPanel
