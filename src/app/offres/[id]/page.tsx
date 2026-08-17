import { notFound } from "next/navigation";
import ApplicationForm from "@/components/jobs/ApplicationForm";
import { mockJobOffers } from "@/lib/mock-data";

export function generateStaticParams() {
  return mockJobOffers.map((offer) => ({ id: offer.id }));
}

export default async function JobOfferPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = mockJobOffers.find((item) => item.id === id);

  if (!offer) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <section className="bg-navy-900">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {offer.title}
            </h1>
            {offer.isVerified && (
              <span className="rounded-full bg-gold-400/20 px-2.5 py-1 text-xs font-medium text-gold-300">
                Entreprise vérifiée
              </span>
            )}
          </div>
          <p className="mt-2 text-white/70">{offer.company}</p>

          <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/70">
            <Tag>{offer.sector}</Tag>
            <Tag>{offer.city}</Tag>
            <Tag>{offer.contractType}</Tag>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex-1 space-y-8">
            <Block title="Description du poste">
              <p className="text-sm leading-relaxed text-navy-900/80">
                {offer.description}
              </p>
            </Block>

            <Block title="Missions principales">
              <ul className="list-disc space-y-2 pl-5 text-sm text-navy-900/80">
                {offer.missions.map((mission) => (
                  <li key={mission}>{mission}</li>
                ))}
              </ul>
            </Block>

            <Block title="Critères de sélection (ATS)">
              <div className="space-y-4">
                <Criteria label="Niveau d'études minimum" value={offer.ats.minEducationLevel} />
                <Criteria
                  label="Expérience minimum"
                  value={`${offer.ats.minExperienceYears} an(s)`}
                />
                <Criteria
                  label="Langues requises"
                  value={offer.ats.requiredLanguages.join(", ")}
                />
                <Criteria
                  label="Compétences clés"
                  value={offer.ats.keySkills.join(", ")}
                />
                {offer.ats.niceToHave.length > 0 && (
                  <Criteria
                    label="Atouts appréciés (non éliminatoires)"
                    value={offer.ats.niceToHave.join(", ")}
                  />
                )}
              </div>
            </Block>

            <div id="candidature">
              <ApplicationForm offer={offer} />
            </div>
          </div>

          <aside className="w-full shrink-0 lg:w-80">
            <div className="sticky top-6 rounded-xl border border-navy-900/10 bg-white p-6">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-navy-900/50">Entreprise</dt>
                  <dd className="mt-0.5 font-medium text-navy-900">
                    {offer.company}
                  </dd>
                </div>
                <div>
                  <dt className="text-navy-900/50">Date limite</dt>
                  <dd className="mt-0.5 font-medium text-navy-900">
                    {offer.deadline}
                  </dd>
                </div>
                <div>
                  <dt className="text-navy-900/50">Publiée</dt>
                  <dd className="mt-0.5 font-medium text-navy-900">
                    {offer.publishedAt}
                  </dd>
                </div>
              </dl>

              <a
                href="#candidature"
                className="mt-6 block w-full rounded-lg bg-gold-500 px-6 py-3 text-center text-sm font-semibold text-navy-950 transition-colors hover:bg-gold-400"
              >
                Postuler maintenant
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/10 px-2.5 py-1">{children}</span>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-navy-900/10 bg-white p-6 sm:p-8">
      <h2 className="text-base font-semibold text-navy-900">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Criteria({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
      <span className="w-56 shrink-0 text-navy-900/50">{label}</span>
      <span className="font-medium text-navy-900">{value}</span>
    </div>
  );
}
