const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type AdminOrganization = {
  id: string;
  name: string;
  sector: string | null;
  city: string | null;
  description: string | null;
  logoUrl: string | null;
  isVerified: boolean;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE" | "COMPANY" | "TRAINING_ORG" | "ADMIN";
  status: "PENDING" | "VALIDATED" | "SUSPENDED";
  createdAt: string;
  organization: AdminOrganization | null;
};

export type AdminStats = {
  candidateCount: number;
  companyCount: number;
  trainingOrgCount: number;
  pendingCount: number;
  totalVisits: number;
};

async function adminFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
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

export function fetchAdminStats(token: string): Promise<AdminStats> {
  return adminFetch("/api/admin/stats", token);
}

export function fetchUsersByRole(
  token: string,
  role: "CANDIDATE" | "COMPANY" | "TRAINING_ORG"
): Promise<AdminUser[]> {
  return adminFetch(`/api/admin/users?role=${role}`, token);
}

export function fetchPendingAccounts(token: string): Promise<AdminUser[]> {
  return adminFetch("/api/admin/accounts/pending", token);
}

export function validateAccount(token: string, userId: string): Promise<AdminUser> {
  return adminFetch(`/api/admin/accounts/${userId}/validate`, token, { method: "PATCH" });
}

export function suspendAccount(token: string, userId: string): Promise<AdminUser> {
  return adminFetch(`/api/admin/accounts/${userId}/suspend`, token, { method: "PATCH" });
}

export function deleteUser(token: string, userId: string): Promise<void> {
  return adminFetch(`/api/admin/users/${userId}`, token, { method: "DELETE" });
}
