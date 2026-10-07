import { prisma } from "@/lib/prisma";

const CATEGORY_KEYS = [
  ["hhKids", "HH Kids"],
  ["jobsProgram", "Jobs Program"],
  ["socialWork", "Social Work"],
  ["accommodation", "Accommodation"],
  ["psychological", "Psychological Support"],
  ["crisisLine", "Crisis Line"],
  ["antisemitism", "Antisemitism Resources"],
  ["chaplaincy", "Chaplaincy"],
  ["ndis", "NDIS"],
];

export async function getMostViewedServices(limit = 5) {
  const services = await prisma.service.findMany({
    orderBy: { viewCount: "desc" },
    take: limit,
    include: {
      hhKids: true,
      jobsProgram: true,
      socialWork: true,
      accommodation: true,
      psychological: true,
      crisisLine: true,
      antisemitism: true,
      chaplaincy: true,
      ndis: true,
    },
  });

  return services.map((s) => {
    const [, categoryLabel] = CATEGORY_KEYS.find(([key]) => s[key]) || [null, "General"];
    return {
      name: s.serviceName,
      category: categoryLabel,
      views: s.viewCount,
    };
  });
}