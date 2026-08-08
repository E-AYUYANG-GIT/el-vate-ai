function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-5 md:px-10">
      <h1 className="font-[family-name:var(--font-heading)] text-2xl tracking-tight text-[var(--color-navy)]">
        EL-VATE<span className="text-[var(--color-gold)]">.ai</span>
      </h1>
      <span className="font-[family-name:var(--font-body)] text-sm text-[var(--color-ink)]/60">
        Simple. Humble. Honest.
      </span>
    </header>
  )
}

export default Header
