export default function TagChips({ tags, active = null, onChange }) {
  const items = [{ slug: null, label: "All" }, ...tags];

  return (
    <div
      role="group"
      aria-label="Filter by tag"
      className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [mask-image:linear-gradient(to_right,black_85%,transparent)] md:mx-0 md:px-0 md:[mask-image:none] md:flex-wrap"
    >
      {items.map(({ slug, label }) => {
        const isActive = slug === active;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange?.(slug)}
            className={`relative shrink-0 rounded-sm border border-primary-blue px-3 py-1.5 text-xs font-semibold uppercase motion-safe:transition-transform active:scale-96 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue ${
              isActive ? "text-primary-white" : "text-primary-blue hover:bg-primary-blue/10"
            }`}
          >
            {isActive && (
              <span
                aria-hidden
                data-chip-indicator
                data-flip-id="chip-indicator"
                className="absolute inset-0 bg-primary-blue"
              />
            )}
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
