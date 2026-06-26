import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useNwasa } from "@/lib/nwasa-store";
import { PremiumBanner } from "@/components/nwasa/PremiumBanner";
import {
  BookMarked,
  Crown,
  LogOut,
  Settings,
  Shield,
  ChevronRight,
  Star,
  Bell,
  HelpCircle,
  Trash2,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, bookmarks, highlights, signOut, downgradeToFree, resetAll } = useNwasa();
  const navigate = useNavigate();
  const [showAdmin, setShowAdmin] = useState(false);

  if (!user) return null;
  const premium = user.tier === "premium";

  return (
    <div>
      <header className="bg-charcoal-gradient text-white px-5 pt-10 pb-16 rounded-b-3xl relative overflow-hidden">
        <div
          className="absolute -right-16 -top-16 size-60 rounded-full opacity-20"
          style={{ background: "var(--gold)" }}
        />
        <div className="relative flex items-center gap-4">
          <div
            className="size-16 rounded-2xl grid place-items-center text-display text-2xl font-semibold"
            style={{ background: "var(--gold)", color: "var(--charcoal)" }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-display text-xl font-semibold leading-tight truncate">
              {user.name}
            </div>
            <div className="text-xs text-white/65 truncate">{user.email}</div>
            <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur px-2.5 py-1 text-[10px] font-bold tracking-[0.2em] uppercase">
              {premium ? (
                <>
                  <Crown className="size-3" style={{ color: "var(--gold)" }} /> Premium Member
                </>
              ) : (
                <>Free Tier</>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="px-5 -mt-10 relative">
        <div className="grid grid-cols-3 gap-3 rounded-2xl bg-card border border-border p-3 shadow-card-soft">
          <Mini label="Streak" value={`${user.streak}`} />
          <Mini label="Minutes" value={`${user.minutesRead}`} />
          <Mini label="Bookmarks" value={`${bookmarks.length}`} />
        </div>
      </section>

      {!premium && (
        <section className="px-5 mt-5">
          <PremiumBanner />
        </section>
      )}

      <Section title="Saved bookmarks" icon={<BookMarked className="size-4" />}>
        {bookmarks.length === 0 ? (
          <Empty text="No bookmarks yet. Save your place from inside any book." />
        ) : (
          <ul className="space-y-2">
            {bookmarks.slice(0, 5).map((b) => (
              <li
                key={b.id}
                className="rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm flex items-start gap-3"
              >
                <Star className="size-4 mt-0.5 shrink-0" style={{ color: "var(--gold)" }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {b.note || `Chapter ${b.chapterIndex + 1}`}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="My highlights" icon={<Sparkles className="size-4" />}>
        {highlights.length === 0 ? (
          <Empty text="Highlights appear here. Premium members can highlight passages and add notes." />
        ) : (
          <ul className="space-y-2">
            {highlights.slice(0, 5).map((h) => (
              <li
                key={h.id}
                className="rounded-xl border-l-4 bg-card px-3.5 py-2.5 text-sm"
                style={{ borderColor: "var(--gold)" }}
              >
                <div className="text-serif text-sm italic line-clamp-2">"{h.text}"</div>
                {h.note && (
                  <div className="text-[11px] text-muted-foreground mt-1">— {h.note}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Account">
        <ul className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
          <Row
            icon={<Settings className="size-4" />}
            label="Settings"
            sub="Notifications, language, display"
          />
          <Row icon={<Bell className="size-4" />} label="Notifications" sub="On" />
          <Row icon={<HelpCircle className="size-4" />} label="Help & support" />
          <button
            onClick={() => setShowAdmin((s) => !s)}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-left hover:bg-secondary/60 transition"
          >
            <Shield className="size-4 text-muted-foreground" />
            <div className="flex-1">
              <div className="text-sm font-medium">Admin Dashboard</div>
              <div className="text-[11px] text-muted-foreground">
                Publish new books to the live library
              </div>
            </div>
            <ChevronRight
              className="size-4 text-muted-foreground transition"
              style={{ transform: showAdmin ? "rotate(90deg)" : "none" }}
            />
          </button>
          {showAdmin && (
            <div className="px-4 py-3 bg-secondary/40">
              <button
                onClick={() => navigate({ to: "/admin" })}
                className="w-full bg-charcoal-gradient text-white rounded-xl py-2.5 text-sm font-semibold"
              >
                Open Admin Dashboard
              </button>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                Restricted to NWASA editorial staff.
              </p>
            </div>
          )}
        </ul>
      </Section>

      <Section title="Membership">
        <div className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">
                {premium ? "Premium Membership" : "Free Tier"}
              </div>
              <div className="text-xs text-muted-foreground">
                {premium ? "R149.99 / month · renews monthly" : "1 free title included"}
              </div>
            </div>
            {premium ? (
              <button
                onClick={downgradeToFree}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            ) : null}
          </div>
        </div>
      </Section>

      <section className="px-5 mt-6 space-y-2">
        <button
          onClick={() => {
            signOut();
            navigate({ to: "/auth" });
          }}
          className="w-full rounded-xl border border-border bg-card py-3 text-sm font-semibold flex items-center justify-center gap-2"
        >
          <LogOut className="size-4" /> Sign out
        </button>
        <button
          onClick={() => {
            if (confirm("Reset all NWASA data (account, books, bookmarks)?")) {
              resetAll();
              navigate({ to: "/" });
            }
          }}
          className="w-full rounded-xl py-2 text-[11px] font-semibold flex items-center justify-center gap-1.5 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-3" /> Reset prototype data
        </button>
        <div className="text-center text-[10px] text-muted-foreground pt-4">
          NWASA v1.0 · MVP Prototype
        </div>
      </section>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-display text-xl font-semibold">{value}</div>
      <div className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground mt-0.5">
        {label}
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 mt-6">
      <div className="mb-3 flex items-center gap-2">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <h2 className="text-display text-base font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 p-4 text-sm text-muted-foreground text-center">
      {text}
    </div>
  );
}

function Row({
  icon,
  label,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
}) {
  return (
    <div className="px-4 py-3.5 flex items-center gap-3">
      <span className="text-muted-foreground">{icon}</span>
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
      </div>
      <ChevronRight className="size-4 text-muted-foreground" />
    </div>
  );
}
