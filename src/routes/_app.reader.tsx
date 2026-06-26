import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useNwasa } from "@/lib/nwasa-store";
import { BookCover } from "@/components/nwasa/BookCover";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_app/reader")({
  component: ReaderHub,
});

function ReaderHub() {
  const { books, user } = useNwasa();
  const navigate = useNavigate();
  const lastBook = books.find((b) => b.id === user?.lastReadBookId);
  const accessible = books.filter((b) => b.tier === "free" || user?.tier === "premium");

  return (
    <div>
      <header className="px-5 pt-8 pb-2">
        <div className="text-[11px] tracking-[0.24em] uppercase font-semibold text-muted-foreground">
          Reader
        </div>
        <h1 className="text-display text-3xl font-semibold mt-1">Your reading desk</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pick up where you left off, or open a title from your shelf.
        </p>
      </header>

      {lastBook ? (
        <section className="px-5 mt-5">
          <button
            onClick={() => navigate({ to: "/reader/$bookId", params: { bookId: lastBook.id } })}
            className="w-full text-left rounded-3xl bg-charcoal-gradient text-white p-5 shadow-elegant flex gap-4 items-stretch overflow-hidden relative"
          >
            <div className="w-24 rounded-xl overflow-hidden shrink-0 shadow-elegant">
              <BookCover book={lastBook} className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="text-[10px] tracking-[0.2em] uppercase font-semibold text-white/60">
                Continue reading
              </div>
              <div className="text-display text-lg font-semibold mt-1 leading-tight truncate">
                {lastBook.title}
              </div>
              <div className="text-xs text-white/60">{lastBook.author}</div>
              <div className="mt-auto pt-3">
                <div className="h-1 rounded-full bg-white/15 overflow-hidden">
                  <div
                    className="h-full bg-gold-gradient"
                    style={{ width: `${Math.round((user?.lastReadProgress ?? 0) * 100)}%` }}
                  />
                </div>
                <div className="mt-1.5 flex items-center gap-1 text-[10px] text-white/60">
                  <Clock className="size-3" />
                  {Math.round((user?.lastReadProgress ?? 0) * 100)}% complete
                  <ArrowRight className="size-3 ml-auto" />
                </div>
              </div>
            </div>
          </button>
        </section>
      ) : (
        <section className="px-5 mt-5">
          <div className="rounded-3xl border border-dashed border-border p-6 text-center">
            <BookOpen className="size-6 mx-auto text-muted-foreground" />
            <div className="mt-2 text-sm font-semibold">No active book</div>
            <div className="text-xs text-muted-foreground">
              Choose a title below to start reading.
            </div>
          </div>
        </section>
      )}

      <section className="px-5 mt-6">
        <h2 className="text-display text-base font-semibold mb-3">Your shelf</h2>
        <div className="space-y-2">
          {accessible.map((b) => (
            <button
              key={b.id}
              onClick={() => navigate({ to: "/reader/$bookId", params: { bookId: b.id } })}
              className="w-full text-left rounded-2xl bg-card border border-border p-3 flex items-center gap-3 hover:border-foreground/20 transition"
            >
              <div className="w-12 h-16 rounded-md overflow-hidden bg-secondary shrink-0">
                <BookCover book={b} size="sm" className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold truncate">{b.title}</div>
                <div className="text-xs text-muted-foreground truncate">{b.author}</div>
                <div className="text-[10px] tracking-widest uppercase text-muted-foreground mt-0.5">
                  {b.chapters.length} chapters
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
