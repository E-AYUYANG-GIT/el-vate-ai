import { useEffect, useState } from 'react'

const WORD = 'EL-VATE'
const SUFFIX = '.ai'
const FULL = WORD + SUFFIX
const LETTER_DELAY_MS = 80
const LETTER_ANIM_MS = 450
const HOLD_MS = 700
const EXIT_MS = 400

function IntroScreen({ onComplete }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const totalTypeTime = FULL.length * LETTER_DELAY_MS + LETTER_ANIM_MS
    const exitTimer = setTimeout(() => setExiting(true), totalTypeTime + HOLD_MS)
    const doneTimer = setTimeout(
      () => onComplete(),
      totalTypeTime + HOLD_MS + EXIT_MS
    )
    return () => {
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  // Lets anyone skip the animation instead of being forced to wait.
  const handleSkip = () => {
    setExiting(true)
    setTimeout(onComplete, EXIT_MS)
  }

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-cream)] cursor-pointer transition-opacity duration-[400ms] ${
        exiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl tracking-tight">
        {FULL.split('').map((char, i) => (
          <span
            key={i}
            className={`typetrail-letter ${
              i < WORD.length ? 'text-[var(--color-navy)]' : 'text-[var(--color-gold)]'
            }`}
            style={{ animationDelay: `${i * LETTER_DELAY_MS}ms` }}
          >
            {char}
          </span>
        ))}
        <span
          className="typetrail-cursor inline-block w-[3px] h-[0.9em] bg-[var(--color-gold)] ml-1 align-middle"
          style={{ animationDelay: `${FULL.length * LETTER_DELAY_MS}ms` }}
        />
      </h1>

      <p
        className="typetrail-tagline font-[family-name:var(--font-body)] text-sm text-[var(--color-ink)]/60 mt-4"
        style={{ animationDelay: `${FULL.length * LETTER_DELAY_MS + LETTER_ANIM_MS}ms` }}
      >
        Just simply working with <span className="text-[var(--color-gold)] font-medium">intention</span>.
      </p>

      <style>{`
        @keyframes typetrail-reveal {
          0% { opacity: 0; transform: translateY(8px); filter: blur(4px); }
          60% { opacity: 1; filter: blur(0.5px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes typetrail-blink {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        @keyframes typetrail-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .typetrail-letter {
          display: inline-block;
          opacity: 0;
          animation: typetrail-reveal ${LETTER_ANIM_MS}ms ease-out forwards;
        }
        .typetrail-cursor {
          opacity: 0;
          animation: typetrail-blink 0.9s step-end 3;
        }
        .typetrail-tagline {
          opacity: 0;
          animation: typetrail-fade-in 500ms ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default IntroScreen