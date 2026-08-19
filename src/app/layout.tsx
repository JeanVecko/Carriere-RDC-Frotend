import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import VisitTracker from "@/components/analytics/VisitTracker";
import { AppliedOffersProvider } from "@/components/jobs/applied-offers-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CarrièresRDC — Emplois, appels d'offres et formations en RDC",
  description:
    "La plateforme de référence en RDC pour les offres d'emploi, les appels d'offres et les formations professionnelles, portée par la communauté « Les Offres d'emploi RDC ».",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <VisitTracker />
        <AppliedOffersProvider>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
        </AppliedOffersProvider>
      </body>
    </html>
  );
}
