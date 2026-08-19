"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken, type AuthUser } from "@/lib/auth-client";
import { fetchMyOrganization, saveMyOrganization } from "@/lib/company-api";
import { sectors, cities } from "@/lib/offers";

export default function CompanyProfilePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getToken();

    if (
      !storedUser ||
      !storedToken ||
      (storedUser.role !== "COMPANY" && storedUser.role !== "TRAINING_ORG")
    ) {
      router.replace("/connexion");
      return;
    }

    setUser(storedUser);
    setToken(storedToken);
    setChecking(false);

    fetchMyOrganization(storedToken)
      .then((org) => {
        setName(org.name);
        setSector(org.sector ?? "");
        setCity(org.city ?? "");
        setDescription(org.description ?? "");
        setLogoUrl(org.logoUrl ?? "");
        setIsVerified(org.isVerified);
      })
      .catch(() => {
        // Pas encore de profil organisation : on démarre sur un formulaire vide.
        setName(storedUser.name);
      });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setError(null);
    setSaving(true);
    setSaved(false);

    try {
      const org = await saveMyOrganization(token, {
        name,
        sector: sector || undefined,
        city: city || undefined,
        description: description || undefined,
        logoUrl: logoUrl || undefined,
      });
      setIsVerified(org.isVerified);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  }

  if (checking) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 py-20 text-sm text-navy-900/50">
        Vérification de l&apos;accès...
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <section className="mx-4 mt-4 rounded-3xl bg-navy-900 px-6 py-8 sm:mx-6 sm:mt-6 sm:px-8">
        <Link href="/entreprise" className="text-xs font-medium text-white/60 hover:text-white">
          ← Retour au tableau de bord
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">Profil de l&apos;organisation</h1>
        <p className="mt-1 text-sm text-white/60">
          Ces informations sont visibles publiquement sur vos offres publiées.
        </p>
      </section>

      <section className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6">
        {error && (
          <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-semibold text-navy-900">Informations générales</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              isVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
            }`}
          >
            {isVerified ? "Compte vérifié" : "En attente de validation"}
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-navy-900/10 bg-white p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="E-mail du compte">
              <input
                type="email"
                value={user?.email ?? ""}
                disabled
                className="form-input bg-navy-900/5 text-navy-900/50"
              />
            </Field>

            <Field label="Nom de la structure">
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
            </Field>

            <Field label="Secteur">
              <select value={sector} onChange={(e) => setSector(e.target.value)} className="form-input">
                <option value="">Sélectionner</option>
                {sectors.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Ville">
              <select value={city} onChange={(e) => setCity(e.target.value)} className="form-input">
                <option value="">Sélectionner</option>
                {cities.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="URL du logo" full>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className="form-input"
              />
            </Field>

            <Field label="Description" full>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Présentez votre structure en quelques lignes..."
                className="form-input"
              />
            </Field>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
            >
              {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
            {saved && <span className="text-sm text-green-700">Profil mis à jour.</span>}
          </div>
        </form>
      </section>
    </div>
  );
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-sm font-medium text-navy-900">{label}</span>
      {children}
    </label>
  );
}
