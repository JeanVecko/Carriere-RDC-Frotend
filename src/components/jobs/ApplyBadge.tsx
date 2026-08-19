"use client";

import { useAppliedOffers } from "@/components/jobs/applied-offers-context";

export default function ApplyBadge({ offerId }: { offerId: string }) {
  const { appliedOfferIds } = useAppliedOffers();

  if (appliedOfferIds.has(offerId)) {
    return (
      <span className="inline-block rounded-full bg-green-100 px-4 py-1.5 text-xs font-semibold text-green-700">
        Déjà postulé
      </span>
    );
  }

  return (
    <span className="inline-block rounded-full bg-navy-900 px-4 py-1.5 text-xs font-semibold text-white transition-colors group-hover:bg-navy-800">
      Postuler
    </span>
  );
}
