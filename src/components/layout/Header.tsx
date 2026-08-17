import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Offres d'emploi" },
  { href: "/appels-offres", label: "Appels d'offres" },
  { href: "/formations", label: "Formations" },
];

export default function Header() {
  return (
    <header className="border-b border-navy-900/10 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-2 sm:flex-nowrap sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="CarrièresRDC"
            width={1254}
            height={1254}
            priority
            className="h-14 w-14 object-contain sm:h-16 sm:w-16"
          />
        </Link>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy-900/80 transition-colors hover:text-navy-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/connexion"
            className="hidden text-sm font-medium text-navy-900/80 hover:text-navy-900 sm:inline"
          >
            Se connecter
          </Link>
          <Link
            href="/publier"
            className="rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
          >
            Publier une offre
          </Link>
        </div>
      </div>
    </header>
  );
}
