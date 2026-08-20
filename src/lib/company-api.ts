const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type MyOrganization = {
  id: string;
  name: string;
  sector: string | null;
  city: string | null;
  description: string | null;
  logoUrl: string | null;
  isVerified: boolean;
};

export type MyJobOffer = {
  id: string;
  title: string;
  city: string;
  contractType: string;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  createdAt: string;
  deadline: string | null;
  _count: { applications: number };
};

async function companyFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
      ...(typeof init?.body === "string" ? { "Content-Type": "application/json" } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? `Erreur serveur (${res.status}).`);
  }

  return res.json();
}

export function fetchMyOrganization(token: string): Promise<MyOrganization> {
  return companyFetch("/api/organizations/me", token);
}

export function saveMyOrganization(
  token: string,
  data: { name: string; sector?: string; city?: string; description?: string; logoUrl?: string }
): Promise<MyOrganization> {
  return companyFetch("/api/organizations/me", token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function fetchMyJobOffers(token: string): Promise<MyJobOffer[]> {
  return companyFetch("/api/job-offers/mine", token);
}

export type NewJobOfferInput = {
  title: string;
  sector: string;
  city: string;
  contractType: string;
  description: string;
  missions: string[];
  atsCriteria: {
    minEducationLevel: string;
    minExperienceYears: number;
    requiredLanguages: string[];
    keySkills: string[];
    niceToHave: string[];
  };
  preScreeningQuestions: string[];
  deadline?: string;
  status: "DRAFT" | "PUBLISHED";
};

export function createJobOffer(
  token: string,
  data: NewJobOfferInput
): Promise<{ id: string; status: string }> {
  return companyFetch("/api/job-offers", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function createJobOfferFromDocument(
  token: string,
  data: {
    title: string;
    sector: string;
    city: string;
    contractType: string;
    deadline?: string;
    status: "DRAFT" | "PUBLISHED";
    keySkills?: string;
    document: File;
  }
): Promise<{ id: string; status: string }> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("sector", data.sector);
  formData.append("city", data.city);
  formData.append("contractType", data.contractType);
  if (data.deadline) formData.append("deadline", data.deadline);
  if (data.keySkills) formData.append("keySkills", data.keySkills);
  formData.append("status", data.status);
  formData.append("document", data.document);

  return companyFetch("/api/job-offers/upload", token, {
    method: "POST",
    body: formData,
  });
}

export type ApplicationCandidateDocument = {
  id: string;
  type: "CV" | "DIPLOMA" | "CERTIFICATE";
  fileUrl: string;
  fileName: string;
};

export type ApplicationCandidateExperience = {
  id: string;
  title: string;
  company: string;
};

export type JobOfferApplication = {
  id: string;
  cvUrl: string;
  atsResult: "MATCH" | "PARTIAL" | "NO_MATCH";
  atsScore: number;
  status: "RECEIVED" | "IN_PROGRESS" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  candidate: {
    id: string;
    name: string;
    email: string;
    candidateProfile: {
      phone: string | null;
      city: string | null;
      documents: ApplicationCandidateDocument[];
      experiences: ApplicationCandidateExperience[];
    } | null;
  };
};

export function fetchApplicationsForOffer(
  token: string,
  offerId: string
): Promise<JobOfferApplication[]> {
  return companyFetch(`/api/job-offers/${offerId}/applications`, token);
}

export type NewTrainingInput = {
  title: string;
  domain: string;
  objectives: string;
  program: string;
  duration: string;
  modality: "ONSITE" | "ONLINE" | "HYBRID";
  sessionDates: string[];
  price?: string;
  location?: string;
  status: "DRAFT" | "PUBLISHED";
  poster?: File;
};

export function createTraining(
  token: string,
  data: NewTrainingInput
): Promise<{ id: string; status: string }> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("domain", data.domain);
  formData.append("objectives", data.objectives);
  formData.append("program", data.program);
  formData.append("duration", data.duration);
  formData.append("modality", data.modality);
  formData.append("sessionDates", JSON.stringify(data.sessionDates));
  if (data.price) formData.append("price", data.price);
  if (data.location) formData.append("location", data.location);
  formData.append("status", data.status);
  if (data.poster) formData.append("poster", data.poster);

  return companyFetch("/api/trainings", token, {
    method: "POST",
    body: formData,
  });
}

export type MyTraining = {
  id: string;
  title: string;
  domain: string;
  modality: "ONSITE" | "ONLINE" | "HYBRID";
  duration: string;
  location: string | null;
  posterUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  createdAt: string;
};

export function fetchMyTrainings(token: string): Promise<MyTraining[]> {
  return companyFetch("/api/trainings/mine", token);
}
