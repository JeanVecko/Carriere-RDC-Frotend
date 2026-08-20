"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken, type AuthUser } from "@/lib/auth-client";
import { createTraining, fetchMyOrganization } from "@/lib/company-api";
import { cities, sectors } from "@/lib/offers";

const modalities: { value: "ONSITE" | "ONLINE" | "HYBRID"; label: string }[] = [
  { value: "ONSITE", label: "Présentiel" },
  { value: "ONLINE", label: "En ligne" },
  { value: "HYBRID", label: "Hybride" },
];

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function PublishTrainingPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<"DRAFT" | "PUBLISHED" | null>(null);

  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("");
  const [objectives, setObjectives] = useState("");
  const [program, setProgram] = useState("");
  const [duration, setDuration] = useState("");
  const [modality, setModality] = useState<"ONSITE" | "ONLINE" | "HYBRID">("ONSITE");
  const [sessionDates, setSessionDates] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [poster, setPoster] = useState<File | null>(null);

  useEffect(() => {
    const storedUser: AuthUser | null = getStoredUser();
    const storedToken = getToken();

    if (
      !storedUser ||
      !storedToken ||
      (storedUser.role !== "COMPANY" && storedUser.role !== "TRAINING_ORG")
    ) {
      router.replace("/connexion");
      return;
    }

    setToken(storedToken);
    setChecking(false);

    fetchMyOrganization(storedToken)
      .then((org) => setIsVerified(org.isVerified))
      .catch(() => setIsVerified(false));
  }, [router]);

  async function handleSubmit(status: "DRAFT" | "PUBLISHED") {
    if (!token) return;
    setError(null);
    setSaving(status);

    try {
      await createTraining(token, {
        title,
        domain,
        objectives,
        program,
        duration,
        modality,
        sessionDates: splitLines(sessionDates),
        price: price || undefined,
        location: modality === "ONLINE" ? undefined : location || undefined,
        status,
        poster: poster || undefined,
      });

      router.push("/entreprise");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setSaving(null);
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
        <h1 className="mt-2 text-2xl font-bold text-white">Publier une formation</h1>
        <p className="mt-1 text-sm text-white/60">
          Présentez le programme, les modalités et les dates de session.
        </p>
      </section>

      <section className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        {error && (
          <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        {isVerified === false && (
          <p className="mb-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Votre compte est en attente de validation par un administrateur. Vous pouvez
            enregistrer un brouillon, mais la publication sera bloquée jusqu&apos;à validation.
          </p>
        )}

        <form
          className="flex flex-col gap-8"
          onSubmit={(e) => {
            e.preventDefault();
            const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
            handleSubmit(submitter?.value === "PUBLISHED" ? "PUBLISHED" : "DRAFT");
          }}
        >
          <Block title="Informations générales">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Intitulé de la formation" full>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex : Initiation à la comptabilité OHADA"
                  className="form-input"
                />
              </Field>

              <Field label="Domaine">
                <select required value={domain} onChange={(e) => setDomain(e.target.value)} className="form-input">
                  <option value="" disabled>Sélectionner</option>
                  {sectors.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </Field>

              <Field label="Durée">
                <input
                  required
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Ex : 3 semaines, 40 heures"
                  className="form-input"
                />
              </Field>

              <Field label="Modalité">
                <select
                  required
                  value={modality}
                  onChange={(e) => setModality(e.target.value as "ONSITE" | "ONLINE" | "HYBRID")}
                  className="form-input"
                >
                  {modalities.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </Field>

              {modality !== "ONLINE" && (
                <Field label="Lieu">
                  <select
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="form-input"
                  >
                    <option value="" disabled>Sélectionner</option>
                    {cities.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </Field>
              )}

              <Field label="Prix (optionnel, laisser vide si gratuit)">
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex : 150 USD ou Gratuit"
                  className="form-input"
                />
              </Field>

              <Field label="Dates de session (une par ligne)" full>
                <textarea
                  rows={3}
                  value={sessionDates}
                  onChange={(e) => setSessionDates(e.target.value)}
                  placeholder={"15 septembre 2026\n20 octobre 2026"}
                  className="form-input"
                />
              </Field>

              <Field label="Objectifs de la formation" full>
                <textarea
                  required
                  rows={3}
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  placeholder="Ce que les participants seront capables de faire à l'issue de la formation..."
                  className="form-input"
                />
              </Field>

              <Field label="Programme détaillé" full>
                <textarea
                  required
                  rows={5}
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  placeholder="Déroulé des modules, thèmes abordés..."
                  className="form-input"
                />
              </Field>

              <Field label="Affiche de la formation (optionnel, JPG, PNG ou PDF)" full>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(e) => setPoster(e.target.files?.[0] ?? null)}
                  className="form-input file:mr-3 file:rounded-md file:border-0 file:bg-navy-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                />
              </Field>
            </div>
          </Block>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              value="DRAFT"
              disabled={saving !== null}
              className="rounded-full border border-navy-900/15 px-6 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-navy-900/5 disabled:opacity-60"
            >
              {saving === "DRAFT" ? "Enregistrement..." : "Enregistrer en brouillon"}
            </button>
            <button
              type="submit"
              value="PUBLISHED"
              disabled={saving !== null || isVerified === false}
              title={isVerified === false ? "Compte en attente de validation" : undefined}
              className="rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
            >
              {saving === "PUBLISHED" ? "Publication..." : "Publier la formation"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-navy-900/10 bg-white p-6 sm:p-8">
      <h2 className="mb-4 text-base font-semibold text-navy-900">{title}</h2>
      {children}
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
