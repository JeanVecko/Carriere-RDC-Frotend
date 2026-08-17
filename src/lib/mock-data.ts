export type AtsCriteria = {
  minEducationLevel: string;
  minExperienceYears: number;
  requiredLanguages: string[];
  keySkills: string[];
  niceToHave: string[];
  preScreeningQuestions: string[];
};

export type JobOffer = {
  id: string;
  reference: string;
  title: string;
  company: string;
  sector: string;
  city: string;
  contractType: string;
  publishedAt: string;
  publishedDate: string;
  deadline: string;
  isVerified: boolean;
  description: string;
  missions: string[];
  ats: AtsCriteria;
};

const curatedOffers: JobOffer[] = [
  {
    id: "1",
    reference: "Ref: 15-08-26 ONEM: 653786",
    title: "Responsable Logistique",
    company: "LogiCore Group SARL",
    sector: "Logistique & Transport",
    city: "Kinshasa",
    contractType: "CDI",
    publishedAt: "Il y a 2 jours",
    publishedDate: "15.08.2026",
    deadline: "15 septembre 2026",
    isVerified: true,
    description:
      "LogiCore Group SARL recherche un(e) Responsable Logistique pour piloter la chaîne d'approvisionnement de ses opérations à Kinshasa. Vous serez en charge de la coordination des transporteurs, de la gestion des entrepôts et de l'optimisation des flux de marchandises.",
    missions: [
      "Superviser la réception, le stockage et l'expédition des marchandises",
      "Coordonner les prestataires de transport et de dédouanement",
      "Optimiser les coûts et délais de la chaîne logistique",
      "Encadrer une équipe de 5 agents logistiques",
    ],
    ats: {
      minEducationLevel: "Bac+3",
      minExperienceYears: 3,
      requiredLanguages: ["Français", "Anglais"],
      keySkills: ["Gestion d'entrepôt", "Supply chain", "Excel avancé"],
      niceToHave: ["Certification en logistique", "Permis de conduire"],
      preScreeningQuestions: [
        "Avez-vous déjà géré une équipe logistique de plus de 5 personnes ?",
        "Êtes-vous disponible pour des déplacements ponctuels en province ?",
      ],
    },
  },
  {
    id: "2",
    reference: "Ref: 14-08-26 ONEM: 641220",
    title: "Comptable Senior",
    company: "Mining Solutions RDC",
    sector: "Finance & Comptabilité",
    city: "Lubumbashi",
    contractType: "CDI",
    publishedAt: "Il y a 3 jours",
    publishedDate: "14.08.2026",
    deadline: "16 août 2026",
    isVerified: true,
    description:
      "Mining Solutions RDC recherche un(e) Comptable Senior pour renforcer son équipe finance à Lubumbashi. Vous assurerez la tenue complète de la comptabilité et la production des états financiers.",
    missions: [
      "Tenir la comptabilité générale et analytique",
      "Préparer les états financiers mensuels",
      "Assurer la conformité fiscale et réglementaire",
      "Superviser deux comptables juniors",
    ],
    ats: {
      minEducationLevel: "Bac+4",
      minExperienceYears: 5,
      requiredLanguages: ["Français"],
      keySkills: ["Sage", "Normes OHADA", "Fiscalité RDC"],
      niceToHave: ["Anglais professionnel", "Expérience secteur minier"],
      preScreeningQuestions: [
        "Combien d'années d'expérience avez-vous en normes OHADA ?",
      ],
    },
  },
  {
    id: "3",
    reference: "Ref: 12-08-26 ONEM: 598347",
    title: "Chargé de Communication",
    company: "ONG Avenir Congo",
    sector: "Communication & Marketing",
    city: "Goma",
    contractType: "CDD",
    publishedAt: "Il y a 5 jours",
    publishedDate: "12.08.2026",
    deadline: "19 août 2026",
    isVerified: false,
    description:
      "ONG Avenir Congo recherche un(e) Chargé(e) de Communication pour animer sa présence digitale et coordonner ses campagnes de sensibilisation dans la région de Goma.",
    missions: [
      "Gérer les réseaux sociaux de l'organisation",
      "Produire des contenus (photo, vidéo, texte)",
      "Coordonner les relations presse locales",
    ],
    ats: {
      minEducationLevel: "Bac+3",
      minExperienceYears: 1,
      requiredLanguages: ["Français", "Swahili"],
      keySkills: ["Réseaux sociaux", "Rédaction", "Canva"],
      niceToHave: ["Montage vidéo", "Photographie"],
      preScreeningQuestions: [],
    },
  },
  {
    id: "4",
    reference: "Ref: 10-08-26 ONEM: 512034",
    title: "Ingénieur Réseaux",
    company: "TeleConnect RDC",
    sector: "Informatique & Télécoms",
    city: "Kinshasa",
    contractType: "CDI",
    publishedAt: "Il y a 1 semaine",
    publishedDate: "10.08.2026",
    deadline: "5 septembre 2026",
    isVerified: true,
    description:
      "TeleConnect RDC recherche un(e) Ingénieur Réseaux pour maintenir et faire évoluer son infrastructure télécoms à Kinshasa.",
    missions: [
      "Administrer les équipements réseau (routeurs, switchs)",
      "Superviser la disponibilité de l'infrastructure",
      "Diagnostiquer et résoudre les incidents techniques",
    ],
    ats: {
      minEducationLevel: "Bac+5",
      minExperienceYears: 2,
      requiredLanguages: ["Français", "Anglais"],
      keySkills: ["Cisco", "TCP/IP", "Sécurité réseau"],
      niceToHave: ["Certification CCNA", "Disponibilité immédiate"],
      preScreeningQuestions: [
        "Possédez-vous une certification Cisco (CCNA ou supérieure) ?",
        "Quelle est votre disponibilité pour débuter ?",
      ],
    },
  },
];

