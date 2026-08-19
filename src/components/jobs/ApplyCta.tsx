"use client";

import { useAppliedOffers } from "@/components/jobs/applied-offers-context";

export default function ApplyCta({ offerId }: { offerId: string }) {
  const { appliedOfferIds } = useAppliedOffers();

  if (appliedOfferIds.has(offerId)) {
    return (
      <span className="mt-6 block w-full rounded-lg bg-green-100 px-6 py-3 text-center text-sm font-semibold text-green-700">
        Candidature envoyée
      </span>
    );
  }

  return (
    <a
      href="#candidature"
      className="mt-6 block w-full rounded-lg bg-gold-500 px-6 py-3 text-center text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
    >
      Postuler maintenant
    </a>
  );
}
