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

export async function getServiceContext() {
  const services = await prisma.service.findMany({
    include: {
      location: true,
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
    orderBy: { id: "asc" },
  });

  if (services.length === 0) {
    return "No services are currently listed in the system. If asked about specific services, say none are listed yet and suggest contacting Haven House directly.";
  }

  return services
    .map((s) => {
      const [, categoryLabel] = CATEGORY_KEYS.find(([key]) => s[key]) || [null, "General"];
      const subtype = CATEGORY_KEYS.map(([key]) => s[key]).find(Boolean) || {};
      const detailPairs = Object.entries(subtype).filter(([key]) => key !== "serviceId");

      const lines = [
        `- ${s.serviceName} (${categoryLabel})`,
        s.description ? `  Description: ${s.description}` : null,
        s.location?.suburb ? `  Suburb: ${s.location.suburb}` : null,
        s.contactPhone ? `  Phone: ${s.contactPhone}` : null,
        s.contactEmail ? `  Email: ${s.contactEmail}` : null,
        ...detailPairs.map(([key, value]) => `  ${key}: ${value}`),
      ].filter(Boolean);

      return lines.join("\n");
    })
    .join("\n\n");
}