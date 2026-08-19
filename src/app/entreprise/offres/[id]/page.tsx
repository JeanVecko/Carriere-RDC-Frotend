"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken, type AuthUser } from "@/lib/auth-client";
import { fetchApplicationsForOffer, type JobOfferApplication } from "@/lib/company-api";
import { fetchJobOffer, type ApiJobOffer } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const statusLabels: Record<JobOfferApplication["status"], string> = {
  RECEIVED: "Reçue",
  IN_PROGRESS: "En cours",
  ACCEPTED: "Retenue",
  REJECTED: "Non retenue",
};

export default function OfferApplicationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [offer, setOffer] = useState<ApiJobOffer | null>(null);
  const [applications, setApplications] = useState<JobOfferApplication[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getToken();

    if (
      !storedUser ||
      !storedToken ||
      (storedUser.role !== "COMPANY" && storedUser.role !== "TRAINING_ORG" && storedUser.role !== "ADMIN")
    ) {
      router.replace("/connexion");
      return;
    }

    setUser(storedUser);
    setChecking(false);

    Promise.all([fetchJobOffer(id), fetchApplicationsForOffer(storedToken, id)])
      .then(([offerData, applicationsData]) => {
        setOffer(offerData);
        setApplications(applicationsData);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Une erreur est survenue."));
  }, [id, router]);

  if (checking) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 py-20 text-sm text-navy-900/50">
        Vérification de l&apos;accès...
      </div>
    );
  }

  const matching = applications.filter((application) => application.atsResult !== "NO_MATCH");
  const nonMatching = applications.filter((application) => application.atsResult === "NO_MATCH");

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <section className="mx-4 mt-4 rounded-3xl bg-navy-900 px-6 py-8 sm:mx-6 sm:mt-6 sm:px-8">
        <Link href="/entreprise" className="text-xs font-medium text-white/60 hover:text-white">
          ← Retour au tableau de bord
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-white">
          {offer ? offer.title : "Candidatures"}
        </h1>
        <p className="mt-1 text-sm text-white/60">
          {applications.length} candidature{applications.length > 1 ? "s" : ""} reçue
          {applications.length > 1 ? "s" : ""}
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {error && (
          <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <div className="mb-10">
          <h2 className="mb-4 text-base font-semibold text-navy-900">
            Profils correspondants ({matching.length})
          </h2>
          {matching.length === 0 ? (
            <p className="rounded-2xl border border-navy-900/10 bg-white px-5 py-6 text-center text-sm text-navy-900/50">
              Aucun profil correspondant pour le moment.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {matching.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-base font-semibold text-navy-900">
            Profils ne correspondant pas ({nonMatching.length})
          </h2>
          {nonMatching.length === 0 ? (
            <p className="rounded-2xl border border-navy-900/10 bg-white px-5 py-6 text-center text-sm text-navy-900/50">
              Aucun profil dans cette catégorie.
            </p>
          ) : (
            <div className="flex flex-col gap-3 opacity-80">
              {nonMatching.map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function ApplicationCard({ application }: { application: JobOfferApplication }) {
  const scoreColor =
    application.atsScore >= 75
      ? "text-green-700 bg-green-100"
      : application.atsScore >= 50
        ? "text-amber-700 bg-amber-100"
        : "text-red-700 bg-red-100";

  return (
    <div className="rounded-2xl border border-navy-900/10 bg-white px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-navy-900">{application.candidate.name}</p>
          <p className="text-xs text-navy-900/50">
            {application.candidate.email}
            {application.candidate.candidateProfile?.phone &&
              ` · ${application.candidate.candidateProfile.phone}`}
            {application.candidate.candidateProfile?.city &&
              ` · ${application.candidate.candidateProfile.city}`}
          </p>
          <p className="mt-1 text-xs text-navy-900/40">
            Candidature du {new Date(application.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className={`rounded-full px-3 py-1.5 text-sm font-bold ${scoreColor}`}>
            {application.atsScore}% match
          </span>
          <span className="rounded-full bg-navy-900/10 px-3 py-1.5 text-xs font-medium text-navy-900/70">
            {statusLabels[application.status]}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-navy-900/5 pt-4">
        <a
          href={`${API_URL}${application.cvUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-navy-900/15 px-3 py-1 text-xs font-semibold text-navy-900 hover:bg-navy-900/5"
        >
          CV envoyé
        </a>
        {application.candidate.candidateProfile?.documents.map((document) => (
          <a
            key={document.id}
            href={`${API_URL}${document.fileUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-navy-900/15 px-3 py-1 text-xs font-semibold text-navy-900 hover:bg-navy-900/5"
          >
            {document.type === "CV" ? "CV (profil)" : document.type === "DIPLOMA" ? "Diplôme" : "Certificat"}
          </a>
        ))}
        {application.candidate.candidateProfile?.experiences.map((experience) => (
          <span
            key={experience.id}
            className="rounded-full bg-navy-900/5 px-3 py-1 text-xs text-navy-900/60"
          >
            {experience.title} · {experience.company}
          </span>
        ))}
      </div>
    </div>
  );
}
