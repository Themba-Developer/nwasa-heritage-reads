import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useNwasa } from "@/lib/nwasa-store";
import { BookCover } from "@/components/nwasa/BookCover";
import { UpsellModal } from "@/components/nwasa/UpsellModal";
import { Search, Lock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/library")({
  component: LibraryPage,
});

type Filter = "all" | "free" | "premium";

function LibraryPage() {
  const { books, user } = useNwasa();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [lockedTitle, setLockedTitle] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return books.filter((b) => {
      if (filter !== "all" && b.tier !== filter) return false;
      if (query && !`${b.title} ${b.author} ${b.genre}`.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [books, filter, query]);

  const open = (b: typeof books[number]) => {
    if (b.tier === "premium" && user?.tier !== "premium") {
      setLockedTitle(b.title);
      return;
    }
    navigate({ to: "/reader/$bookId", params: { bookId: b.id } });
  };

  return (
    <div>
      <header className="px-5 pt-8 pb-2">
        <div className="text-[11px] tracking-[0.24em] uppercase font-semibold text-muted-foreground">
          Library
        </div>
        <h1 className="text-display text-3xl font-semibold mt-1">The Collection</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {books.length} titles · curated by NWASA editors
        </p>
      </header>

      <div className="px-5 mt-4">
        <div className="flex items-center gap-2 rounded-xl border border-input bg-card px-3.5 py-2.5">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, author or genre"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
          />
        </div>
      </div>

      <div className="px-5 mt-4 flex gap-2">
        {(
          [
            { k: "all", label: "All" },
            { k: "free", label: "Free Tier" },
            { k: "premium", label: "Premium" },
          ] as { k: Filter; label: string }[]
        ).map(({ k, label }) => {
          const active = filter === k;
          return (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition border"
              style={{
                background: active ? "var(--charcoal)" : "var(--card)",
                color: active ? "white" : "var(--foreground)",
                borderColor: active ? "var(--charcoal)" : "var(--border)",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="px-5 mt-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <button key={b.id} onClick={() => open(b)} className="text-left group">
            <div className="relative rounded-xl overflow-hidden shadow-card-soft aspect-[5/7] bg-secondary">
              <BookCover book={b} className="w-full h-full transition group-hover:scale-[1.02]" />
              {b.tier === "premium" && user?.tier !== "premium" ? (
                <div
                  className="absolute top-2 right-2 size-7 rounded-full backdrop-blur grid place-items-center"
                  style={{ background: "color-mix(in oklab, var(--charcoal) 70%, transparent)" }}
                >
                  <Lock className="size-3.5 text-white" />
                </div>
              ) : (
                b.tier === "free" && (
                  <div
                    className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase"
                    style={{ background: "var(--gold)", color: "var(--charcoal)" }}
                  >
                    Free
                  </div>
                )
              )}
              {b.custom && (
                <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-card/90 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">
                  <Sparkles className="size-2.5" style={{ color: "var(--gold)" }} /> New
                </div>
              )}
            </div>
            <div className="mt-2 text-sm font-semibold leading-tight line-clamp-2">{b.title}</div>
            <div className="text-[11px] text-muted-foreground truncate">{b.author}</div>
            <div className="text-[10px] tracking-widest uppercase text-muted-foreground mt-0.5">
              {b.genre}
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-muted-foreground">
          No books match your search.
        </div>
      )}

      <UpsellModal
        open={!!lockedTitle}
        onClose={() => setLockedTitle(null)}
        bookTitle={lockedTitle ?? undefined}
      />
    </div>
  );
}
