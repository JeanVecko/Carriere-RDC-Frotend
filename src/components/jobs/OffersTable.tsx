import Link from "next/link";
import {
  getOfferClosingDate,
  getOfferStatus,
  offerStatusColors,
  offerStatusLabels,
  type JobOffer,
  type OfferStatus,
} from "@/lib/mock-data";

export function StatusLegend() {
  const statuses: OfferStatus[] = ["current", "closing-soon", "expired", "unspecified"];

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-navy-900/70">
      {statuses.map((status) => (
        <span key={status} className="flex items-center gap-1.5">
          <StatusFlag color={offerStatusColors[status]} />
          {offerStatusLabels[status]}
        </span>
      ))}
    </div>
  );
}

export default function OffersTable({ offers }: { offers: JobOffer[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-navy-900/10 bg-white">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-navy-900/10 text-left text-xs font-semibold uppercase tracking-wide text-navy-900/40">
            <th className="px-4 py-3 font-semibold">Fonction</th>
            <th className="px-4 py-3 font-semibold">Organisme</th>
            <th className="px-4 py-3 font-semibold">Lieu</th>
            <th className="px-4 py-3 font-semibold">Publiée</th>
            <th className="px-4 py-3 font-semibold">Clôture</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {offers.map((offer, index) => (
            <tr
              key={offer.id}
              className={index % 2 === 1 ? "bg-navy-900/[0.02]" : undefined}
            >
              <td className="px-4 py-4">
                <Link
                  href={`/offres/${offer.id}`}
                  className="group flex items-start gap-3"
                >
                  <span className="mt-1">
                    <StatusFlag color={offerStatusColors[getOfferStatus(offer)]} />
                  </span>
                  <span className="font-semibold text-navy-900 group-hover:underline">
                    {offer.title}
                  </span>
                </Link>
              </td>
              <td className="px-4 py-4 align-top text-navy-900/70">
                {offer.company}
              </td>
              <td className="px-4 py-4 align-top text-navy-900/70">
                {offer.city}
              </td>
              <td className="px-4 py-4 align-top text-navy-900/70">
                {offer.publishedDate}
              </td>
              <td className="px-4 py-4 align-top text-navy-900/70">
                {getOfferClosingDate(offer)}
              </td>
              <td className="px-4 py-4 align-top text-right">
                {offer.isVerified && (
                  <span
                    title="Entreprise vérifiée"
                    className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gold-400/20 text-gold-600"
                  >
                    <VerifiedIcon />
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusFlag({ color }: { color: string }) {
  return (
    <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
      <path d="M0 0H12L18 6.5L12 13H0V0Z" fill={color} />
    </svg>
  );
}

function VerifiedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 2l2.2 1.6 2.7-.3 1 2.5 2.3 1.4-.7 2.6.7 2.6-2.3 1.4-1 2.5-2.7-.3L10 18l-2.2-1.6-2.7.3-1-2.5-2.3-1.4.7-2.6L1.8 7.2l2.3-1.4 1-2.5 2.7.3L10 2z"
        fill="currentColor"
      />
      <path
        d="M7 10l2 2 4-4"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
