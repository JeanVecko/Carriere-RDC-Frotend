import Link from "next/link";
import ApplyBadge from "@/components/jobs/ApplyBadge";
import {
  getOfferClosingDate,
  getOfferStatus,
  offerStatusColors,
  offerStatusLabels,
  type JobOffer,
  type OfferStatus,
} from "@/lib/offers";

export function StatusLegend() {
  const statuses: OfferStatus[] = ["current", "closing-soon", "expired", "unspecified"];

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {statuses.map((status) => {
        const color = offerStatusColors[status];
        return (
          <span
            key={status}
            className="flex items-center gap-1.5 rounded-full border px-3 py-1"
            style={{ borderColor: color, backgroundColor: `${color}1a` }}
          >
            <StatusFlag color={color} />
            <span style={{ color }} className="font-medium">
              {offerStatusLabels[status]}
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function OffersTable({ offers }: { offers: JobOffer[] }) {
  return (
    <div className="flex flex-col gap-3">
      {offers.map((offer) => (
        <Link
          key={offer.id}
          href={`/offres/${offer.id}`}
          className="group flex flex-col gap-3 rounded-full border-2 border-navy-900/40 bg-white px-5 py-3 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 items-center gap-3">
            <StatusFlag color={offerStatusColors[getOfferStatus(offer.deadlineIso)]} />
            <div className="min-w-0">
              <p className="truncate font-semibold text-navy-900 group-hover:underline">
                {offer.title}
              </p>
              <p className="truncate text-xs text-navy-900/50">
                {offer.company} · {offer.city} · Clôture {getOfferClosingDate(offer.deadlineIso)}
              </p>
              {offer.reference && (
                <p className="truncate text-xs text-navy-900/30">{offer.reference}</p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 pl-8 sm:pl-0">
            {offer.isVerified && (
              <span
                title="Entreprise vérifiée"
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold-400/20 text-gold-600"
              >
                <VerifiedIcon />
              </span>
            )}
            <ApplyBadge offerId={offer.id} />
          </div>
        </Link>
      ))}
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
