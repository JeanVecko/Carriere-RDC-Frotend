import Link from "next/link";
import type { JobOffer } from "@/lib/mock-data";

export default function JobCard({ offer }: { offer: JobOffer }) {
  return (
    <Link
      href={`/offres/${offer.id}`}
      className="block rounded-xl border border-navy-900/10 bg-white p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-navy-900">
            {offer.title}
          </h3>
          <p className="mt-0.5 text-sm text-navy-900/70">{offer.company}</p>
        </div>
        {offer.isVerified && (
          <span className="whitespace-nowrap rounded-full bg-gold-400/20 px-2.5 py-1 text-xs font-medium text-gold-600">
            Entreprise vérifiée
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-navy-900/60">
        <span className="rounded-full bg-navy-900/5 px-2.5 py-1">
          {offer.sector}
        </span>
        <span className="rounded-full bg-navy-900/5 px-2.5 py-1">
          {offer.city}
        </span>
        <span className="rounded-full bg-navy-900/5 px-2.5 py-1">
          {offer.contractType}
        </span>
      </div>

      <p className="mt-4 text-xs text-navy-900/40">{offer.publishedAt}</p>
    </Link>
  );
}
