"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken } from "@/lib/auth-client";
import {
  deleteUser,
  fetchAdminStats,
  fetchPendingAccounts,
  fetchUsersByRole,
  suspendAccount,
  validateAccount,
  type AdminStats,
  type AdminUser,
} from "@/lib/admin-api";

type Tab = "CANDIDATE" | "COMPANY" | "TRAINING_ORG";

const tabs: { value: Tab; label: string }[] = [
  { value: "CANDIDATE", label: "Candidats" },
  { value: "COMPANY", label: "Entreprises" },
  { value: "TRAINING_ORG", label: "Organismes de formation" },
];

export default function AdminPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pending, setPending] = useState<AdminUser[]>([]);
  const [usersByRole, setUsersByRole] = useState<Record<Tab, AdminUser[]>>({
    CANDIDATE: [],
    COMPANY: [],
    TRAINING_ORG: [],
  });
  const [activeTab, setActiveTab] = useState<Tab>("CANDIDATE");
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [selectedPending, setSelectedPending] = useState<AdminUser | null>(null);

  const loadData = useCallback(async (authToken: string) => {
    try {
      const [statsData, pendingData, candidates, companies, trainingOrgs] = await Promise.all([
        fetchAdminStats(authToken),
        fetchPendingAccounts(authToken),
        fetchUsersByRole(authToken, "CANDIDATE"),
        fetchUsersByRole(authToken, "COMPANY"),
        fetchUsersByRole(authToken, "TRAINING_ORG"),
      ]);

      setStats(statsData);
      setPending(pendingData);
      setUsersByRole({ CANDIDATE: candidates, COMPANY: companies, TRAINING_ORG: trainingOrgs });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    }
  }, []);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getToken();

    if (!storedUser || !storedToken || storedUser.role !== "ADMIN") {
      router.replace("/connexion");
      return;
    }

    setToken(storedToken);
    setChecking(false);
    loadData(storedToken);
  }, [router, loadData]);

  async function handleValidate(userId: string) {
    if (!token) return;
    setActionId(userId);
    try {
      await validateAccount(token, userId);
      await loadData(token);
      setSelectedPending(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setActionId(null);
    }
  }

  async function handleSuspend(userId: string) {
    if (!token) return;
    setActionId(userId);
    try {
      await suspendAccount(token, userId);
      await loadData(token);
      setSelectedPending(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setActionId(null);
    }
  }

  async function handleDelete(userId: string, label: string) {
    if (!token) return;
    if (!window.confirm(`Supprimer définitivement le compte « ${label} » ? Cette action est irréversible.`)) {
      return;
    }

    setActionId(userId);
    try {
      await deleteUser(token, userId);
      await loadData(token);
      setSelectedPending(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setActionId(null);
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
        <h1 className="text-2xl font-bold text-white">Panneau administrateur</h1>
        <p className="mt-1 text-sm text-white/60">
          Vue d&apos;ensemble des inscriptions et validation des comptes entreprise / organisme.
        </p>
      </section>

      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {error && (
          <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <StatCard label="Visiteurs" value={stats?.totalVisits} />
          <StatCard label="Candidats" value={stats?.candidateCount} />
          <StatCard label="Entreprises" value={stats?.companyCount} />
          <StatCard label="Organismes" value={stats?.trainingOrgCount} />
          <StatCard label="En attente" value={stats?.pendingCount} accent />
        </div>

        <div className="mt-10">
          <h2 className="text-base font-semibold text-navy-900">
            Comptes en attente de validation
          </h2>
          <p className="mt-1 text-sm text-navy-900/50">
            Les entreprises et organismes de formation doivent être validés avant de pouvoir publier.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            {pending.length === 0 && (
              <p className="rounded-xl border border-navy-900/10 bg-white px-5 py-6 text-center text-sm text-navy-900/50">
                Aucun compte en attente pour le moment.
              </p>
            )}
            {pending.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-3 rounded-2xl border border-navy-900/10 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <button
                  type="button"
                  onClick={() => setSelectedPending(user)}
                  className="text-left"
                >
                  <p className="font-semibold text-navy-900 hover:underline">
                    {user.organization?.name ?? user.name}
                  </p>
                  <p className="text-xs text-navy-900/50">
                    {user.email} ·{" "}
                    {user.role === "COMPANY" ? "Entreprise" : "Organisme de formation"}
                  </p>
                </button>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => handleValidate(user.id)}
                    disabled={actionId === user.id}
                    className="rounded-full bg-navy-900 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-50"
                  >
                    Valider
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSuspend(user.id)}
                    disabled={actionId === user.id}
                    className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                  >
                    Refuser
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-base font-semibold text-navy-900">Tous les inscrits</h2>

          <div className="mt-4 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === tab.value
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-navy-900/15 text-navy-900/70 hover:bg-navy-900/5"
                }`}
              >
                {tab.label} ({usersByRole[tab.value].length})
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl border border-navy-900/10 bg-white">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-navy-900/10 text-left text-xs font-semibold uppercase tracking-wide text-navy-900/40">
                  <th className="px-5 py-3">Nom</th>
                  <th className="px-5 py-3">E-mail</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3">Inscrit le</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {usersByRole[activeTab].length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-center text-navy-900/50">
                      Aucun compte pour le moment.
                    </td>
                  </tr>
                )}
                {usersByRole[activeTab].map((user, index) => (
                  <tr key={user.id} className={index % 2 === 1 ? "bg-navy-900/[0.02]" : undefined}>
                    <td className="px-5 py-3 font-medium text-navy-900">
                      {user.organization?.name ?? user.name}
                    </td>
                    <td className="px-5 py-3 text-navy-900/70">{user.email}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-5 py-3 text-navy-900/50">
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id, user.organization?.name ?? user.name)}
                        disabled={actionId === user.id}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {selectedPending && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 px-4"
          onClick={() => setSelectedPending(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-navy-900">
                {selectedPending.organization?.name ?? selectedPending.name}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedPending(null)}
                aria-label="Fermer"
                className="flex h-7 w-7 items-center justify-center rounded-full text-navy-900/50 hover:bg-navy-900/5"
              >
                ✕
              </button>
            </div>

            <dl className="mt-4 space-y-3 text-sm">
              <DetailRow
                label="Type de compte"
                value={selectedPending.role === "COMPANY" ? "Entreprise" : "Organisme de formation"}
              />
              <DetailRow label="Contact" value={selectedPending.name} />
              <DetailRow label="E-mail" value={selectedPending.email} />
              <DetailRow label="Secteur" value={selectedPending.organization?.sector ?? "Non renseigné"} />
              <DetailRow label="Ville" value={selectedPending.organization?.city ?? "Non renseignée"} />
              <DetailRow
                label="Description"
                value={selectedPending.organization?.description ?? "Non renseignée"}
              />
              <DetailRow
                label="Inscrit le"
                value={new Date(selectedPending.createdAt).toLocaleDateString("fr-FR")}
              />
            </dl>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => handleValidate(selectedPending.id)}
                disabled={actionId === selectedPending.id}
                className="flex-1 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800 disabled:opacity-50"
              >
                Valider
              </button>
              <button
                type="button"
                onClick={() => handleSuspend(selectedPending.id)}
                disabled={actionId === selectedPending.id}
                className="flex-1 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                Refuser
              </button>
            </div>
            <button
              type="button"
              onClick={() =>
                handleDelete(
                  selectedPending.id,
                  selectedPending.organization?.name ?? selectedPending.name
                )
              }
              disabled={actionId === selectedPending.id}
              className="mt-2 w-full rounded-full px-4 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              Supprimer définitivement ce compte
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
      <dt className="w-32 shrink-0 text-navy-900/50">{label}</dt>
      <dd className="font-medium text-navy-900">{value}</dd>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value?: number; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-navy-900/10 bg-white px-4 py-4">
      <p className="text-xs font-medium text-navy-900/50">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? "text-gold-600" : "text-navy-900"}`}>
        {value ?? "—"}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: AdminUser["status"] }) {
  const styles: Record<AdminUser["status"], string> = {
    VALIDATED: "bg-green-100 text-green-700",
    PENDING: "bg-amber-100 text-amber-700",
    SUSPENDED: "bg-red-100 text-red-700",
  };
  const labels: Record<AdminUser["status"], string> = {
    VALIDATED: "Validé",
    PENDING: "En attente",
    SUSPENDED: "Suspendu",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
