"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell, { SocialButtons } from "@/components/auth/AuthShell";
import { register, saveSession, type Role } from "@/lib/auth-client";

const roleOptions: { value: Role; label: string }[] = [
  { value: "CANDIDATE", label: "Candidat" },
  { value: "COMPANY", label: "Entreprise" },
  { value: "TRAINING_ORG", label: "Organisme de formation" },
];

export default function InscriptionPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("CANDIDATE");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const session = await register({ name, email, password, role });
      saveSession(session);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Créer un compte">
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <div>
          <span className="mb-1.5 block text-sm font-medium text-navy-900">
            Vous êtes
          </span>
          <div className="flex flex-wrap gap-2">
            {roleOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setRole(option.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  role === option.value
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-navy-900/15 text-navy-900/70 hover:bg-navy-900/5"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {role !== "CANDIDATE" && (
            <p className="mt-2 text-xs text-navy-900/50">
              Les comptes entreprise et organisme sont soumis à validation par
              un administrateur avant de pouvoir publier.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-navy-900">
            {role === "CANDIDATE" ? "Nom complet" : "Nom de la structure"}
          </label>
          <div className="relative">
            <UserIcon />
            <input
              id="name"
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === "CANDIDATE" ? "Votre nom et prénom" : "Nom de l'entreprise"}
              className="form-input pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-navy-900">
            E-mail
          </label>
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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="form-input pl-10"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 rounded-full bg-gradient-to-r from-gold-600 to-gold-400 px-6 py-3 text-sm font-semibold text-navy-950 shadow-md transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Création du compte..." : "S'inscrire"}
        </button>
      </form>

      <SocialButtons />

      <p className="mt-6 text-center text-sm text-navy-900/60">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="font-semibold text-navy-900 hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthShell>
  );
}

function UserIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-900/40"
    >
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 20c0-3.9 3.1-6 7-6s7 2.1 7 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
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
