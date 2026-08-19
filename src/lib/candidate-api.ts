const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type CandidateApplication = {
  id: string;
  atsResult: "MATCH" | "PARTIAL" | "NO_MATCH";
  status: "RECEIVED" | "IN_PROGRESS" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  jobOffer: {
    id: string;
    title: string;
    city: string;
    contractType: string;
    organization: { name: string };
  };
};

export async function fetchMyApplications(token: string): Promise<CandidateApplication[]> {
  const res = await fetch(`${API_URL}/api/applications/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? `Erreur serveur (${res.status}).`);
  }

  return res.json();
}

export type Experience = {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string | null;
};

export type DocumentType = "CV" | "DIPLOMA" | "CERTIFICATE";

export type CandidateDocument = {
  id: string;
  type: DocumentType;
  fileUrl: string;
  fileName: string;
  createdAt: string;
};

export type CandidateProfile = {
  id: string;
  phone: string | null;
  city: string | null;
  birthDate: string | null;
  bio: string | null;
  experiences: Experience[];
  documents: CandidateDocument[];
} | null;

async function candidateFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
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

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

export function fetchMyProfile(token: string): Promise<CandidateProfile> {
  return candidateFetch("/api/candidates/me/profile", token);
}

export function updateMyProfile(
  token: string,
  data: { phone?: string; city?: string; birthDate?: string; bio?: string }
): Promise<CandidateProfile> {
  return candidateFetch("/api/candidates/me/profile", token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function addExperience(
  token: string,
  data: {
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
  }
): Promise<Experience> {
  return candidateFetch("/api/candidates/me/experiences", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deleteExperience(token: string, experienceId: string): Promise<void> {
  return candidateFetch(`/api/candidates/me/experiences/${experienceId}`, token, {
    method: "DELETE",
  });
}

export function uploadDocument(
  token: string,
  type: DocumentType,
  file: File
): Promise<CandidateDocument> {
  const formData = new FormData();
  formData.append("type", type);
  formData.append("file", file);

  return candidateFetch("/api/candidates/me/documents", token, {
    method: "POST",
    body: formData,
  });
}

export function deleteDocument(token: string, documentId: string): Promise<void> {
  return candidateFetch(`/api/candidates/me/documents/${documentId}`, token, {
    method: "DELETE",
  });
}
