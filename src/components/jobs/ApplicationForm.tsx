"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { educationLevels, type JobOffer } from "@/lib/offers";
import { getStoredUser, getToken, type AuthUser } from "@/lib/auth-client";
import { useAppliedOffers } from "@/components/jobs/applied-offers-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function ApplicationForm({ offer }: { offer: JobOffer }) {
  const { appliedOfferIds, markApplied } = useAppliedOffers();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [educationLevel, setEducationLevel] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [skills, setSkills] = useState("");
  const [preScreeningAnswers, setPreScreeningAnswers] = useState<string[]>(
    () => offer.ats.preScreeningQuestions.map(() => "")
  );
  const [cvFile, setCvFile] = useState<File | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    setCheckedAuth(true);
  }, []);

  function toggleLanguage(language: string) {
    setLanguages((current) =>
      current.includes(language)
        ? current.filter((item) => item !== language)
        : [...current, language]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const token = getToken();
    if (!token || !cvFile) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("cv", cvFile);
      formData.append(
        "formAnswers",
        JSON.stringify({
          educationLevel,
          experienceYears: Number(experienceYears),
          languages,
          skills: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          preScreeningAnswers,
        })
      );

      const res = await fetch(`${API_URL}/api/job-offers/${offer.id}/apply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Erreur serveur (${res.status}).`);
      }

      markApplied(offer.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  if (!checkedAuth) return null;

  if (!user) {
    return (
      <div className="rounded-xl border border-navy-900/10 bg-white p-8 text-center">
        <h3 className="text-lg font-semibold text-navy-900">Postuler à cette offre</h3>
        <p className="mt-2 text-sm text-navy-900/60">
          Vous devez être connecté en tant que candidat pour postuler.
        </p>
        <Link
          href="/connexion"
          className="mt-4 inline-block rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Se connecter
        </Link>
      </div>
    );
  }

  if (user.role !== "CANDIDATE") {
    return (
      <div className="rounded-xl border border-navy-900/10 bg-white p-8 text-center">
        <p className="text-sm text-navy-900/60">
          Seuls les comptes candidat peuvent postuler à une offre.
        </p>
      </div>
    );
  }

  if (appliedOfferIds.has(offer.id)) {
    return (
      <div className="rounded-xl border border-navy-900/10 bg-white p-8 text-center">
        <h3 className="text-lg font-semibold text-navy-900">Candidature envoyée</h3>
        <p className="mt-2 text-sm text-navy-900/60">
          Votre candidature pour « {offer.title} » a bien été enregistrée.
        </p>
        <Link
          href="/candidat"
          className="mt-4 inline-block rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
        >
          Suivre mes candidatures
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-navy-900/10 bg-white p-6 sm:p-8"
    >
      <h3 className="text-lg font-semibold text-navy-900">Postuler à cette offre</h3>
      <p className="mt-1 text-sm text-navy-900/60">
        Vous postulez en tant que <strong>{user.name}</strong> ({user.email}). Ce
        formulaire structuré permet le tri automatique (ATS) de votre candidature
        selon les critères du poste.
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Niveau d'études">
          <select
            required
            value={educationLevel}
            onChange={(e) => setEducationLevel(e.target.value)}
            className="form-input"
          >
            <option value="" disabled>
              Sélectionner
            </option>
            {educationLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Années d'expérience">
          <input
            required
            type="number"
            min={0}
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            className="form-input"
            placeholder="Ex : 3"
          />
        </Field>

        <Field label="Langues parlées" full>
          <div className="flex flex-wrap gap-3">
            {offer.ats.requiredLanguages.map((language) => (
              <label
                key={language}
                className="flex items-center gap-2 text-sm text-navy-900/70"
              >
                <input
                  type="checkbox"
                  checked={languages.includes(language)}
                  onChange={() => toggleLanguage(language)}
                  className="h-4 w-4 rounded border-navy-900/20 text-gold-500 focus:ring-gold-400"
                />
                {language}
              </label>
            ))}
          </div>
        </Field>

        <Field label="Compétences clés" full>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="form-input"
            placeholder={offer.ats.keySkills.join(", ")}
          />
        </Field>

        <Field label="CV (PDF)" full>
          <input
            required
            type="file"
            accept=".pdf"
            onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
            className="form-input file:mr-3 file:rounded-md file:border-0 file:bg-navy-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
          />
        </Field>

        {offer.ats.preScreeningQuestions.map((question, index) => (
          <Field key={index} label={question} full>
            <textarea
              required
              rows={2}
              value={preScreeningAnswers[index]}
              onChange={(e) =>
                setPreScreeningAnswers((current) =>
                  current.map((answer, i) => (i === index ? e.target.value : answer))
                )
              }
              className="form-input"
            />
          </Field>
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-lg bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400 disabled:opacity-60 sm:w-auto"
      >
        {loading ? "Envoi..." : "Envoyer ma candidature"}
      </button>
    </form>
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
