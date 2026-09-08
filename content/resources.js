// RESOURCE entity — placeholder content.

export const resources = [
  {
    id: "res-getting-started",
    slug: "getting-started-with-haven-house",
    title: "Getting started with Haven House",
    type: "article",
    body: "[PLACEHOLDER] A short article introducing how to get started.",
    relatedServiceIds: [],
    isPublished: true,
  },
  {
    id: "res-emergency-contacts",
    slug: "other-emergency-and-support-contacts",
    title: "Other emergency and support contacts",
    type: "article",
    body: "[PLACEHOLDER] List of other relevant external services (e.g. Lifeline, 1800RESPECT) with real, verified numbers to be added.",
    relatedServiceIds: [],
    isPublished: true,
  },
  {
    id: "res-ndis-guide",
    slug: "understanding-ndis-basics",
    title: "Understanding NDIS basics",
    type: "external_link",
    url: "https://www.ndis.gov.au",
    relatedServiceIds: ["svc-ndis"],
    isPublished: true,
  },
];

export function getPublishedResources() {
  return resources.filter((r) => r.isPublished);
}

export function getResourceBySlug(slug) {
  return resources.find((r) => r.slug === slug && r.isPublished);
}
