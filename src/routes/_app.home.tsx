import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useNwasa } from "@/lib/nwasa-store";
import { BookCover } from "@/components/nwasa/BookCover";
import { PremiumBanner } from "@/components/nwasa/PremiumBanner";
import { UpsellModal } from "@/components/nwasa/UpsellModal";
import { Logo } from "@/components/nwasa/Logo";
import { Flame, Clock, Sparkles, ArrowRight, Lock } from "lucide-react";

export const Route = createFileRoute("/_app/home")({
  component: HomePage,
});

function HomePage() {
  const { user, books } = useNwasa();
  const navigate = useNavigate();
  const [lockedTitle, setLockedTitle] = useState<string | null>(null);

  const bookOfTheDay = useMemo(() => {
    const idx = new Date().getDate() % books.length;
    return books[idx];
  }, [books]);

  const lastBook = books.find((b) => b.id === user?.lastReadBookId);

  const openBook = (b: typeof books[number]) => {
    if (b.tier === "premium" && user?.tier !== "premium") {
      setLockedTitle(b.title);
      return;
    }
    navigate({ to: "/reader/$bookId", params: { bookId: b.id } });
  };

  return (
    <div>
      <header className="px-5 pt-6 pb-3 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1.5">
          <Flame className="size-3.5" style={{ color: "var(--gold-foreground)" }} />
          <span className="text-xs font-semibold" style={{ color: "var(--charcoal)" }}>
            {user?.streak ?? 1}-day streak
          </span>
        </div>
      </header>

      <section className="px-5 pt-2">
        <div className="text-[11px] tracking-[0.24em] uppercase font-semibold text-muted-foreground">
          Good {greeting()}, {user?.name?.split(" ")[0] ?? "Reader"}
        </div>
        <h1 className="text-display text-2xl font-semibold mt-1">
          Today's reading
        </h1>
      </section>

      {/* Book of the day */}
      <section className="px-5 mt-4">
        <button
          onClick={() => openBook(bookOfTheDay)}
          className="w-full text-left rounded-3xl bg-card border border-border shadow-card-soft overflow-hidden grid grid-cols-[110px_1fr]"
        >
          <div className="bg-secondary">
            <BookCover book={bookOfTheDay} className="w-full h-full" />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: "var(--gold-foreground)" }}>
              <Sparkles className="size-3" style={{ color: "var(--gold)" }} />
              Book of the Day
            </div>
            <div className="text-display text-lg font-semibold mt-1.5 leading-tight">
              {bookOfTheDay.title}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {bookOfTheDay.author}
            </div>
            <p className="text-xs text-foreground/75 mt-2 line-clamp-2">{bookOfTheDay.synopsis}</p>
            <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold" style={{ color: "var(--charcoal)" }}>
              {bookOfTheDay.tier === "premium" && user?.tier !== "premium" ? (
                <><Lock className="size-3" /> Premium</>
              ) : (
                <>Start reading <ArrowRight className="size-3" /></>
              )}
            </span>
          </div>
        </button>
      </section>

      {/* Continue reading */}
      {lastBook && (
        <section className="px-5 mt-5">
          <SectionHeader title="Continue reading" />
          <button
            onClick={() => openBook(lastBook)}
            className="w-full text-left rounded-2xl bg-card border border-border p-3 flex items-center gap-3"
          >
            <div className="w-14 h-20 rounded-md overflow-hidden bg-secondary shrink-0">
              <BookCover book={lastBook} size="sm" className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{lastBook.title}</div>
              <div className="text-xs text-muted-foreground truncate">{lastBook.author}</div>
              <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-gold-gradient"
                  style={{ width: `${Math.round((user?.lastReadProgress ?? 0) * 100)}%` }}
                />
              </div>
              <div className="mt-1 text-[10px] text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" /> {Math.round((user?.lastReadProgress ?? 0) * 100)}% complete
              </div>
            </div>
          </button>
        </section>
      )}

      {/* Premium banner */}
      <section className="px-5 mt-6">
        <PremiumBanner />
      </section>

      {/* Recommended */}
      <section className="mt-6">
        <div className="px-5">
          <SectionHeader title="Recommended for you" subtitle="From the NWASA collection" />
        </div>
        <div className="overflow-x-auto hide-scrollbar">
          <div className="flex gap-3 px-5 pb-2">
            {books.slice(0, 8).map((b) => (
              <button
                key={b.id}
                onClick={() => openBook(b)}
                className="w-36 shrink-0 text-left"
              >
                <div className="relative rounded-xl overflow-hidden shadow-card-soft aspect-[5/7] bg-secondary">
                  <BookCover book={b} className="w-full h-full" />
                  {b.tier === "premium" && user?.tier !== "premium" && (
                    <div className="absolute top-2 right-2 size-6 rounded-full bg-charcoal/70 backdrop-blur grid place-items-center" style={{ background: "color-mix(in oklab, var(--charcoal) 70%, transparent)" }}>
                      <Lock className="size-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="mt-2 text-xs font-semibold leading-tight line-clamp-2">{b.title}</div>
                <div className="text-[11px] text-muted-foreground truncate">{b.author}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 mt-6">
        <SectionHeader title="Reading stats" />
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Streak" value={`${user?.streak ?? 1}`} suffix="days" />
          <Stat label="Minutes" value={`${user?.minutesRead ?? 0}`} suffix="read" />
          <Stat label="Books" value={`${user?.booksFinished ?? 0}`} suffix="done" />
        </div>
      </section>

      <UpsellModal open={!!lockedTitle} onClose={() => setLockedTitle(null)} bookTitle={lockedTitle ?? undefined} />
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <div className="text-display text-base font-semibold">{title}</div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
    </div>
  );
}

function Stat({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-3">
      <div className="text-[10px] tracking-[0.16em] uppercase font-semibold text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-display text-2xl font-semibold">{value}</span>
        <span className="text-[10px] text-muted-foreground">{suffix}</span>
      </div>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
