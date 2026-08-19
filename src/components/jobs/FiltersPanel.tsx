"use client";

import { useState } from "react";
import { contractTypes, sectors } from "@/lib/offers";

export default function FiltersPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-navy-900/10 bg-white px-4 py-2.5 text-sm font-medium text-navy-900"
      >
        <FilterIcon />
        Filtres
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-navy-950/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85%] overflow-y-auto bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-navy-900">Filtres</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Fermer les filtres"
                className="flex h-8 w-8 items-center justify-center rounded-md text-navy-900/60 hover:bg-navy-900/5"
              >
                ✕
              </button>
            </div>

            <FilterGroups />

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mt-6 w-full rounded-lg bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-400"
            >
              Voir les résultats
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function FilterGroups() {
  return (
    <div className="mt-4 flex flex-col gap-6">
      <FilterGroup label="Secteur" options={sectors} />
      <FilterGroup label="Type de contrat" options={contractTypes} />
    </div>
  );
}

function FilterGroup({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-navy-900/40">
        {label}
      </h3>
      <ul className="mt-2 flex flex-col gap-2">
        {options.map((option) => (
          <li key={option}>
            <label className="flex items-center gap-2 text-sm text-navy-900/70">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-navy-900/20 text-gold-500 focus:ring-gold-400"
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
    >
      <path
        d="M3 4h14M6 10h8M8.5 16h3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
