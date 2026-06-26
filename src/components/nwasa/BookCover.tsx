import type { Book } from "@/lib/nwasa-data";

interface Props {
  book: Book;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Procedural minimalist cover. Sans-serif title, gold rule, NWASA seal.
 */
export function BookCover({ book, className = "", size = "md" }: Props) {
  const [bg, gold] = book.palette;
  const titleSize = size === "sm" ? 18 : size === "lg" ? 30 : 22;
  const authorSize = size === "sm" ? 9 : size === "lg" ? 13 : 10;

  // Split title into up to 3 lines for layout
  const words = book.title.split(" ");
  const lines: string[] = [];
  let current = "";
  const max = size === "sm" ? 12 : 16;
  for (const w of words) {
    if ((current + " " + w).trim().length > max && current) {
      lines.push(current.trim());
      current = w;
    } else {
      current = (current + " " + w).trim();
    }
    if (lines.length === 2) break;
  }
  if (current) lines.push(current);

  return (
    <svg
      viewBox="0 0 200 280"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`${book.title} cover`}
    >
      <defs>
        <linearGradient id={`bg-${book.id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bg} />
          <stop offset="100%" stopColor={bg} stopOpacity="0.82" />
        </linearGradient>
        <linearGradient id={`gold-${book.id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={gold} stopOpacity="0.4" />
          <stop offset="100%" stopColor={gold} />
        </linearGradient>
      </defs>
      <rect width="200" height="280" fill={`url(#bg-${book.id})`} />
      {/* Decorative motif */}
      <circle cx="170" cy="40" r="46" fill={gold} opacity="0.10" />
      <circle cx="170" cy="40" r="28" fill={gold} opacity="0.14" />
      {/* Gold rule */}
      <rect x="20" y="110" width="40" height="2" fill={`url(#gold-${book.id})`} />
      {/* Genre */}
      <text
        x="20"
        y="100"
        fill={gold}
        fontFamily="Inter, sans-serif"
        fontSize="8"
        letterSpacing="2"
        fontWeight="600"
      >
        {book.genre.toUpperCase()}
      </text>
      {/* Title */}
      {lines.map((ln, i) => (
        <text
          key={i}
          x="20"
          y={140 + i * (titleSize + 4)}
          fill="#f4efe6"
          fontFamily="Fraunces, Georgia, serif"
          fontSize={titleSize}
          fontWeight="600"
        >
          {ln}
        </text>
      ))}
      {/* Author */}
      <text
        x="20"
        y="240"
        fill="#f4efe6"
        opacity="0.7"
        fontFamily="Inter, sans-serif"
        fontSize={authorSize}
        letterSpacing="1.5"
      >
        {book.author.toUpperCase()}
      </text>
      {/* NWASA monogram */}
      <text
        x="20"
        y="260"
        fill={gold}
        fontFamily="Inter, sans-serif"
        fontSize="8"
        letterSpacing="3"
        fontWeight="700"
      >
        NWASA
      </text>
    </svg>
  );
}
