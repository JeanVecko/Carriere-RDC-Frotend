import type { ApiJobOffer } from "@/lib/api";

export type AtsCriteria = {
  minEducationLevel: string;
  minExperienceYears: number;
  requiredLanguages: string[];
  keySkills: string[];
  niceToHave: string[];
  preScreeningQuestions: string[];
};

export type JobOffer = {
  id: string;
  reference: string;
  title: string;
  company: string;
  sector: string;
  city: string;
  contractType: string;
  isVerified: boolean;
  description: string;
  missions: string[];
  ats: AtsCriteria;
  publishedAtIso: string | null;
  deadlineIso: string | null;
};

export function toDisplayOffer(offer: ApiJobOffer): JobOffer {
  return {
    id: offer.id,
    reference: offer.reference ?? "",
    title: offer.title,
    company: offer.organization.name,
    sector: offer.sector,
    city: offer.city,
    contractType: offer.contractType,
    isVerified: offer.organization.isVerified,
    description: offer.description,
    missions: offer.missions,
    ats: {
      minEducationLevel: offer.atsCriteria.minEducationLevel,
      minExperienceYears: offer.atsCriteria.minExperienceYears,
      requiredLanguages: offer.atsCriteria.requiredLanguages,
      keySkills: offer.atsCriteria.keySkills,
      niceToHave: offer.atsCriteria.niceToHave,
      preScreeningQuestions: offer.preScreeningQuestions,
    },
    publishedAtIso: offer.publishedAt,
    deadlineIso: offer.deadline,
  };
}

export const sectors = [
  "Logistique & Transport",
  "Finance & Comptabilité",
  "Communication & Marketing",
  "Informatique & Télécoms",
  "Santé",
  "Éducation & Formation",
];

export const cities = ["Kinshasa", "Lubumbashi", "Goma", "Bukavu", "Matadi"];

export const contractTypes = ["CDI", "CDD", "Stage", "Freelance", "Temps partiel"];

export const educationLevels = [
  "Sans diplôme",
  "Diplôme d'État",
  "Bac+2",
  "Bac+3",
  "Bac+4",
  "Bac+5 et plus",
];

export type OfferStatus = "current" | "closing-soon" | "expired" | "unspecified";

export function getOfferStatus(deadlineIso: string | null): OfferStatus {
  if (!deadlineIso) return "unspecified";

  const diffDays = Math.ceil((new Date(deadlineIso).getTime() - Date.now()) / 86_400_000);

  if (diffDays < 0) return "expired";
  if (diffDays <= 3) return "closing-soon";
  return "current";
}

function formatDotDate(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
}

export function getOfferClosingDate(deadlineIso: string | null): string {
  return deadlineIso ? formatDotDate(deadlineIso) : "Non précisée";
}

export function getPublishedDate(publishedAtIso: string | null): string {
  return publishedAtIso ? formatDotDate(publishedAtIso) : "—";
}

export const offerStatusLabels: Record<OfferStatus, string> = {
  current: "En cours",
  "closing-soon": "Moins de 3 jours",
  expired: "Expirée",
  unspecified: "Non précisé",
};

export const offerStatusColors: Record<OfferStatus, string> = {
  current: "#16a34a",
  "closing-soon": "#f59e0b",
  expired: "#dc2626",
  unspecified: "#9ca3af",
};
