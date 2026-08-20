"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken, type AuthUser } from "@/lib/auth-client";
import { createJobOffer, createJobOfferFromDocument, fetchMyOrganization } from "@/lib/company-api";
import { cities, contractTypes, educationLevels, sectors } from "@/lib/offers";

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function splitCommas(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function PublishJobOfferPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<"DRAFT" | "PUBLISHED" | null>(null);
  const [mode, setMode] = useState<"form" | "pdf">("form");

  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfSector, setPdfSector] = useState("");
  const [pdfCity, setPdfCity] = useState("");
  const [pdfContractType, setPdfContractType] = useState("");
  const [pdfDeadline, setPdfDeadline] = useState("");
  const [pdfKeySkills, setPdfKeySkills] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfSaving, setPdfSaving] = useState<"DRAFT" | "PUBLISHED" | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [sector, setSector] = useState("");
  const [city, setCity] = useState("");
  const [contractType, setContractType] = useState("");
  const [description, setDescription] = useState("");
  const [missions, setMissions] = useState("");
  const [minEducationLevel, setMinEducationLevel] = useState("");
  const [minExperienceYears, setMinExperienceYears] = useState("0");
  const [requiredLanguages, setRequiredLanguages] = useState("");
  const [keySkills, setKeySkills] = useState("");
  const [niceToHave, setNiceToHave] = useState("");
  const [preScreeningQuestions, setPreScreeningQuestions] = useState("");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    const storedUser: AuthUser | null = getStoredUser();
    const storedToken = getToken();

    if (!storedUser || !storedToken || storedUser.role !== "COMPANY") {
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
      const offer = await createJobOffer(token, {
        title,
        sector,
        city,
        contractType,
        description,
        missions: splitLines(missions),
        atsCriteria: {
          minEducationLevel,
          minExperienceYears: Number(minExperienceYears) || 0,
          requiredLanguages: splitCommas(requiredLanguages),
          keySkills: splitCommas(keySkills),
          niceToHave: splitCommas(niceToHave),
        },
        preScreeningQuestions: splitLines(preScreeningQuestions),
        deadline: deadline || undefined,
        status,
      });

      router.push(status === "PUBLISHED" ? `/entreprise/offres/${offer.id}` : "/entreprise");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setSaving(null);
    }
  }

  async function handlePdfSubmit(status: "DRAFT" | "PUBLISHED") {
    if (!token || !pdfFile) return;
    setPdfError(null);
    setPdfSaving(status);

    try {
      const offer = await createJobOfferFromDocument(token, {
        title: pdfTitle,
        sector: pdfSector,
        city: pdfCity,
        contractType: pdfContractType,
        deadline: pdfDeadline || undefined,
        keySkills: pdfKeySkills || undefined,
        status,
        document: pdfFile,
      });

      router.push(status === "PUBLISHED" ? `/entreprise/offres/${offer.id}` : "/entreprise");
    } catch (err) {
      setPdfError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setPdfSaving(null);
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
        <h1 className="mt-2 text-2xl font-bold text-white">Publier une offre d&apos;emploi</h1>
        <p className="mt-1 text-sm text-white/60">
          Configurez les critères ATS pour un tri automatique des candidatures.
        </p>
      </section>

      <section className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        {isVerified === false && (
          <p className="mb-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Votre compte est en attente de validation par un administrateur. Vous pouvez
            enregistrer un brouillon, mais la publication sera bloquée jusqu&apos;à validation.
          </p>
        )}

        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("form")}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              mode === "form"
                ? "border-navy-900 bg-navy-900 text-white"
                : "border-navy-900/15 text-navy-900/70 hover:bg-navy-900/5"
            }`}
          >
            Formulaire détaillé
          </button>
          <button
            type="button"
            onClick={() => setMode("pdf")}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
              mode === "pdf"
                ? "border-navy-900 bg-navy-900 text-white"
                : "border-navy-900/15 text-navy-900/70 hover:bg-navy-900/5"
            }`}
          >
            Téléverser un PDF
          </button>
        </div>

        {mode === "pdf" ? (
          <>
            {pdfError && (
              <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {pdfError}
              </p>
            )}

            <form
              className="flex flex-col gap-8"
              onSubmit={(e) => {
                e.preventDefault();
                const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
                handlePdfSubmit(submitter?.value === "PUBLISHED" ? "PUBLISHED" : "DRAFT");
              }}
            >
              <Block title="Publier votre offre depuis un document PDF">
                <p className="mb-4 text-sm text-navy-900/60">
                  Le candidat pourra consulter directement votre document en cliquant sur
                  l&apos;offre. Ces quelques champs restent nécessaires pour que l&apos;offre
                  apparaisse dans les filtres de recherche.
                </p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Intitulé du poste" full>
                    <input
                      required
                      type="text"
                      value={pdfTitle}
                      onChange={(e) => setPdfTitle(e.target.value)}
                      placeholder="Ex : Responsable Logistique"
                      className="form-input"
                    />
                  </Field>

                  <Field label="Secteur">
                    <select
                      required
                      value={pdfSector}
                      onChange={(e) => setPdfSector(e.target.value)}
                      className="form-input"
                    >
                      <option value="" disabled>Sélectionner</option>
                      {sectors.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Ville">
                    <select
                      required
                      value={pdfCity}
                      onChange={(e) => setPdfCity(e.target.value)}
                      className="form-input"
                    >
                      <option value="" disabled>Sélectionner</option>
                      {cities.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Type de contrat">
                    <select
                      required
                      value={pdfContractType}
                      onChange={(e) => setPdfContractType(e.target.value)}
                      className="form-input"
                    >
                      <option value="" disabled>Sélectionner</option>
                      {contractTypes.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Date limite (optionnel)">
                    <input
                      type="date"
                      value={pdfDeadline}
                      onChange={(e) => setPdfDeadline(e.target.value)}
                      className="form-input"
                    />
                  </Field>

                  <Field label="Compétences et connaissances requises (séparées par des virgules, optionnel)" full>
                    <input
                      type="text"
                      value={pdfKeySkills}
                      onChange={(e) => setPdfKeySkills(e.target.value)}
                      placeholder="Excel avancé, Gestion de projet, Anglais professionnel..."
                      className="form-input"
                    />
                  </Field>

                  <Field label="Document de l'offre (PDF)" full>
                    <input
                      required
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                      className="form-input file:mr-3 file:rounded-md file:border-0 file:bg-navy-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
                    />
                  </Field>
                </div>
              </Block>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  value="DRAFT"
                  disabled={pdfSaving !== null}
                  className="rounded-full border border-navy-900/15 px-6 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-navy-900/5 disabled:opacity-60"
                >
                  {pdfSaving === "DRAFT" ? "Enregistrement..." : "Enregistrer en brouillon"}
                </button>
                <button
                  type="submit"
                  value="PUBLISHED"
                  disabled={pdfSaving !== null || isVerified === false}
                  title={isVerified === false ? "Compte en attente de validation" : undefined}
                  className="rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
                >
                  {pdfSaving === "PUBLISHED" ? "Publication..." : "Publier l'offre"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
        {error && (
          <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <form
          className="flex flex-col gap-8"
          onSubmit={(e) => {
            e.preventDefault();
            const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
            handleSubmit(submitter?.value === "PUBLISHED" ? "PUBLISHED" : "DRAFT");
          }}
        >
          <Block title="Informations du poste">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Intitulé du poste" full>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex : Responsable Logistique"
                  className="form-input"
                />
              </Field>

              <Field label="Secteur">
                <select required value={sector} onChange={(e) => setSector(e.target.value)} className="form-input">
                  <option value="" disabled>Sélectionner</option>
                  {sectors.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </Field>

              <Field label="Ville">
                <select required value={city} onChange={(e) => setCity(e.target.value)} className="form-input">
                  <option value="" disabled>Sélectionner</option>
                  {cities.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </Field>

              <Field label="Type de contrat">
                <select
                  required
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  className="form-input"
                >
                  <option value="" disabled>Sélectionner</option>
                  {contractTypes.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </Field>

              <Field label="Date limite (optionnel)">
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="form-input"
                />
              </Field>

              <Field label="Description du poste" full>
                <textarea
                  required
                  rows={4}
                  minLength={10}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Présentez le poste, l'équipe, les enjeux..."
                  className="form-input"
                />
              </Field>

              <Field label="Missions principales (une par ligne)" full>
                <textarea
                  rows={4}
                  value={missions}
                  onChange={(e) => setMissions(e.target.value)}
                  placeholder={"Superviser...\nCoordonner...\nOptimiser..."}
                  className="form-input"
                />
              </Field>
            </div>
          </Block>

          <Block title="Critères de tri automatique (ATS)">
            <p className="mb-4 text-sm text-navy-900/60">
              Ces critères obligatoires servent à classer automatiquement les candidatures reçues.
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Niveau d'études minimum">
                <select
                  required
                  value={minEducationLevel}
                  onChange={(e) => setMinEducationLevel(e.target.value)}
                  className="form-input"
                >
                  <option value="" disabled>Sélectionner</option>
                  {educationLevels.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </Field>

              <Field label="Années d'expérience minimum">
                <input
                  required
                  type="number"
                  min={0}
                  value={minExperienceYears}
                  onChange={(e) => setMinExperienceYears(e.target.value)}
                  className="form-input"
                />
              </Field>

              <Field label="Langues requises (séparées par des virgules)" full>
                <input
                  type="text"
                  value={requiredLanguages}
                  onChange={(e) => setRequiredLanguages(e.target.value)}
                  placeholder="Français, Anglais"
                  className="form-input"
                />
              </Field>

              <Field label="Compétences clés (séparées par des virgules)" full>
                <input
                  type="text"
                  value={keySkills}
                  onChange={(e) => setKeySkills(e.target.value)}
                  placeholder="Excel avancé, Gestion de projet"
                  className="form-input"
                />
              </Field>

              <Field label="Atouts appréciés, non éliminatoires (séparés par des virgules)" full>
                <input
                  type="text"
                  value={niceToHave}
                  onChange={(e) => setNiceToHave(e.target.value)}
                  placeholder="Permis de conduire, Certification..."
                  className="form-input"
                />
              </Field>

              <Field label="Questions de présélection (une par ligne, optionnel)" full>
                <textarea
                  rows={3}
                  value={preScreeningQuestions}
                  onChange={(e) => setPreScreeningQuestions(e.target.value)}
                  placeholder={"Êtes-vous disponible immédiatement ?"}
                  className="form-input"
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
              {saving === "PUBLISHED" ? "Publication..." : "Publier l'offre"}
            </button>
          </div>
        </form>
          </>
        )}
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
