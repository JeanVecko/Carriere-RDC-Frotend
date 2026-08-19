"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { getStoredUser, getToken } from "@/lib/auth-client";
import { fetchMyApplications } from "@/lib/candidate-api";

type AppliedOffersContextValue = {
  appliedOfferIds: Set<string>;
  loading: boolean;
  markApplied: (offerId: string) => void;
};

const AppliedOffersContext = createContext<AppliedOffersContextValue | null>(null);

export function AppliedOffersProvider({ children }: { children: ReactNode }) {
  const [appliedOfferIds, setAppliedOfferIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const user = getStoredUser();
    const token = getToken();

    if (!user || !token || user.role !== "CANDIDATE") {
      setAppliedOfferIds(new Set());
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchMyApplications(token)
      .then((applications) => {
        setAppliedOfferIds(new Set(applications.map((application) => application.jobOffer.id)));
      })
      .catch(() => {
        // Statut de candidature accessoire : on ignore silencieusement les échecs réseau.
      })
      .finally(() => setLoading(false));
  }, [pathname]);

  function markApplied(offerId: string) {
    setAppliedOfferIds((current) => new Set(current).add(offerId));
  }

  return (
    <AppliedOffersContext.Provider value={{ appliedOfferIds, loading, markApplied }}>
      {children}
    </AppliedOffersContext.Provider>
  );
}

export function useAppliedOffers() {
  const context = useContext(AppliedOffersContext);
  if (!context) {
    throw new Error("useAppliedOffers must be used within an AppliedOffersProvider");
  }
  return context;
}
