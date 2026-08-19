"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getStoredUser } from "@/lib/auth-client";

export default function CompanyHomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const user = getStoredUser();
    if (user?.role === "COMPANY" || user?.role === "TRAINING_ORG") {
      router.replace("/entreprise");
    }
  }, [router]);

  return null;
}
