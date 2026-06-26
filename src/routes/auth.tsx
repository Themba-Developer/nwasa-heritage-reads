import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useNwasa } from "@/lib/nwasa-store";
import { Logo } from "@/components/nwasa/Logo";
import { Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { signUp, signIn, user } = useNwasa();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (mode === "signup") {
      if (!name) return;
      signUp(name, email);
      navigate({ to: "/onboarding" });
    } else {
      signIn(email);
      navigate({ to: user?.onboarded ? "/home" : "/onboarding" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-charcoal-gradient text-white px-6 pt-12 pb-16 relative overflow-hidden">
        <div
          className="absolute -right-20 -top-20 size-72 rounded-full opacity-25"
          style={{ background: "var(--gold)" }}
        />
        <div className="relative">
          <Logo light />
          <h1 className="mt-10 text-display text-3xl font-semibold leading-tight max-w-xs">
            {mode === "signup" ? "Join the national library of South African letters." : "Welcome back."}
          </h1>
          <p className="mt-2 text-sm text-white/65 max-w-sm">
            {mode === "signup"
              ? "Create your free account to begin reading. Upgrade anytime to access the full catalogue."
              : "Sign in to continue your reading journey."}
          </p>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="flex-1 -mt-8 mx-4 sm:mx-auto sm:max-w-md w-auto sm:w-full bg-card rounded-3xl shadow-elegant p-6 space-y-4"
      >
        {mode === "signup" && (
          <Field
            icon={<UserIcon className="size-4" />}
            label="Full name"
            value={name}
            onChange={setName}
            placeholder="e.g. Lerato Mokoena"
          />
        )}
        <Field
          icon={<Mail className="size-4" />}
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.co.za"
        />
        <Field
          icon={<Lock className="size-4" />}
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
        />

        <button
          type="submit"
          className="w-full bg-charcoal-gradient text-white rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 shadow-elegant"
        >
          {mode === "signup" ? "Create account" : "Sign in"}
          <ArrowRight className="size-4" />
        </button>

        <div className="text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already a member?" : "New to NWASA?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="font-semibold underline-offset-4 hover:underline"
            style={{ color: "var(--charcoal)" }}
          >
            {mode === "signup" ? "Sign in" : "Create account"}
          </button>
        </div>

        <p className="text-[11px] text-center text-muted-foreground pt-2">
          By continuing you agree to NWASA's Terms & Privacy Policy.
        </p>
      </form>
      <div className="pb-10" />
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-muted-foreground">
        {label}
      </span>
      <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-input bg-secondary/40 px-3.5 py-3 focus-within:border-ring focus-within:bg-card transition">
        <span className="text-muted-foreground">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/60"
        />
      </div>
    </label>
  );
}