export const sectors = [
  "Logistique & Transport",
  "Finance & Comptabilité",
  "Communication & Marketing",
  "Informatique & Télécoms",
  "Santé",
  "Éducation & Formation",
];

export const cities = ["Kinshasa", "Lubumbashi", "Goma", "Bukavu", "Matadi"];

export const contractTypes = ["CDI", "CDD", "Stage", "Freelance", "Temps partiel"];

export const educationLevels = [
  "Sans diplôme",
  "Diplôme d'État",
  "Bac+2",
  "Bac+3",
  "Bac+4",
  "Bac+5 et plus",
];

const FRENCH_MONTH_NAMES = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

const TODAY = new Date(2026, 7, 17);

function formatFrenchDate(date: Date): string {
  return `${date.getDate()} ${FRENCH_MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDotDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${date.getFullYear()}`;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatReference(date: Date, onemNumber: number): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `Ref: ${day}-${month}-${year} ONEM: ${onemNumber}`;
}

const generatedOfferTemplates: Array<{
  title: string;
  sector: string;
  keySkills: string[];
}> = [
  { title: "Assistant(e) Administratif(ve)", sector: "Finance & Comptabilité", keySkills: ["Excel", "Classement", "Accueil"] },
  { title: "Chef de Projet Construction", sector: "Logistique & Transport", keySkills: ["Gestion de chantier", "MS Project", "Sécurité BTP"] },
  { title: "Infirmier(ère) Diplômé(e) d'État", sector: "Santé", keySkills: ["Soins infirmiers", "Urgences", "Relation patient"] },
  { title: "Enseignant(e) de Mathématiques", sector: "Éducation & Formation", keySkills: ["Pédagogie", "Programme national", "Évaluation"] },
  { title: "Technicien(ne) de Maintenance", sector: "Informatique & Télécoms", keySkills: ["Électromécanique", "Dépannage", "Maintenance préventive"] },
  { title: "Agent de Sécurité", sector: "Logistique & Transport", keySkills: ["Surveillance", "Gestion d'incidents", "Rondes"] },
  { title: "Développeur(se) Web", sector: "Informatique & Télécoms", keySkills: ["JavaScript", "React", "API REST"] },
  { title: "Responsable Marketing Digital", sector: "Communication & Marketing", keySkills: ["Réseaux sociaux", "SEO", "Publicité en ligne"] },
  { title: "Caissier(ère)", sector: "Finance & Comptabilité", keySkills: ["Encaissement", "Relation client", "Rigueur"] },
  { title: "Agronome", sector: "Santé", keySkills: ["Agronomie", "Suivi de production", "Terrain"] },
  { title: "Électricien(ne) Industriel(le)", sector: "Logistique & Transport", keySkills: ["Électricité industrielle", "Normes de sécurité", "Lecture de schémas"] },
  { title: "Juriste d'Entreprise", sector: "Finance & Comptabilité", keySkills: ["Droit des affaires", "Rédaction juridique", "Contentieux"] },
  { title: "Chargé(e) des Ressources Humaines", sector: "Finance & Comptabilité", keySkills: ["Recrutement", "Droit du travail", "Paie"] },
  { title: "Vendeur(se) en Boutique", sector: "Communication & Marketing", keySkills: ["Vente", "Relation client", "Merchandising"] },
  { title: "Analyste Financier(ère)", sector: "Finance & Comptabilité", keySkills: ["Modélisation financière", "Excel avancé", "Reporting"] },
  { title: "Superviseur(se) de Production", sector: "Logistique & Transport", keySkills: ["Gestion de production", "Qualité", "Encadrement d'équipe"] },
  { title: "Traducteur(trice) Anglais-Français", sector: "Éducation & Formation", keySkills: ["Traduction", "Rédaction", "Relecture"] },
  { title: "Coordinateur(trice) Humanitaire", sector: "Santé", keySkills: ["Gestion de projet", "Reporting bailleurs", "Coordination terrain"] },
  { title: "Gestionnaire de Stock", sector: "Logistique & Transport", keySkills: ["Gestion des stocks", "Inventaire", "Excel"] },
  { title: "Community Manager", sector: "Communication & Marketing", keySkills: ["Réseaux sociaux", "Création de contenu", "Canva"] },
  { title: "Technicien(ne) Réseaux Télécoms", sector: "Informatique & Télécoms", keySkills: ["Fibre optique", "GSM", "Supervision réseau"] },
];

