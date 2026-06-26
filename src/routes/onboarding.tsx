import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useNwasa } from "@/lib/nwasa-store";
import { PREFERENCE_OPTIONS } from "@/lib/nwasa-data";
import { Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

function OnboardingPage() {
  const { completeOnboarding, user } = useNwasa();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(user?.preferences ?? []);

  const toggle = (p: string) =>
    setSelected((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));

  const submit = () => {
    completeOnboarding(selected);
    navigate({ to: "/home" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 pt-10 pb-6">
        <div className="text-[11px] tracking-[0.32em] uppercase font-semibold text-muted-foreground">
          Step 1 of 1
        </div>
        <h1 className="mt-2 text-display text-3xl font-semibold leading-tight max-w-md">
          What would you like to read?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Choose at least three. We'll curate your Home feed and recommend new releases.
        </p>
      </header>

      <main className="flex-1 px-6 pb-32">
        <div className="grid grid-cols-2 gap-3 max-w-xl">
          {PREFERENCE_OPTIONS.map((p) => {
            const active = selected.includes(p);
            return (
              <button
                key={p}
                onClick={() => toggle(p)}
                className="relative rounded-2xl border p-4 text-left transition"
                style={{
                  borderColor: active ? "var(--charcoal)" : "var(--border)",
                  background: active ? "var(--charcoal)" : "var(--card)",
                  color: active ? "white" : "var(--foreground)",
                }}
              >
                <div className="text-display text-lg font-semibold">{p}</div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: active ? "rgba(255,255,255,0.6)" : "var(--muted-foreground)" }}
                >
                  {p === "Poetry" ? "Verse & spoken word" : `New & classic ${p.toLowerCase()}`}
                </div>
                {active && (
                  <div
                    className="absolute top-3 right-3 size-6 rounded-full grid place-items-center"
                    style={{ background: "var(--gold)" }}
                  >
                    <Check className="size-3.5" style={{ color: "var(--charcoal)" }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </main>

      <footer className="fixed bottom-0 inset-x-0 bg-card/95 backdrop-blur border-t border-border px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            {selected.length} selected
          </div>
          <button
            onClick={submit}
            disabled={selected.length < 1}
            className="bg-charcoal-gradient text-white rounded-xl px-6 py-3 font-semibold flex items-center gap-2 disabled:opacity-40"
          >
            Continue <ArrowRight className="size-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}
