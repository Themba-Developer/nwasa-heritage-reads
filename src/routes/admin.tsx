import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useNwasa } from "@/lib/nwasa-store";
import { BookCover } from "@/components/nwasa/BookCover";
import { ArrowLeft, Shield, Sparkles, Check } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { publishBook, books } = useNwasa();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("Literary Fiction");
  const [synopsis, setSynopsis] = useState("");
  const [tier, setTier] = useState<"free" | "premium">("premium");
  const [content, setContent] = useState("");
  const [justPublished, setJustPublished] = useState<string | null>(null);

  const publish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !content) return;
    const b = publishBook({ title, author, genre, synopsis, tier, content });
    setJustPublished(b.id);
    setTitle("");
    setAuthor("");
    setSynopsis("");
    setContent("");
    setTimeout(() => setJustPublished(null), 4000);
  };

  const customBooks = books.filter((b) => b.custom);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-charcoal-gradient text-white px-5 pt-10 pb-12 rounded-b-3xl">
        <button
          onClick={() => navigate({ to: "/profile" })}
          className="size-10 rounded-full bg-white/10 grid place-items-center"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="mt-4 flex items-center gap-2 text-[10px] tracking-[0.32em] uppercase font-semibold text-white/60">
          <Shield className="size-3.5" style={{ color: "var(--gold)" }} /> Admin · Editorial
        </div>
        <h1 className="mt-1.5 text-display text-3xl font-semibold leading-tight">
          Publish a new title
        </h1>
        <p className="mt-1.5 text-sm text-white/65 max-w-md">
          New books appear in the public Library the moment you publish.
        </p>
      </header>

      <div className="mx-auto max-w-2xl px-5 -mt-6">
        <form
          onSubmit={publish}
          className="bg-card border border-border rounded-3xl shadow-card-soft p-5 space-y-4"
        >
          <Row>
            <Input label="Book title" value={title} onChange={setTitle} placeholder="e.g. The Long Veld" />
            <Input label="Author" value={author} onChange={setAuthor} placeholder="e.g. Lerato Mokoena" />
          </Row>
          <Row>
            <Input label="Genre" value={genre} onChange={setGenre} placeholder="Literary Fiction" />
            <div>
              <Label>Access tier</Label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                {(["free", "premium"] as const).map((t) => {
                  const active = tier === t;
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTier(t)}
                      className="rounded-xl border px-3 py-2.5 text-sm font-semibold capitalize"
                      style={{
                        background: active ? "var(--charcoal)" : "var(--card)",
                        color: active ? "white" : "var(--foreground)",
                        borderColor: active ? "var(--charcoal)" : "var(--border)",
                      }}
                    >
                      {t === "free" ? "Free Tier" : "Premium"}
                    </button>
                  );
                })}
              </div>
            </div>
          </Row>
          <div>
            <Label>Synopsis</Label>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              rows={2}
              placeholder="One or two sentences describing the book."
              className="mt-1.5 w-full rounded-xl border border-input bg-secondary/40 p-3 text-sm outline-none focus:bg-card focus:border-ring"
            />
          </div>
          <div>
            <Label>Full text content</Label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              placeholder="Paste the manuscript. Separate paragraphs with blank lines. We'll split into chapters automatically."
              className="mt-1.5 w-full rounded-xl border border-input bg-secondary/40 p-3 text-sm font-serif outline-none focus:bg-card focus:border-ring"
              style={{ fontFamily: "var(--font-serif)" }}
            />
            <div className="text-[11px] text-muted-foreground mt-1">
              {content.split(/\s+/).filter(Boolean).length} words
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to="/library"
              className="text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              View Library
            </Link>
            <button
              type="submit"
              className="bg-charcoal-gradient text-white rounded-xl px-6 py-3 font-semibold shadow-elegant disabled:opacity-40"
              disabled={!title || !author || !content}
            >
              Publish to Library
            </button>
          </div>
        </form>

        {justPublished && (
          <div
            className="mt-4 rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: "color-mix(in oklab, var(--gold) 18%, transparent)",
              border: "1px solid color-mix(in oklab, var(--gold) 40%, transparent)",
            }}
          >
            <div
              className="size-9 rounded-full grid place-items-center"
              style={{ background: "var(--gold)" }}
            >
              <Check className="size-4" style={{ color: "var(--charcoal)" }} />
            </div>
            <div className="flex-1 text-sm">
              <div className="font-semibold">Published</div>
              <div className="text-xs text-muted-foreground">
                Live in the Library now. Open the Library tab to confirm.
              </div>
            </div>
            <Link
              to="/library"
              className="text-xs font-semibold underline"
              style={{ color: "var(--charcoal)" }}
            >
              Open
            </Link>
          </div>
        )}

        <section className="mt-8 pb-16">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="size-4" style={{ color: "var(--gold)" }} />
            <h2 className="text-display text-base font-semibold">Recently published</h2>
          </div>
          {customBooks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No admin-published books yet. Publish your first above.
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {customBooks.map((b) => (
                <div key={b.id}>
                  <div className="rounded-lg overflow-hidden aspect-[5/7] bg-secondary">
                    <BookCover book={b} size="sm" className="w-full h-full" />
                  </div>
                  <div className="mt-1.5 text-[11px] font-semibold leading-tight line-clamp-2">
                    {b.title}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-3">{children}</div>;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-muted-foreground">
      {children}
    </span>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-input bg-secondary/40 p-3 text-sm outline-none focus:bg-card focus:border-ring"
      />
    </label>
  );
}
