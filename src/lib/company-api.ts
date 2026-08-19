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
