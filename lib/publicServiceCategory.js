import { prisma } from "@/lib/prisma";

const CATEGORY_DB_CONFIG = {
  crisis_line: {
    model: "crisisLineService",
    fields: [{ key: "languagesSupported", label: "Languages supported" }],
  },
  accommodation: {
    model: "accommodationService",
    fields: [
      { key: "accommodationType", label: "Accommodation type" },
      { key: "capacity", label: "Capacity" },
    ],
  },
  hh_kids: {
    model: "hhKidsService",
    fields: [{ key: "programType", label: "Program type" }],
  },
  jobs_program: {
    model: "jobsProgramService",
    fields: [
      { key: "durationWeeks", label: "Duration (weeks)" },
      { key: "certificationProvided", label: "Certification provided", boolean: true },
    ],
  },
  social_work: {
    model: "socialWorkService",
    fields: [{ key: "walkInAvailable", label: "Walk-ins available", boolean: true }],
  },
  psychological_support: {
    model: "psychologicalService",
    fields: [{ key: "specialisation", label: "Specialisation" }],
  },
  antisemitism_resources: {
    model: "antisemitismResourceService",
    fields: [],
  },
  chaplaincy: {
    model: "chaplaincyService",
    fields: [{ key: "languagesOffered", label: "Languages offered" }],
  },
  ndis: {
    model: "ndisService",
    fields: [{ key: "ndisRegistrationNumber", label: "NDIS registration number" }],
  },
};

export async function getDbServicesForCategory(category) {
  const config = CATEGORY_DB_CONFIG[category];
  if (!config) return { records: [], fields: [] };

  const records = await prisma[config.model].findMany({
    include: { service: { include: { location: true } } },
    orderBy: { serviceId: "asc" },
  });

  return { records, fields: config.fields };
}