import { Crown, Check, X } from "lucide-react";
import { useNwasa } from "@/lib/nwasa-store";
import { PREMIUM_PRICE } from "@/lib/nwasa-data";

interface Props {
  open: boolean;
  onClose: () => void;
  bookTitle?: string;
}

export function UpsellModal({ open, onClose, bookTitle }: Props) {
  const { upgradeToPremium } = useNwasa();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-charcoal/60 backdrop-blur-sm p-0 sm:p-6"
      style={{ backgroundColor: "color-mix(in oklab, var(--charcoal) 60%, transparent)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-card rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-elegant"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 size-8 rounded-full bg-card/80 backdrop-blur grid place-items-center text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <div className="bg-premium-gradient px-6 pt-10 pb-8 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-[11px] tracking-[0.18em] font-semibold uppercase">
            <Crown className="size-3.5" style={{ color: "var(--gold)" }} />
            Premium Membership
          </div>
          <h2 className="mt-4 text-display text-3xl font-semibold leading-tight">
            {bookTitle ? `Unlock "${bookTitle}"` : "Read the entire NWASA library"}
          </h2>
          <p className="mt-2 text-sm text-white/75 leading-relaxed">
            Support South African writers and access every title, plus advanced reader tools.
          </p>
        </div>

        <div className="px-6 py-6 space-y-4">
          <ul className="space-y-3">
            {[
              "Unlimited access to all 10+ titles",
              "Highlighting, notes & exportable bookmarks",
              "Offline reading & sepia/dark themes",
              "New books added monthly — yours instantly",
            ].map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 size-5 rounded-full grid place-items-center bg-gold-soft">
                  <Check className="size-3 text-gold-foreground" style={{ color: "var(--charcoal)" }} />
                </span>
                <span className="text-foreground/85">{f}</span>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-border bg-secondary/60 p-4 flex items-baseline justify-between">
            <div>
              <div className="text-[11px] tracking-widest uppercase text-muted-foreground">
                Monthly membership
              </div>
              <div className="text-display text-2xl font-semibold mt-0.5">{PREMIUM_PRICE}</div>
            </div>
            <div className="text-xs text-muted-foreground">Cancel anytime</div>
          </div>

          <button
            onClick={() => {
              upgradeToPremium();
              onClose();
            }}
            className="w-full bg-charcoal-gradient text-white rounded-xl py-3.5 font-semibold tracking-wide shadow-elegant hover:opacity-95 transition"
          >
            Upgrade to Premium
          </button>
          <button
            onClick={onClose}
            className="w-full text-xs text-muted-foreground hover:text-foreground py-1"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
