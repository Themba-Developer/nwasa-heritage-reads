import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNwasa } from "@/lib/nwasa-store";
import { Logo } from "@/components/nwasa/Logo";

export const Route = createFileRoute("/")({
  component: SplashPage,
});

function SplashPage() {
  const { user } = useNwasa();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    const t = setTimeout(() => {
      if (!user) navigate({ to: "/auth" });
      else if (!user.onboarded) navigate({ to: "/onboarding" });
      else navigate({ to: "/home" });
    }, 1600);
    return () => clearTimeout(t);
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-charcoal-gradient relative overflow-hidden flex flex-col items-center justify-center text-white">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, color-mix(in oklab, var(--gold) 35%, transparent), transparent 70%)",
        }}
      />
      <div
        className={`relative flex flex-col items-center transition-all duration-700 ${
          ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <div className="size-24 rounded-3xl grid place-items-center shadow-elegant bg-card mb-6">
          <svg viewBox="0 0 48 48" className="size-14">
            <path
              d="M14 34 V14 L24 28 V14 M28 14 L34 34 M28 28 H34"
              stroke="var(--gold)"
              strokeWidth="2.6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-display text-4xl font-semibold tracking-tight">NWASA</h1>
        <p className="mt-2 text-xs tracking-[0.32em] uppercase text-white/60">
          National Writers · South Africa
        </p>
        <div className="mt-12 h-[2px] w-24 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-gold-gradient"
            style={{
              width: ready ? "100%" : "0%",
              transition: "width 1.4s ease-out",
            }}
          />
        </div>
      </div>
      <div className="absolute bottom-8 text-[10px] tracking-[0.3em] uppercase text-white/40">
        Est. 2025 · Pretoria
      </div>
    </div>
  );
}
