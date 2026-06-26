import { Link, useLocation } from "@tanstack/react-router";
import { Home, BookOpen, BookMarked, User } from "lucide-react";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/library", label: "Library", icon: BookOpen },
  { to: "/reader", label: "Reader", icon: BookMarked },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function TabBar() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto max-w-2xl grid grid-cols-4">
        {tabs.map((t) => {
          const active =
            pathname === t.to || (t.to !== "/home" && pathname.startsWith(t.to));
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition"
              style={{
                color: active ? "var(--charcoal)" : "var(--muted-foreground)",
              }}
            >
              <div
                className="size-9 grid place-items-center rounded-xl transition"
                style={{
                  backgroundColor: active ? "var(--gold-soft)" : "transparent",
                }}
              >
                <Icon
                  className="size-[18px]"
                  style={{ color: active ? "var(--charcoal)" : "currentColor" }}
                  strokeWidth={active ? 2.4 : 2}
                />
              </div>
              {t.label}
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
