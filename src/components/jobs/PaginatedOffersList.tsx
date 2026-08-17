"use client";

import { useState } from "react";
import OffersTable from "@/components/jobs/OffersTable";
import type { JobOffer } from "@/lib/mock-data";

const PAGE_SIZE = 15;

export default function PaginatedOffersList({ offers }: { offers: JobOffer[] }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(offers.length / PAGE_SIZE));

  const start = (page - 1) * PAGE_SIZE;
  const currentOffers = offers.slice(start, start + PAGE_SIZE);

  function goToPage(next: number) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-navy-900/60">
          Affichage {start + 1}-{Math.min(start + PAGE_SIZE, offers.length)} sur{" "}
          {offers.length} offres d&apos;emploi
        </h2>
      </div>

      <OffersTable offers={currentOffers} />

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className="rounded-lg border border-navy-900/10 px-4 py-2 text-sm font-medium text-navy-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Précédent
        </button>

        <span className="text-sm text-navy-900/60">
          Page {page} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          className="rounded-lg border border-navy-900/10 px-4 py-2 text-sm font-medium text-navy-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
