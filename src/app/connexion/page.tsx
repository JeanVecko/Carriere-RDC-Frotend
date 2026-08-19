"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell, { SocialButtons } from "@/components/auth/AuthShell";
import { login, saveSession } from "@/lib/auth-client";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const session = await login(email, password);
      saveSession(session);

      const destination =
        session.user.role === "ADMIN"
          ? "/admin"
          : session.user.role === "COMPANY" || session.user.role === "TRAINING_ORG"
            ? "/entreprise"
            : "/";
      router.push(destination);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Connexion">
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="email" className="text-sm font-medium text-navy-900">
              E-mail
            </label>
            <Link href="#" className="text-xs font-medium text-navy-600 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <MailIcon />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              className="form-input pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-navy-900">
            Mot de passe
          </label>
          <div className="relative">
            <LockIcon />
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              className="form-input pl-10"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-gradient-to-r from-navy-800 to-navy-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <SocialButtons />

      <p className="mt-6 text-center text-sm text-navy-900/60">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-semibold text-navy-900 hover:underline">
          S&apos;inscrire
        </Link>
      </p>
    </AuthShell>
  );
}

function MailIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-900/40"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-900/40"
    >
      <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 10V7a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
