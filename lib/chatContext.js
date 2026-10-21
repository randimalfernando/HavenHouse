import { prisma } from "@/lib/prisma";

// Describes each service category in plain language, so the chatbot knows
// WHAT each category is for and can match a person's need to the right one.
const CATEGORY_INFO = {
  hhKids: {
    label: "HH Kids",
    helpsWith: "support programs for children and young people and their families",
  },
  jobsProgram: {
    label: "Jobs Program",
    helpsWith: "employment support, job readiness and training",
  },
  socialWork: {
    label: "Social Work",
    helpsWith: "practical support, advocacy and help navigating other services",
  },
  accommodation: {
    label: "Accommodation",
    helpsWith: "crisis and temporary housing for people who need somewhere safe to stay",
  },
  psychological: {
    label: "Psychological Support",
    helpsWith: "professional psychological support services",
  },
  crisisLine: {
    label: "Crisis Line",
    helpsWith: "24/7 phone support when someone needs to talk to a person urgently",
  },
  antisemitism: {
    label: "Antisemitism Resources",
    helpsWith: "support and resources for people affected by antisemitism",
  },
  chaplaincy: {
    label: "Chaplaincy",
    helpsWith: "pastoral and spiritual care",
  },
  ndis: {
    label: "NDIS Services",
    helpsWith: "services for people with disability who use the NDIS",
  },
};

function detailsFor(service) {
  const parts = [];
  if (service.hhKids) parts.push(`Program type: ${service.hhKids.programType}`);
  if (service.jobsProgram) {
    parts.push(`Duration: ${service.jobsProgram.durationWeeks} weeks`);
    parts.push(`Certification provided: ${service.jobsProgram.certificationProvided ? "yes" : "no"}`);
  }
  if (service.socialWork) parts.push(`Walk-ins available: ${service.socialWork.walkInAvailable ? "yes" : "no"}`);
  if (service.accommodation) {
    parts.push(`Accommodation type: ${service.accommodation.accommodationType}`);
    parts.push(`Capacity: ${service.accommodation.capacity} people`);
  }
  if (service.psychological) parts.push(`Specialisation: ${service.psychological.specialisation}`);
  if (service.crisisLine) parts.push(`Languages supported: ${service.crisisLine.languagesSupported}`);
  if (service.chaplaincy) parts.push(`Languages offered: ${service.chaplaincy.languagesOffered}`);
  if (service.ndis) parts.push(`NDIS registration number: ${service.ndis.ndisRegistrationNumber}`);
  return parts;
}

function categoryKeyFor(service) {
  return Object.keys(CATEGORY_INFO).find((key) => service[key]) || null;
}

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
    orderBy: { serviceName: "asc" },
  });

  // Group services under their category so the model can match needs to categories.
  const groups = {};
  for (const key of Object.keys(CATEGORY_INFO)) groups[key] = [];
  for (const s of services) {
    const key = categoryKeyFor(s);
    if (key) groups[key].push(s);
  }

  const blocks = Object.entries(CATEGORY_INFO).map(([key, info]) => {
    const list = groups[key];
    const header = `CATEGORY: ${info.label} (helps with: ${info.helpsWith})`;
    if (list.length === 0) {
      return `${header}\n  No services are listed in this category at the moment.`;
    }
    const lines = list.map((s) => {
      const lines = [`  - ${s.serviceName}`];
      if (s.description) lines.push(`    About: ${s.description}`);
      for (const d of detailsFor(s)) lines.push(`    ${d}`);
      if (s.contactPhone) lines.push(`    Phone: ${s.contactPhone}`);
      if (s.contactEmail) lines.push(`    Email: ${s.contactEmail}`);
      if (s.location) {
        lines.push(`    Location: ${s.location.addressLine}, ${s.location.suburb} ${s.location.postalCode}`);
      }
      return lines.join("\n");
    });
    return `${header}\n${lines.join("\n")}`;
  });

  return blocks.join("\n\n");
}
