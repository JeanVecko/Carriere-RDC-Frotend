const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type ApiOrganization = {
  id: string;
  name: string;
  sector: string | null;
  city: string | null;
  description: string | null;
  logoUrl: string | null;
  isVerified: boolean;
};

export type ApiAtsCriteria = {
  minEducationLevel: string;
  minExperienceYears: number;
  requiredLanguages: string[];
  keySkills: string[];
  niceToHave: string[];
};

export type ApiJobOffer = {
  id: string;
  organizationId: string;
  organization: ApiOrganization;
  reference: string | null;
  title: string;
  sector: string;
  city: string;
  contractType: string;
  description: string;
  documentUrl: string | null;
  missions: string[];
  atsCriteria: ApiAtsCriteria;
  preScreeningQuestions: string[];
  publishedAt: string | null;
  deadline: string | null;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  publishedByAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function fetchJobOffers(): Promise<ApiJobOffer[]> {
  const res = await fetch(`${API_URL}/api/job-offers`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Impossible de charger les offres d'emploi (${res.status}).`);
  }
  return res.json();
}

export async function fetchJobOffer(id: string): Promise<ApiJobOffer | null> {
  const res = await fetch(`${API_URL}/api/job-offers/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Impossible de charger l'offre d'emploi (${res.status}).`);
  }
  return res.json();
}
