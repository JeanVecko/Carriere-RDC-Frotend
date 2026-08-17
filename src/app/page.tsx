import FiltersPanel from "@/components/jobs/FiltersPanel";
import { StatusLegend } from "@/components/jobs/OffersTable";
import PaginatedOffersList from "@/components/jobs/PaginatedOffersList";
import { cities, mockJobOffers } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <section className="mx-4 mt-4 rounded-[2.5rem] bg-navy-900 pb-10 sm:mx-6 sm:mt-6 sm:pb-14">
        <div className="mx-auto w-full max-w-6xl px-4 pt-8 sm:px-6">
          <h1 className="max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl">
            Trouvez votre prochain emploi en RDC
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/70">
            Offres d&apos;emploi, appels d&apos;offres et formations
            professionnelles, centralisés et vérifiés.
          </p>

          <div className="mt-5 flex flex-col gap-3 rounded-xl bg-white p-3 shadow-lg sm:flex-row">
            <input
              type="text"
              placeholder="Intitulé du poste, mot-clé..."
              className="flex-1 rounded-lg border border-navy-900/10 px-4 py-2.5 text-sm text-navy-900 placeholder:text-navy-900/40 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            <select className="rounded-lg border border-navy-900/10 px-4 py-2.5 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-400">
              <option value="">Toutes les villes</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <button className="rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400">
              Rechercher
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <StatusLegend />

          <div className="flex flex-wrap items-center gap-3">
            <FiltersPanel />
            <select className="form-input w-auto">
              <option>Trier par offres récentes</option>
              <option>Trier par date limite</option>
              <option>Trier par intitulé (A-Z)</option>
            </select>
          </div>
        </div>

        <PaginatedOffersList offers={mockJobOffers} />
      </section>
    </div>
  );
}
