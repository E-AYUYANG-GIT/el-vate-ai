import { Copy, RefreshCw, Check } from 'lucide-react'

function OutputPanel({ output, isGenerating, onRegenerate, copied, onCopy }) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="font-[family-name:var(--font-heading)] text-lg text-[var(--color-navy)] mb-2">
        Your description
      </h2>

      <div className="flex-1 rounded-lg bg-white border border-[var(--color-ink)]/10 p-5 min-h-[220px] flex items-center">
        {isGenerating ? (
          <p className="text-sm text-[var(--color-ink)]/50 font-[family-name:var(--font-body)]">
            Elevating...
          </p>
        ) : output ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-[var(--color-ink)]">
            {output}
          </p>
        ) : (
          <p className="text-sm text-[var(--color-ink)]/40">
            Your generated description will show up here. Write something on the left and hit
            Generate.
          </p>
        )}
      </div>

      {output && !isGenerating && (
        <div className="flex gap-2 mt-4">
          <button
            onClick={onCopy}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-ink)]/15 bg-white px-4 py-2 text-sm text-[var(--color-ink)] hover:border-[var(--color-navy)]/40 cursor-pointer transition-colors"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={onRegenerate}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-ink)]/15 bg-white px-4 py-2 text-sm text-[var(--color-ink)] hover:border-[var(--color-navy)]/40 cursor-pointer transition-colors"
          >
            <RefreshCw size={15} />
            Regenerate
          </button>
        </div>
      )}
    </div>
  )
}

export default OutputPanel
