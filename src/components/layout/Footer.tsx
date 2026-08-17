export default function Footer() {
  return (
    <footer className="border-t border-navy-900/10 bg-navy-950 text-white/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-10 sm:px-6">
        <span className="text-base font-bold text-white">
          Carrières<span className="text-gold-400">RDC</span>
        </span>
        <p className="max-w-md text-sm">
          Portée par la communauté « Les Offres d&apos;emploi RDC ». La
          plateforme de référence pour les offres d&apos;emploi, appels
          d&apos;offres et formations en République Démocratique du Congo.
        </p>
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} CarrièresRDC. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
