"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Offres d'emploi" },
  { href: "/appels-offres", label: "Appels d'offres" },
  { href: "/formations", label: "Formations" },
  { href: "/contact", label: "Contact" },
];

const navButtonClass =
  "shrink-0 rounded-full bg-navy-900 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-navy-800 sm:px-4 sm:py-1.5 sm:text-sm";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-navy-900/10 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-2 py-1.5 sm:px-4">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          style={{ perspective: "600px" }}
        >
          <Image
            src="/logo.png"
            alt="CarrièresRDC"
            width={1254}
            height={1254}
            priority
            className="h-9 w-9 rounded-full object-contain drop-shadow-[4px_6px_6px_rgba(15,32,68,0.35)] transition-transform duration-300 ease-out [transform:perspective(600px)_rotateY(-16deg)_rotateX(8deg)] hover:[transform:perspective(600px)_rotateY(0deg)_rotateX(0deg)] sm:h-11 sm:w-11"
          />
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link href="/connexion" className={navButtonClass}>
            Se connecter
          </Link>
          <Link href="/publier" className={navButtonClass}>
            Publier une offre
          </Link>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="main-menu"
              aria-label="Ouvrir le menu"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-navy-900/10 text-navy-900 hover:bg-navy-900/5"
            >
              <span className="flex flex-col gap-1">
                <span className="h-0.5 w-4 bg-navy-900" />
                <span className="h-0.5 w-4 bg-navy-900" />
                <span className="h-0.5 w-4 bg-navy-900" />
              </span>
            </button>

            {isMenuOpen && (
              <nav
                id="main-menu"
                className="absolute right-0 top-12 flex w-56 flex-col gap-1 rounded-xl border border-navy-900/10 bg-white p-2 shadow-lg"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-md px-3 py-2 text-sm font-medium text-navy-900/80 hover:bg-navy-900/5 hover:text-navy-900"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
