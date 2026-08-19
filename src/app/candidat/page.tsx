"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken, type AuthUser } from "@/lib/auth-client";
import { fetchMyApplications, type CandidateApplication } from "@/lib/candidate-api";

const atsLabels: Record<CandidateApplication["atsResult"], string> = {
  MATCH: "Correspond",
  PARTIAL: "Partiel",
  NO_MATCH: "Ne correspond pas",
};

const atsStyles: Record<CandidateApplication["atsResult"], string> = {
  MATCH: "bg-green-100 text-green-700",
  PARTIAL: "bg-amber-100 text-amber-700",
  NO_MATCH: "bg-red-100 text-red-700",
};

const statusLabels: Record<CandidateApplication["status"], string> = {
  RECEIVED: "Reçue",
  IN_PROGRESS: "En cours",
  ACCEPTED: "Retenue",
  REJECTED: "Non retenue",
};

const statusStyles: Record<CandidateApplication["status"], string> = {
  RECEIVED: "bg-navy-900/10 text-navy-900/70",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function CandidatePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getToken();

    if (!storedUser || !storedToken || storedUser.role !== "CANDIDATE") {
      router.replace("/connexion");
      return;
    }

    setUser(storedUser);
    setChecking(false);

    fetchMyApplications(storedToken)
      .then(setApplications)
      .catch((err) => setError(err instanceof Error ? err.message : "Une erreur est survenue."));
  }, [router]);

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
        <h1 className="text-2xl font-bold text-white">
          Bonjour {user?.name} 👋
        </h1>
        <p className="mt-1 text-sm text-white/60">
          Suivez ici le statut de vos candidatures aux offres d&apos;emploi.
        </p>
      </section>

      <section className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        {error && (
          <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-semibold text-navy-900">
            Mes candidatures ({applications.length})
          </h2>
          <Link
            href="/"
            className="rounded-full bg-navy-900 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Voir les offres d&apos;emploi
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-2xl border border-navy-900/10 bg-white px-6 py-10 text-center">
            <p className="text-sm text-navy-900/60">
              Vous n&apos;avez encore postulé à aucune offre.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-full bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
            >
              Parcourir les offres d&apos;emploi
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {applications.map((application) => (
              <Link
                key={application.id}
                href={`/offres/${application.jobOffer.id}`}
                className="flex flex-col gap-3 rounded-2xl border border-navy-900/10 bg-white px-5 py-4 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-navy-900">{application.jobOffer.title}</p>
                  <p className="text-xs text-navy-900/50">
                    {application.jobOffer.organization.name} · {application.jobOffer.city} ·{" "}
                    {application.jobOffer.contractType}
                  </p>
                  <p className="mt-1 text-xs text-navy-900/40">
                    Candidature envoyée le{" "}
                    {new Date(application.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${atsStyles[application.atsResult]}`}
                  >
                    {atsLabels[application.atsResult]}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[application.status]}`}
                  >
                    {statusLabels[application.status]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
