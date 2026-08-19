"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken, type AuthUser } from "@/lib/auth-client";
import {
  addExperience,
  deleteDocument,
  deleteExperience,
  fetchMyProfile,
  updateMyProfile,
  uploadDocument,
  type CandidateDocument,
  type CandidateProfile,
  type DocumentType,
  type Experience,
} from "@/lib/candidate-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const documentTypes: { value: DocumentType; label: string }[] = [
  { value: "CV", label: "CV" },
  { value: "DIPLOMA", label: "Diplôme" },
  { value: "CERTIFICATE", label: "Certificat" },
];

export default function CandidateProfilePage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [profile, setProfile] = useState<CandidateProfile>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [bio, setBio] = useState("");

  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [expTitle, setExpTitle] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expStartDate, setExpStartDate] = useState("");
  const [expEndDate, setExpEndDate] = useState("");
  const [expCurrent, setExpCurrent] = useState(false);
  const [expDescription, setExpDescription] = useState("");
  const [savingExperience, setSavingExperience] = useState(false);

  const [documentType, setDocumentType] = useState<DocumentType>("CV");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [uploadingDocument, setUploadingDocument] = useState(false);

  const loadProfile = useCallback(async (authToken: string) => {
    const data = await fetchMyProfile(authToken);
    setProfile(data);
    setPhone(data?.phone ?? "");
    setCity(data?.city ?? "");
    setBirthDate(data?.birthDate ? data.birthDate.slice(0, 10) : "");
    setBio(data?.bio ?? "");
  }, []);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getToken();

    if (!storedUser || !storedToken || storedUser.role !== "CANDIDATE") {
      router.replace("/connexion");
      return;
    }

    setUser(storedUser);
    setToken(storedToken);
    setChecking(false);

    loadProfile(storedToken).catch((err) =>
      setError(err instanceof Error ? err.message : "Une erreur est survenue.")
    );
  }, [router, loadProfile]);

  async function handleSaveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setError(null);
    setSavingProfile(true);
    setProfileSaved(false);

    try {
      await updateMyProfile(token, {
        phone: phone || undefined,
        city: city || undefined,
        birthDate: birthDate || undefined,
        bio: bio || undefined,
      });
      await loadProfile(token);
      setProfileSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleAddExperience(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setError(null);
    setSavingExperience(true);

    try {
      await addExperience(token, {
        title: expTitle,
        company: expCompany,
        startDate: expStartDate,
        endDate: expCurrent ? undefined : expEndDate || undefined,
        current: expCurrent,
        description: expDescription || undefined,
      });
      await loadProfile(token);
      setExpTitle("");
      setExpCompany("");
      setExpStartDate("");
      setExpEndDate("");
      setExpCurrent(false);
      setExpDescription("");
      setShowExperienceForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setSavingExperience(false);
    }
  }

  async function handleDeleteExperience(experienceId: string) {
    if (!token) return;
    try {
      await deleteExperience(token, experienceId);
      await loadProfile(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }

  async function handleUploadDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !documentFile) return;
    setError(null);
    setUploadingDocument(true);

    try {
      await uploadDocument(token, documentType, documentFile);
      await loadProfile(token);
      setDocumentFile(null);
      event.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setUploadingDocument(false);
    }
  }

  async function handleDeleteDocument(documentId: string) {
    if (!token) return;
    try {
      await deleteDocument(token, documentId);
      await loadProfile(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
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
        <h1 className="text-2xl font-bold text-white">Mon profil</h1>
        <p className="mt-1 text-sm text-white/60">
          Complétez vos informations personnelles et vos expériences pour des candidatures plus complètes.
        </p>
      </section>

      <section className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        {error && (
          <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-semibold text-navy-900">Informations personnelles</h2>
          <Link
            href="/candidat"
            className="rounded-full border border-navy-900/15 px-4 py-1.5 text-xs font-semibold text-navy-900 transition-colors hover:bg-navy-900/5"
          >
            Mes candidatures
          </Link>
        </div>

        <form
          onSubmit={handleSaveProfile}
          className="rounded-2xl border border-navy-900/10 bg-white p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Nom complet">
              <input
                type="text"
                value={user?.name ?? ""}
                disabled
                className="form-input bg-navy-900/5 text-navy-900/50"
              />
            </Field>
            <Field label="E-mail">
              <input
                type="email"
                value={user?.email ?? ""}
                disabled
                className="form-input bg-navy-900/5 text-navy-900/50"
              />
            </Field>
            <Field label="Téléphone">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+243 ..."
                className="form-input"
              />
            </Field>
            <Field label="Ville">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Kinshasa"
                className="form-input"
              />
            </Field>
            <Field label="Date de naissance">
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="form-input"
              />
            </Field>
            <Field label="Présentation" full>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Quelques lignes pour vous présenter..."
                className="form-input"
              />
            </Field>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={savingProfile}
              className="rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-60"
            >
              {savingProfile ? "Enregistrement..." : "Enregistrer"}
            </button>
            {profileSaved && (
              <span className="text-sm text-green-700">Profil mis à jour.</span>
            )}
          </div>
        </form>

        <div className="mt-10 mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-navy-900">Expériences professionnelles</h2>
          <button
            type="button"
            onClick={() => setShowExperienceForm((v) => !v)}
            className="rounded-full bg-navy-900 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy-800"
          >
            {showExperienceForm ? "Annuler" : "+ Ajouter une expérience"}
          </button>
        </div>

        {showExperienceForm && (
          <form
            onSubmit={handleAddExperience}
            className="mb-4 rounded-2xl border border-navy-900/10 bg-white p-6"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field label="Intitulé du poste">
                <input
                  required
                  type="text"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  className="form-input"
                />
              </Field>
              <Field label="Entreprise">
                <input
                  required
                  type="text"
                  value={expCompany}
                  onChange={(e) => setExpCompany(e.target.value)}
                  className="form-input"
                />
              </Field>
              <Field label="Date de début">
                <input
                  required
                  type="date"
                  value={expStartDate}
                  onChange={(e) => setExpStartDate(e.target.value)}
                  className="form-input"
                />
              </Field>
              <Field label="Date de fin">
                <input
                  type="date"
                  value={expEndDate}
                  onChange={(e) => setExpEndDate(e.target.value)}
                  disabled={expCurrent}
                  className="form-input disabled:bg-navy-900/5"
                />
              </Field>
              <Field label="" full>
                <label className="flex items-center gap-2 text-sm text-navy-900/70">
                  <input
                    type="checkbox"
                    checked={expCurrent}
                    onChange={(e) => setExpCurrent(e.target.checked)}
                    className="h-4 w-4 rounded border-navy-900/20 text-gold-500 focus:ring-gold-400"
                  />
                  Poste actuel
                </label>
              </Field>
              <Field label="Description" full>
                <textarea
                  rows={2}
                  value={expDescription}
                  onChange={(e) => setExpDescription(e.target.value)}
                  className="form-input"
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={savingExperience}
              className="mt-6 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
            >
              {savingExperience ? "Ajout..." : "Ajouter"}
            </button>
          </form>
        )}

        <div className="flex flex-col gap-3">
          {(!profile || profile.experiences.length === 0) && !showExperienceForm && (
            <p className="rounded-xl border border-navy-900/10 bg-white px-5 py-6 text-center text-sm text-navy-900/50">
              Aucune expérience renseignée pour le moment.
            </p>
          )}

          {profile?.experiences.map((experience) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              onDelete={() => handleDeleteExperience(experience.id)}
            />
          ))}
        </div>

        <div className="mt-10 mb-4">
          <h2 className="text-base font-semibold text-navy-900">
            Mes documents (CV, diplômes, certificats)
          </h2>
          <p className="mt-1 text-sm text-navy-900/50">
            Ces documents sont visibles par les recruteurs pour les offres auxquelles vous postulez.
          </p>
        </div>

        <form
          onSubmit={handleUploadDocument}
          className="mb-4 flex flex-col gap-3 rounded-2xl border border-navy-900/10 bg-white p-6 sm:flex-row sm:items-end"
        >
          <Field label="Type de document">
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as DocumentType)}
              className="form-input"
            >
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Fichier (PDF, JPG ou PNG)" full>
            <input
              required
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setDocumentFile(e.target.files?.[0] ?? null)}
              className="form-input file:mr-3 file:rounded-md file:border-0 file:bg-navy-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
            />
          </Field>

          <button
            type="submit"
            disabled={uploadingDocument}
            className="shrink-0 rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400 disabled:opacity-60"
          >
            {uploadingDocument ? "Envoi..." : "Téléverser"}
          </button>
        </form>

        <div className="flex flex-col gap-3">
          {(!profile || profile.documents.length === 0) && (
            <p className="rounded-xl border border-navy-900/10 bg-white px-5 py-6 text-center text-sm text-navy-900/50">
              Aucun document téléversé pour le moment.
            </p>
          )}

          {profile?.documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={() => handleDeleteDocument(document.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function DocumentCard({
  document: doc,
  onDelete,
}: {
  document: CandidateDocument;
  onDelete: () => void;
}) {
  const typeLabel = documentTypes.find((type) => type.value === doc.type)?.label;

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-navy-900/10 bg-white px-5 py-4">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-900/40">
          {typeLabel}
        </p>
        <a
          href={`${API_URL}${doc.fileUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate font-medium text-navy-900 hover:underline"
        >
          {doc.fileName}
        </a>
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="shrink-0 rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
      >
        Supprimer
      </button>
    </div>
  );
}

function ExperienceCard({
  experience,
  onDelete,
}: {
  experience: Experience;
  onDelete: () => void;
}) {
  const start = new Date(experience.startDate).toLocaleDateString("fr-FR", {
    month: "short",
    year: "numeric",
  });
  const end = experience.current
    ? "Aujourd'hui"
    : experience.endDate
      ? new Date(experience.endDate).toLocaleDateString("fr-FR", { month: "short", year: "numeric" })
      : "—";

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-navy-900/10 bg-white px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="font-semibold text-navy-900">{experience.title}</p>
        <p className="text-xs text-navy-900/50">
          {experience.company} · {start} — {end}
        </p>
        {experience.description && (
          <p className="mt-2 text-sm text-navy-900/70">{experience.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="shrink-0 self-start rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
      >
        Supprimer
      </button>
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
      {label && <span className="text-sm font-medium text-navy-900">{label}</span>}
      {children}
    </label>
  );
}
