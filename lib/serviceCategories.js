import { prisma } from "@/lib/prisma";

export const SERVICE_CATEGORIES = [
  { label: "Crisis Line", countKey: "crisisLine", accent: "#a5d8ff", href: "/admin/services/crisis-line" },
  { label: "Accommodation", countKey: "accommodation", accent: "#74c0fc", href: "/admin/services/accommodation" },
  { label: "HH Kids", countKey: "hhKids", accent: "#4dabf7", href: "/admin/services/hh-kids" },
  { label: "Jobs Program", countKey: "jobsProgram", accent: "#339af0", href: "/admin/services/jobs-program" },
  { label: "Social Work", countKey: "socialWork", accent: "#228be6", href: "/admin/services/social-work" },
  { label: "Psychological Support", countKey: "psychological", accent: "#1c7ed6", href: "/admin/services/psychological-support" },
  { label: "Antisemitism Resources", countKey: "antisemitism", accent: "#1971c2", href: "/admin/services/antisemitism-resources" },
  { label: "Chaplaincy", countKey: "chaplaincy", accent: "#1864ab", href: "/admin/services/chaplaincy" },
  { label: "NDIS", countKey: "ndis", accent: "#5c7cfa", href: "/admin/services/ndis" },
];

export const CHART_COLORS = [
  "#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7",
  "#14b8a6", "#ec4899", "#f97316", "#6366f1",
];

export async function getCategoryCountsForChart() {
  const [
    crisisLine, accommodation, hhKids, jobsProgram, socialWork,
    psychological, antisemitism, chaplaincy, ndis,
  ] = await Promise.all([
    prisma.crisisLineService.count(),
    prisma.accommodationService.count(),
    prisma.hhKidsService.count(),
    prisma.jobsProgramService.count(),
    prisma.socialWorkService.count(),
    prisma.psychologicalService.count(),
    prisma.antisemitismResourceService.count(),
    prisma.chaplaincyService.count(),
    prisma.ndisService.count(),
  ]);

  const counts = { crisisLine, accommodation, hhKids, jobsProgram, socialWork, psychological, antisemitism, chaplaincy, ndis };

  return SERVICE_CATEGORIES.map((cat, index) => ({
    label: cat.label,
    value: counts[cat.countKey],
    accent: cat.accent,
    chartColor: CHART_COLORS[index],
    href: cat.href,
  }));
}