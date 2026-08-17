"use client";

import { useState, type FormEvent } from "react";
import { educationLevels } from "@/lib/mock-data";
import type { JobOffer } from "@/lib/mock-data";

export default function ApplicationForm({ offer }: { offer: JobOffer }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // La soumission réelle (API + stockage du CV) sera branchée avec le backend.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-navy-900/10 bg-white p-8 text-center">
        <h3 className="text-lg font-semibold text-navy-900">
          Candidature envoyée
        </h3>
        <p className="mt-2 text-sm text-navy-900/60">
          Votre candidature pour « {offer.title} » a bien été enregistrée.
          Vous pouvez suivre son statut depuis votre espace candidat.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-navy-900/10 bg-white p-6 sm:p-8"
    >
      <h3 className="text-lg font-semibold text-navy-900">
        Postuler à cette offre
      </h3>
      <p className="mt-1 text-sm text-navy-900/60">
        Ce formulaire structuré permet le tri automatique (ATS) de votre
        candidature selon les critères du poste.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Nom complet">
          <input
            required
            type="text"
            className="form-input"
            placeholder="Votre nom et prénom"
          />
        </Field>

        <Field label="E-mail">
          <input
            required
            type="email"
            className="form-input"
            placeholder="vous@exemple.com"
          />
        </Field>

        <Field label="Niveau d'études">
          <select required defaultValue="" className="form-input">
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
            className="form-input"
            placeholder={offer.ats.keySkills.join(", ")}
          />
        </Field>

        <Field label="CV (PDF)" full>
          <input
            required
            type="file"
            accept=".pdf"
            className="form-input file:mr-3 file:rounded-md file:border-0 file:bg-navy-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white"
          />
        </Field>

        {offer.ats.preScreeningQuestions.map((question, index) => (
          <Field key={index} label={question} full>
            <textarea required rows={2} className="form-input" />
          </Field>
        ))}
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-lg bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400 sm:w-auto"
      >
        Envoyer ma candidature
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
