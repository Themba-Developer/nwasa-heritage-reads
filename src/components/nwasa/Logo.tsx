export function Logo({ size = 40, light = false }: { size?: number; light?: boolean }) {
  const fg = light ? "#f4efe6" : "var(--charcoal)";
  return (
    <div className="inline-flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
        <rect x="2" y="2" width="44" height="44" rx="10" fill="var(--charcoal)" />
        <path
          d="M14 34 V14 L24 28 V14 M28 14 L34 34 M28 28 H34"
          stroke="var(--gold)"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="leading-none">
        <div
          className="text-display text-[15px] font-bold tracking-tight"
          style={{ color: fg }}
        >
          NWASA
        </div>
        <div
          className="text-[9px] tracking-[0.18em] font-semibold mt-0.5"
          style={{ color: light ? "rgba(244,239,230,0.6)" : "var(--muted-foreground)" }}
        >
          NATIONAL WRITERS · SA
        </div>
      </div>
    </div>
  );
}
