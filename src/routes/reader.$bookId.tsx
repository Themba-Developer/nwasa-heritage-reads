import * as React from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNwasa, useBook } from "@/lib/nwasa-store";
import { UpsellModal } from "@/components/nwasa/UpsellModal";
import {
  ArrowLeft,
  Bookmark,
  Type,
  Sun,
  Moon,
  Coffee,
  Highlighter,
  ChevronLeft,
  ChevronRight,
  List,
  Crown,
  StickyNote,
  X,
} from "lucide-react";

export const Route = createFileRoute("/reader/$bookId")({
  component: ReaderPage,
});

type Theme = "light" | "sepia" | "dark";

function ReaderPage() {
  const { bookId } = Route.useParams();
  const navigate = useNavigate();
  const book = useBook(bookId);
  const { user, addBookmark, addHighlight, setLastRead } = useNwasa();

  const [chapter, setChapter] = useState(0);
  const [theme, setTheme] = useState<Theme>("light");
  const [fontSize, setFontSize] = useState(18);
  const [showToc, setShowToc] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const [selection, setSelection] = useState<string | null>(null);
  const [noteFor, setNoteFor] = useState<string | null>(null);
  const [showUpsell, setShowUpsell] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  const locked = book && book.tier === "premium" && user?.tier !== "premium";
  const premium = user?.tier === "premium";

  useEffect(() => {
    if (book && !locked) {
      const progress = book.chapters.length > 0 ? (chapter + 1) / book.chapters.length : 0;
      setLastRead(book.id, progress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter, book?.id, locked]);

  const themeStyles = useMemo(() => {
    if (theme === "sepia")
      return { bg: "var(--reader-bg-sepia)", fg: "var(--reader-fg-sepia)" };
    if (theme === "dark")
      return { bg: "var(--reader-bg-dark)", fg: "var(--reader-fg-dark)" };
    return { bg: "var(--reader-bg-light)", fg: "var(--reader-fg-light)" };
  }, [theme]);

  if (!book) {
    return (
      <div className="min-h-screen grid place-items-center px-6 text-center">
        <div>
          <div className="text-display text-2xl font-semibold">Book not found</div>
          <Link to="/library" className="text-sm underline mt-2 inline-block">
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  if (locked) {
    return (
      <div className="min-h-screen bg-charcoal-gradient text-white flex flex-col">
        <header className="px-5 pt-6 flex items-center justify-between">
          <button
            onClick={() => navigate({ to: "/library" })}
            className="size-10 rounded-full bg-white/10 grid place-items-center"
          >
            <ArrowLeft className="size-4" />
          </button>
        </header>
        <div className="flex-1 px-6 py-10 flex flex-col items-center justify-center text-center">
          <div className="size-16 rounded-2xl grid place-items-center" style={{ background: "var(--gold)" }}>
            <Crown className="size-8" style={{ color: "var(--charcoal)" }} />
          </div>
          <div className="mt-4 text-[11px] tracking-[0.32em] uppercase text-white/60">
            Premium Title
          </div>
          <h1 className="mt-2 text-display text-3xl font-semibold leading-tight max-w-md">
            "{book.title}" is part of NWASA Premium
          </h1>
          <p className="mt-3 text-sm text-white/70 max-w-sm">
            Upgrade for R149.99/month to read this title and the rest of our growing library — and to support South African writers directly.
          </p>
          <button
            onClick={() => setShowUpsell(true)}
            className="mt-8 rounded-xl px-6 py-3.5 font-semibold shadow-elegant"
            style={{ background: "var(--gold)", color: "var(--charcoal)" }}
          >
            Upgrade to Premium
          </button>
          <Link
            to="/library"
            className="mt-4 text-xs text-white/60 underline"
          >
            Back to library
          </Link>
        </div>
        <UpsellModal open={showUpsell} onClose={() => setShowUpsell(false)} bookTitle={book.title} />
      </div>
    );
  }

  const current = book.chapters[chapter];
  const progress = ((chapter + 1) / book.chapters.length) * 100;

  const onMouseUp = () => {
    const sel = window.getSelection?.()?.toString().trim();
    if (sel && sel.length > 2) setSelection(sel);
    else setSelection(null);
  };

  const doHighlight = () => {
    if (!selection) return;
    if (!premium) {
      setShowUpsell(true);
      setSelection(null);
      return;
    }
    setHighlighted((h) => [...h, selection]);
    addHighlight({ bookId: book.id, chapterIndex: chapter, text: selection });
    setSelection(null);
    window.getSelection?.()?.removeAllRanges();
  };

  const doNote = () => {
    if (!selection) return;
    if (!premium) {
      setShowUpsell(true);
      return;
    }
    setNoteFor(selection);
  };

  const doBookmark = () => {
    addBookmark({
      bookId: book.id,
      chapterIndex: chapter,
      note: `${book.title} — ${current.title}`,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 1800);
  };

  // Render paragraphs with highlight wrapping
  const renderParagraph = (p: string, idx: number) => {
    let nodes: (string | React.ReactElement)[] = [p];
    highlighted.forEach((h, hi) => {
      nodes = nodes.flatMap((n, ni) => {
        if (typeof n !== "string") return [n];
        const parts = n.split(h);
        if (parts.length === 1) return [n];
        const out: (string | React.ReactElement)[] = [];
        parts.forEach((part, pi) => {
          out.push(part);
          if (pi < parts.length - 1)
            out.push(
              <mark
                key={`hl-${idx}-${ni}-${hi}-${pi}`}
                style={{
                  background: "color-mix(in oklab, var(--gold) 35%, transparent)",
                  color: "inherit",
                  padding: "0 2px",
                  borderRadius: 2,
                }}
              >
                {h}
              </mark>,
            );
        });
        return out;
      });
    });
    return (
      <p key={idx} className="text-serif" style={{ marginBottom: "1.4em", lineHeight: 1.75 }}>
        {nodes}
      </p>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col transition-colors"
      style={{ backgroundColor: themeStyles.bg, color: themeStyles.fg }}
    >
      <header
        className="sticky top-0 z-30 backdrop-blur-sm border-b"
        style={{
          backgroundColor: `color-mix(in oklab, ${themeStyles.bg} 90%, transparent)`,
          borderColor: `color-mix(in oklab, ${themeStyles.fg} 12%, transparent)`,
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-2">
          <button
            onClick={() => navigate({ to: "/library" })}
            className="size-9 grid place-items-center rounded-full hover:bg-black/5"
            style={{ color: themeStyles.fg }}
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="flex-1 min-w-0 text-center">
            <div className="text-[10px] tracking-[0.2em] uppercase opacity-60 truncate">
              {book.author}
            </div>
            <div className="text-sm font-semibold truncate">{book.title}</div>
          </div>
          <button
            onClick={() => setShowToc(true)}
            className="size-9 grid place-items-center rounded-full hover:bg-black/5"
            style={{ color: themeStyles.fg }}
          >
            <List className="size-4" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="size-9 grid place-items-center rounded-full hover:bg-black/5"
            style={{ color: themeStyles.fg }}
          >
            <Type className="size-4" />
          </button>
          <button
            onClick={doBookmark}
            className="size-9 grid place-items-center rounded-full hover:bg-black/5"
            style={{ color: themeStyles.fg }}
          >
            <Bookmark className="size-4" />
          </button>
        </div>
        <div
          className="h-0.5 w-full"
          style={{ background: `color-mix(in oklab, ${themeStyles.fg} 10%, transparent)` }}
        >
          <div
            className="h-full bg-gold-gradient transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="flex-1">
        <article
          ref={articleRef}
          onMouseUp={onMouseUp}
          onTouchEnd={onMouseUp}
          className="max-w-2xl mx-auto px-6 py-10"
          style={{ fontSize }}
        >
          <div className="text-[11px] tracking-[0.32em] uppercase opacity-50 font-semibold">
            Chapter {chapter + 1} of {book.chapters.length}
          </div>
          <h1 className="text-display text-3xl font-semibold mt-2 mb-8 leading-tight">
            {current.title}
          </h1>
          {current.content.split(/\n\n+/).map(renderParagraph)}

          <div className="mt-12 pt-6 border-t flex items-center justify-between" style={{ borderColor: `color-mix(in oklab, ${themeStyles.fg} 12%, transparent)` }}>
            <button
              onClick={() => setChapter((c) => Math.max(0, c - 1))}
              disabled={chapter === 0}
              className="inline-flex items-center gap-1 text-sm font-semibold disabled:opacity-30"
            >
              <ChevronLeft className="size-4" /> Previous
            </button>
            <span className="text-xs opacity-60">{Math.round(progress)}%</span>
            <button
              onClick={() => setChapter((c) => Math.min(book.chapters.length - 1, c + 1))}
              disabled={chapter === book.chapters.length - 1}
              className="inline-flex items-center gap-1 text-sm font-semibold disabled:opacity-30"
            >
              Next <ChevronRight className="size-4" />
            </button>
          </div>
        </article>
      </main>

      {/* Selection action bar */}
      {selection && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-charcoal-gradient text-white rounded-full shadow-elegant px-2 py-1.5 flex items-center gap-1">
          <button
            onClick={doHighlight}
            className="px-3 py-2 rounded-full flex items-center gap-1.5 text-xs font-semibold hover:bg-white/10"
          >
            <Highlighter className="size-3.5" style={{ color: "var(--gold)" }} />
            Highlight
          </button>
          <div className="w-px h-5 bg-white/15" />
          <button
            onClick={doNote}
            className="px-3 py-2 rounded-full flex items-center gap-1.5 text-xs font-semibold hover:bg-white/10"
          >
            <StickyNote className="size-3.5" /> Note
          </button>
          <button
            onClick={() => setSelection(null)}
            className="px-2 py-2 rounded-full hover:bg-white/10"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Saved toast */}
      {savedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-card border border-border rounded-full shadow-elegant px-4 py-2 text-xs font-semibold">
          ★ Bookmark saved
        </div>
      )}

      {/* Settings drawer */}
      {showSettings && (
        <Drawer onClose={() => setShowSettings(false)} title="Display">
          <div className="space-y-5">
            <div>
              <Label>Theme</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(
                  [
                    { k: "light" as Theme, label: "Light", icon: Sun, bg: "#fafaf7", fg: "#222" },
                    { k: "sepia" as Theme, label: "Sepia", icon: Coffee, bg: "#f1e4c8", fg: "#4a3a22" },
                    { k: "dark" as Theme, label: "Dark", icon: Moon, bg: "#1b1d22", fg: "#f4efe6" },
                  ] as const
                ).map(({ k, label, icon: Ic, bg, fg }) => {
                  const active = theme === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setTheme(k)}
                      className="rounded-xl border p-3 flex flex-col items-center gap-1.5 transition"
                      style={{
                        background: bg,
                        color: fg,
                        borderColor: active ? "var(--gold)" : "var(--border)",
                        outline: active ? "2px solid var(--gold)" : "none",
                        outlineOffset: 2,
                      }}
                    >
                      <Ic className="size-4" />
                      <span className="text-[11px] font-semibold">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <Label>Text size</Label>
              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => setFontSize((s) => Math.max(14, s - 1))}
                  className="size-10 rounded-xl border border-border grid place-items-center text-sm font-semibold"
                >
                  A−
                </button>
                <div className="flex-1 text-center text-sm">{fontSize}px</div>
                <button
                  onClick={() => setFontSize((s) => Math.min(28, s + 1))}
                  className="size-10 rounded-xl border border-border grid place-items-center text-base font-semibold"
                >
                  A+
                </button>
              </div>
            </div>
            {!premium && (
              <div
                className="rounded-xl p-3 text-xs"
                style={{
                  background: "color-mix(in oklab, var(--gold) 18%, transparent)",
                  color: "var(--charcoal)",
                }}
              >
                <strong>Premium readers</strong> unlock highlighting and notes. Upgrade for R149.99/pm.
              </div>
            )}
          </div>
        </Drawer>
      )}

      {/* TOC drawer */}
      {showToc && (
        <Drawer onClose={() => setShowToc(false)} title="Chapters">
          <ul className="space-y-1">
            {book.chapters.map((c, i) => {
              const active = i === chapter;
              return (
                <li key={i}>
                  <button
                    onClick={() => {
                      setChapter(i);
                      setShowToc(false);
                    }}
                    className="w-full text-left rounded-xl px-3 py-3 flex items-center gap-3 transition"
                    style={{
                      background: active ? "var(--charcoal)" : "transparent",
                      color: active ? "white" : "var(--foreground)",
                    }}
                  >
                    <div
                      className="size-8 rounded-lg grid place-items-center text-xs font-bold shrink-0"
                      style={{
                        background: active ? "var(--gold)" : "var(--secondary)",
                        color: active ? "var(--charcoal)" : "var(--muted-foreground)",
                      }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium">{c.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Drawer>
      )}

      {/* Note modal */}
      {noteFor && (
        <NoteDialog
          quote={noteFor}
          onClose={() => setNoteFor(null)}
          onSave={(note) => {
            addHighlight({ bookId: book.id, chapterIndex: chapter, text: noteFor, note });
            setHighlighted((h) => [...h, noteFor]);
            setNoteFor(null);
            setSelection(null);
          }}
        />
      )}

      <UpsellModal open={showUpsell} onClose={() => setShowUpsell(false)} bookTitle={book.title} />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] tracking-[0.2em] uppercase font-semibold text-muted-foreground">
      {children}
    </div>
  );
}

function Drawer({
  children,
  title,
  onClose,
}: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "color-mix(in oklab, var(--charcoal) 50%, transparent)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-display text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="size-8 grid place-items-center rounded-full hover:bg-secondary"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function NoteDialog({
  quote,
  onClose,
  onSave,
}: {
  quote: string;
  onClose: () => void;
  onSave: (note: string) => void;
}) {
  const [note, setNote] = useState("");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "color-mix(in oklab, var(--charcoal) 60%, transparent)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-card rounded-2xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-display text-lg font-semibold">Add a note</h3>
        <blockquote
          className="mt-3 text-serif italic text-sm border-l-4 pl-3"
          style={{ borderColor: "var(--gold)" }}
        >
          "{quote}"
        </blockquote>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
          placeholder="Your thoughts…"
          className="mt-3 w-full rounded-xl border border-input bg-secondary/40 p-3 text-sm outline-none focus:bg-card focus:border-ring"
        />
        <div className="mt-3 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(note)}
            className="rounded-xl px-4 py-2 text-sm font-semibold bg-charcoal-gradient text-white"
          >
            Save note
          </button>
        </div>
      </div>
    </div>
  );
}
