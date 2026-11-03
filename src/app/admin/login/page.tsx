"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowRight, Lock } from "lucide-react";
import { LiveImageLogo } from "@/components/LiveImageLogo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only follow redirects back into the admin area
    let callbackUrl = "/admin";
    try {
      const url = new URL(searchParams.get("callbackUrl") || "", window.location.origin);
      if (url.origin === window.location.origin && url.pathname.startsWith("/admin")) {
        callbackUrl = url.pathname + url.search;
      }
    } catch {}

    setError(null);
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setIsSubmitting(false);
    if (!result || result.error) {
      setError("Email or password is incorrect.");
      return;
    }
    router.replace(callbackUrl);
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-stage border border-white/10 rounded-2xl p-6 sm:p-8 space-y-5"
    >
      <div className="space-y-2">
        <LiveImageLogo size="sm" adminBadge />
        <h1 className="font-heading font-bold text-xl text-paper pt-3">
          Control Panel Login
        </h1>
        <p className="text-xs text-muted">
          For LIVE IMAGE owner and event crew only.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="px-3.5 py-2.5 rounded-lg bg-rec/15 border border-rec/40 text-red-200 text-xs font-medium"
        >
          {error}
        </div>
      )}

      <div className="space-y-3">
        <label className="block space-y-1.5">
          <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-muted">
            Email
          </span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-night border border-white/10 text-sm text-paper focus:outline-none focus:border-rec"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-muted">
            Password
          </span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-night border border-white/10 text-sm text-paper focus:outline-none focus:border-rec"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-lg bg-rec hover:bg-rec/90 disabled:opacity-60 text-white font-heading font-semibold text-sm transition flex items-center justify-center gap-2"
      >
        <Lock className="w-3.5 h-3.5" />
        <span>{isSubmitting ? "Signing in…" : "Sign in"}</span>
        {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
      </button>

      <Link href="/" className="block text-center text-xs text-muted hover:text-paper">
        ← Back to website
      </Link>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-night px-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
