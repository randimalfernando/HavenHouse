// ELIGIBILITY_CRITERIA entity — placeholder content.
// Every record carries a shared caveat so eligibility text is never shown
// without a "confirm with us directly" note. Do not invent real rules here —
// replace criteriaText with Haven House–approved wording before launch.

export const DEFAULT_CAVEAT =
  "This is general guidance only. Please contact Haven House directly to confirm what applies to your situation.";

export const eligibilityCriteria = [
  {
    id: "elig-crisis-support",
    serviceId: "svc-crisis-support",
    criteriaText: "[PLACEHOLDER] General eligibility notes for crisis support.",
    caveatText: DEFAULT_CAVEAT,
  },
  {
    id: "elig-temporary-accommodation",
    serviceId: "svc-temporary-accommodation",
    criteriaText: "[PLACEHOLDER] General eligibility notes for temporary accommodation.",
    caveatText: DEFAULT_CAVEAT,
  },
  {
    id: "elig-dfv",
    serviceId: "svc-dfv",
    criteriaText: "[PLACEHOLDER] General eligibility notes for DFV support.",
    caveatText: DEFAULT_CAVEAT,
  },
  {
    id: "elig-mental-health",
    serviceId: "svc-mental-health",
    criteriaText: "[PLACEHOLDER] General eligibility notes for mental health support.",
    caveatText: DEFAULT_CAVEAT,
  },
  {
    id: "elig-addiction",
    serviceId: "svc-addiction",
    criteriaText: "[PLACEHOLDER] General eligibility notes for addiction support.",
    caveatText: DEFAULT_CAVEAT,
  },
  {
    id: "elig-ndis",
    serviceId: "svc-ndis",
    criteriaText: "[PLACEHOLDER] General eligibility notes for NDIS services.",
    caveatText: DEFAULT_CAVEAT,
  },
  {
    id: "elig-hh-kids",
    serviceId: "svc-hh-kids",
    criteriaText: "[PLACEHOLDER] General eligibility notes for HH Kids.",
    caveatText: DEFAULT_CAVEAT,
  },
  {
    id: "elig-chaplaincy",
    serviceId: "svc-chaplaincy",
    criteriaText: "[PLACEHOLDER] Chaplaincy is generally open to all; confirm specifics with Haven House.",
    caveatText: DEFAULT_CAVEAT,
  },
  {
    id: "elig-employment",
    serviceId: "svc-employment",
    criteriaText: "[PLACEHOLDER] General eligibility notes for employment support.",
    caveatText: DEFAULT_CAVEAT,
  },
  {
    id: "elig-antisemitism",
    serviceId: "svc-antisemitism",
    criteriaText: "[PLACEHOLDER] General eligibility notes for antisemitism support.",
    caveatText: DEFAULT_CAVEAT,
  },
];

export function getEligibilityForService(serviceId) {
  return eligibilityCriteria.find((e) => e.serviceId === serviceId);
}
