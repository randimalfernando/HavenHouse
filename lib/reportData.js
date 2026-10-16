import { prisma } from "@/lib/prisma";

// One entry per service category. `key` is the Prisma relation name on the Service model.
const CATEGORIES = [
  { key: "crisisLine", label: "Crisis Line", helpsWith: "24/7 phone support when someone needs to talk to a person urgently." },
  { key: "accommodation", label: "Accommodation", helpsWith: "Crisis and temporary housing for people who need somewhere safe to stay." },
  { key: "psychological", label: "Psychological Support", helpsWith: "Professional psychological support services." },
  { key: "ndis", label: "NDIS Services", helpsWith: "Services for people with disability who use the NDIS." },
  { key: "hhKids", label: "HH Kids", helpsWith: "Support programs for children and young people and their families." },
  { key: "chaplaincy", label: "Chaplaincy", helpsWith: "Pastoral and spiritual care." },
  { key: "jobsProgram", label: "Jobs Program", helpsWith: "Employment support, job readiness and training." },
  { key: "antisemitism", label: "Antisemitism Resources", helpsWith: "Support and resources for people affected by antisemitism." },
  { key: "socialWork", label: "Social Work", helpsWith: "Practical support, advocacy and help navigating other services." },
];

function detailsFor(s) {
  const d = [];
  if (s.hhKids) d.push(["Program type", s.hhKids.programType]);
  if (s.jobsProgram) {
    d.push(["Duration", `${s.jobsProgram.durationWeeks} weeks`]);
    d.push(["Certification provided", s.jobsProgram.certificationProvided ? "Yes" : "No"]);
  }
  if (s.socialWork) d.push(["Walk-ins available", s.socialWork.walkInAvailable ? "Yes" : "No"]);
  if (s.accommodation) {
    d.push(["Accommodation type", s.accommodation.accommodationType]);
    d.push(["Capacity", `${s.accommodation.capacity} people`]);
  }
  if (s.psychological) d.push(["Specialisation", s.psychological.specialisation]);
  if (s.crisisLine) d.push(["Languages supported", s.crisisLine.languagesSupported]);
  if (s.chaplaincy) d.push(["Languages offered", s.chaplaincy.languagesOffered]);
  if (s.ndis) d.push(["NDIS registration number", s.ndis.ndisRegistrationNumber]);
  return d;
}

export async function getServicesReportData() {
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

  const categories = CATEGORIES.map((c) => ({ ...c, services: [], count: 0 }));
  const byKey = Object.fromEntries(categories.map((c) => [c.key, c]));

  for (const s of services) {
    const cat = categories.find((c) => s[c.key]);
    if (!cat) continue; // a service with no category record is not listed
    cat.services.push({
      name: s.serviceName,
      description: s.description || "",
      phone: s.contactPhone || "",
      email: s.contactEmail || "",
      location: s.location ? `${s.location.addressLine}, ${s.location.suburb} ${s.location.postalCode}` : "",
      details: detailsFor(s),
      views: s.viewCount ?? 0,
    });
  }
  for (const c of categories) c.count = c.services.length;

  const total = categories.reduce((n, c) => n + c.count, 0);
  const topViewed = categories
    .flatMap((c) => c.services.map((s) => ({ name: s.name, categoryLabel: c.label, views: s.views })))
    .filter((s) => s.views > 0)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return {
    generatedAt: new Date(),
    categories,
    topViewed,
    totals: {
      services: total,
      categoriesWithServices: categories.filter((c) => c.count > 0).length,
      emptyCategories: categories.filter((c) => c.count === 0).length,
    },
  };
}
