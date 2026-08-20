"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser, getToken, type AuthUser } from "@/lib/auth-client";
import {
  fetchMyJobOffers,
  fetchMyOrganization,
  fetchMyTrainings,
  type MyJobOffer,
  type MyOrganization,
  type MyTraining,
} from "@/lib/company-api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const statusLabels: Record<MyJobOffer["status"], string> = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publiée",
  CLOSED: "Clôturée",
};

const statusStyles: Record<MyJobOffer["status"], string> = {
  DRAFT: "bg-navy-900/10 text-navy-900/70",
  PUBLISHED: "bg-green-100 text-green-700",
  CLOSED: "bg-red-100 text-red-700",
};

const modalityLabels: Record<MyTraining["modality"], string> = {
  ONSITE: "Présentiel",
  ONLINE: "En ligne",
  HYBRID: "Hybride",
};

export default function CompanyHomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [organization, setOrganization] = useState<MyOrganization | null>(null);
  const [jobOffers, setJobOffers] = useState<MyJobOffer[]>([]);
  const [trainings, setTrainings] = useState<MyTraining[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getToken();

    if (
      !storedUser ||
      !storedToken ||
      (storedUser.role !== "COMPANY" && storedUser.role !== "TRAINING_ORG")
    ) {
      router.replace("/connexion");
      return;
    }

    setUser(storedUser);
    setChecking(false);

    Promise.all([
      fetchMyOrganization(storedToken),
      fetchMyJobOffers(storedToken).catch(() => []),
      fetchMyTrainings(storedToken).catch(() => []),
    ])
      .then(([org, offers, trainingsList]) => {
        setOrganization(org);
        setJobOffers(offers);
        setTrainings(trainingsList);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Une erreur est survenue."));
  }, [router]);

  if (checking) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 py-20 text-sm text-navy-900/50">
        Vérification de l&apos;accès...
      </div>
    );
  }

  const totalApplications = jobOffers.reduce((sum, offer) => sum + offer._count.applications, 0);
  const publishedCount = jobOffers.filter((offer) => offer.status === "PUBLISHED").length;
  const publishedTrainingsCount = trainings.filter((t) => t.status === "PUBLISHED").length;

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <section className="mx-4 mt-4 rounded-3xl bg-navy-900 px-6 py-8 sm:mx-6 sm:mt-6 sm:px-8">
        <h1 className="text-2xl font-bold text-white">
          Bienvenue, {organization?.name ?? user?.name} 👋
        </h1>
        <p className="mt-1 text-sm text-white/60">
          {organization?.isVerified
            ? "Votre compte est vérifié. Voici l'évolution de vos offres publiées."
            : "Votre compte est en attente de validation par un administrateur avant publication."}
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        {error && (
          <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Offres publiées" value={publishedCount} />
          <StatCard label="Total des offres" value={jobOffers.length} />
          <StatCard label="Formations publiées" value={publishedTrainingsCount} />
          <StatCard label="Candidatures reçues" value={totalApplications} accent />
        </div>

        <div className="mt-10 mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-navy-900">Mes offres d&apos;emploi</h2>
          <Link
            href="/publier"
            className="rounded-full bg-navy-900 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy-800"
          >
            + Publier une offre
          </Link>
        </div>

        {jobOffers.length === 0 ? (
          <p className="rounded-2xl border border-navy-900/10 bg-white px-5 py-8 text-center text-sm text-navy-900/50">
            Vous n&apos;avez encore publié aucune offre.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-navy-900/10 bg-white">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-navy-900/10 text-left text-xs font-semibold uppercase tracking-wide text-navy-900/40">
                  <th className="px-5 py-3">Intitulé</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3">Candidatures</th>
                  <th className="px-5 py-3">Publiée le</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {jobOffers.map((offer, index) => (
                  <tr key={offer.id} className={index % 2 === 1 ? "bg-navy-900/[0.02]" : undefined}>
                    <td className="px-5 py-3 font-medium text-navy-900">
                      <Link href={`/entreprise/offres/${offer.id}`} className="hover:underline">
                        {offer.title}
                      </Link>
                      <p className="text-xs font-normal text-navy-900/40">
                        {offer.city} · {offer.contractType}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[offer.status]}`}
                      >
                        {statusLabels[offer.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-navy-900/70">{offer._count.applications}</td>
                    <td className="px-5 py-3 text-navy-900/50">
                      {new Date(offer.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/entreprise/offres/${offer.id}`}
                        className="rounded-full bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy-800"
                      >
                        Voir les candidatures
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-10 mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-navy-900">Mes formations</h2>
          <Link
            href="/publier-formation"
            className="rounded-full bg-navy-900 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-navy-800"
          >
            + Publier une formation
          </Link>
        </div>

        {trainings.length === 0 ? (
          <p className="rounded-2xl border border-navy-900/10 bg-white px-5 py-8 text-center text-sm text-navy-900/50">
            Vous n&apos;avez encore publié aucune formation.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-navy-900/10 bg-white">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-navy-900/10 text-left text-xs font-semibold uppercase tracking-wide text-navy-900/40">
                  <th className="px-5 py-3">Intitulé</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3">Modalité</th>
                  <th className="px-5 py-3">Publiée le</th>
                  <th className="px-5 py-3">Affiche</th>
                </tr>
              </thead>
              <tbody>
                {trainings.map((training, index) => (
                  <tr key={training.id} className={index % 2 === 1 ? "bg-navy-900/[0.02]" : undefined}>
                    <td className="px-5 py-3 font-medium text-navy-900">
                      {training.title}
                      <p className="text-xs font-normal text-navy-900/40">
                        {training.domain} · {training.duration}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[training.status]}`}
                      >
                        {statusLabels[training.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-navy-900/70">
                      {modalityLabels[training.modality]}
                      {training.location ? ` · ${training.location}` : ""}
                    </td>
                    <td className="px-5 py-3 text-navy-900/50">
                      {new Date(training.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-5 py-3">
                      {training.posterUrl ? (
                        <a
                          href={`${API_URL}${training.posterUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full border border-navy-900/15 px-3 py-1 text-xs font-semibold text-navy-900 hover:bg-navy-900/5"
                        >
                          Voir
                        </a>
                      ) : (
                        <span className="text-xs text-navy-900/30">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-navy-900/10 bg-white px-4 py-4">
      <p className="text-xs font-medium text-navy-900/50">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? "text-gold-600" : "text-navy-900"}`}>
        {value}
      </p>
    </div>
  );
}