const generatedCompanies = [
  "Kivu Business Group",
  "Congo Fresh Foods",
  "Horizon Assurances RDC",
  "Écoles Réussite Plus",
  "Clinique Espoir Kinshasa",
  "BTP Congo Construction",
  "Digital Hub Kinshasa",
  "Katanga Mines & Métaux",
  "Fondation Umoja",
  "AgroCongo SARL",
];

function generateOffers(): JobOffer[] {
  return generatedOfferTemplates.map((template, index) => {
    const company = generatedCompanies[index % generatedCompanies.length];
    const city = cities[index % cities.length];
    const contractType = contractTypes[index % contractTypes.length];
    const publishedAgo = index + 1;
    const publishedDate = addDays(TODAY, -publishedAgo);
    const deadline = addDays(TODAY, 5 + ((index * 3) % 35));

    return {
      id: `${index + 5}`,
      reference: formatReference(publishedDate, 100000 + ((index * 48_271) % 900_000)),
      title: template.title,
      company,
      sector: template.sector,
      city,
      contractType,
      publishedAt: `Il y a ${publishedAgo} jour${publishedAgo > 1 ? "s" : ""}`,
      publishedDate: formatDotDate(publishedDate),
      deadline: formatFrenchDate(deadline),
      isVerified: index % 3 !== 0,
      description: `${company} recherche un(e) ${template.title} pour renforcer son équipe à ${city}, dans le secteur ${template.sector.toLowerCase()}.`,
      missions: [
        `Assurer les activités courantes liées au poste de ${template.title}`,
        "Collaborer avec les équipes internes pour atteindre les objectifs fixés",
        "Rendre compte régulièrement de l'avancement de vos missions",
      ],
      ats: {
        minEducationLevel: "Bac+3",
        minExperienceYears: (index % 4) + 1,
        requiredLanguages: ["Français"],
        keySkills: template.keySkills,
        niceToHave: [],
        preScreeningQuestions: [],
      },
    };
  });
}

const FRENCH_MONTHS: Record<string, number> = Object.fromEntries(
  FRENCH_MONTH_NAMES.map((name, index) => [name, index])
);

function parseFrenchDate(value: string): Date | null {
  const [day, month, year] = value.split(" ");
  const monthIndex = FRENCH_MONTHS[month?.toLowerCase()];

  if (!day || monthIndex === undefined || !year) {
    return null;
  }

  return new Date(Number(year), monthIndex, Number(day));
}

export type OfferStatus = "current" | "closing-soon" | "expired" | "unspecified";

export function getOfferStatus(offer: JobOffer): OfferStatus {
  const deadline = parseFrenchDate(offer.deadline);

  if (!deadline) return "unspecified";

  const diffDays = Math.ceil((deadline.getTime() - Date.now()) / 86_400_000);

  if (diffDays < 0) return "expired";
  if (diffDays <= 3) return "closing-soon";
  return "current";
}

export function getOfferClosingDate(offer: JobOffer): string {
  const deadline = parseFrenchDate(offer.deadline);

  if (!deadline) return "Non précisée";

  const day = String(deadline.getDate()).padStart(2, "0");
  const month = String(deadline.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${deadline.getFullYear()}`;
}

export const offerStatusLabels: Record<OfferStatus, string> = {
  current: "En cours",
  "closing-soon": "Moins de 3 jours",
  expired: "Expirée",
  unspecified: "Non précisé",
};

export const offerStatusColors: Record<OfferStatus, string> = {
  current: "#16a34a",
  "closing-soon": "#f59e0b",
  expired: "#dc2626",
  unspecified: "#9ca3af",
};

export const mockJobOffers: JobOffer[] = [...curatedOffers, ...generateOffers()];
