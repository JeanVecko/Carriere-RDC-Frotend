"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    fetch(`${API_URL}/api/analytics/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {
      // Le suivi de visite est accessoire : on ignore silencieusement les échecs réseau.
    });
  }, [pathname]);

  return null;
}
