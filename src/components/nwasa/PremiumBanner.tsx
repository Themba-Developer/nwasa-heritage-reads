import { Crown } from "lucide-react";
import { useState } from "react";
import { UpsellModal } from "./UpsellModal";
import { useNwasa } from "@/lib/nwasa-store";
import { PREMIUM_PRICE } from "@/lib/nwasa-data";

export function PremiumBanner({ variant = "default" }: { variant?: "default" | "compact" }) {
  const { user } = useNwasa();
  const [open, setOpen] = useState(false);
  if (user?.tier === "premium") return null;

  if (variant === "compact") {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-premium-gradient text-white rounded-2xl px-4 py-3 flex items-center justify-between shadow-elegant"
        >
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Crown className="size-4" style={{ color: "var(--gold)" }} />
            Upgrade to Premium
          </span>
          <span className="text-xs text-white/70">{PREMIUM_PRICE}</span>
        </button>
        <UpsellModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full text-left bg-premium-gradient text-white rounded-3xl p-5 shadow-elegant relative overflow-hidden group"
      >
        <div
          className="absolute -right-10 -top-10 size-40 rounded-full opacity-20"
          style={{ background: "var(--gold)" }}
        />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-2.5 py-0.5 text-[10px] tracking-[0.18em] font-semibold uppercase">
            <Crown className="size-3" style={{ color: "var(--gold)" }} />
            Premium Membership
          </div>
          <h3 className="mt-3 text-display text-xl font-semibold leading-tight">
            Read every NWASA title for {PREMIUM_PRICE}
          </h3>
          <p className="mt-1 text-sm text-white/70">
            Support South African writers · cancel anytime
          </p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white text-charcoal px-4 py-2 text-sm font-semibold group-hover:bg-gold-soft transition" style={{ color: "var(--charcoal)" }}>
            Upgrade now
          </span>
        </div>
      </button>
      <UpsellModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
