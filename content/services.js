// SERVICE entity — placeholder content.
// Replace name/summary/description/howToAccess with Haven House–approved copy
// before launch. Do not invent eligibility rules beyond ELIGIBILITY_CRITERIA.

export const services = [
  {
    id: "svc-crisis-support",
    slug: "crisis-support",
    category: "crisis_support",
    name: "Crisis Support",
    summary: "Support for people who need help right now.",
    description:
      "[PLACEHOLDER] General information about Haven House's crisis support pathway goes here. This page describes what kind of help is available and how it works — it is not itself a crisis line.",
    howToAccess:
      "[PLACEHOLDER] Describe how someone accesses this service — phone, drop-in, referral, hours.",
    isPublished: true,
  },
  {
    id: "svc-temporary-accommodation",
    slug: "temporary-accommodation",
    category: "temporary_accommodation",
    name: "Temporary Accommodation",
    summary: "Short-term, safe places to stay for people who need them.",
    description:
      "[PLACEHOLDER] General information about temporary accommodation support goes here.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
  {
    id: "svc-dfv",
    slug: "domestic-family-violence",
    category: "dfv",
    name: "Domestic & Family Violence Support",
    summary: "Support for people affected by domestic or family violence.",
    description:
      "[PLACEHOLDER] General information about this support pathway goes here.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
  {
    id: "svc-mental-health",
    slug: "mental-health-support",
    category: "mental_health",
    name: "Mental Health Support",
    summary: "Connecting people with mental health support and services.",
    description:
      "[PLACEHOLDER] General information about mental health support goes here. This service does not provide diagnosis, therapy, or clinical advice itself.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
  {
    id: "svc-addiction",
    slug: "addiction-support",
    category: "addiction",
    name: "Addiction Support",
    summary: "Support and referral pathways for alcohol and other drug concerns.",
    description: "[PLACEHOLDER] General information about addiction support goes here.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
  {
    id: "svc-ndis",
    slug: "ndis",
    category: "ndis",
    name: "NDIS Services",
    summary: "Support connected to the National Disability Insurance Scheme.",
    description: "[PLACEHOLDER] General information about NDIS-related services goes here.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
  {
    id: "svc-hh-kids",
    slug: "hh-kids",
    category: "hh_kids",
    name: "HH Kids",
    summary: "Programs and support for children and families.",
    description: "[PLACEHOLDER] General information about HH Kids goes here.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
  {
    id: "svc-chaplaincy",
    slug: "chaplaincy",
    category: "chaplaincy",
    name: "Chaplaincy",
    summary: "Pastoral care and support, open to people of all beliefs and none.",
    description: "[PLACEHOLDER] General information about chaplaincy support goes here.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
  {
    id: "svc-employment",
    slug: "employment-support",
    category: "employment",
    name: "Employment Support",
    summary: "Help with finding and keeping work.",
    description: "[PLACEHOLDER] General information about employment support goes here.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
  {
    id: "svc-antisemitism",
    slug: "antisemitism-support",
    category: "antisemitism_support",
    name: "Antisemitism Support & Resources",
    summary: "Support and resources for people affected by antisemitism.",
    description: "[PLACEHOLDER] General information about this support and resources goes here.",
    howToAccess: "[PLACEHOLDER] How to access this service.",
    isPublished: true,
  },
];

export function getServiceBySlug(slug) {
  return services.find((s) => s.slug === slug && s.isPublished);
}

export function getPublishedServices() {
  return services.filter((s) => s.isPublished);
}
