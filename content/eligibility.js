export const DEFAULT_CAVEAT =
  "This is general guidance only. Please contact Haven House directly to confirm what applies to your situation.";

export const eligibilityCriteria = [
  { id: "elig-crisis-line", serviceId: "svc-crisis-line", criteriaText: "[PLACEHOLDER] General eligibility notes for the crisis line.", caveatText: DEFAULT_CAVEAT },
  { id: "elig-accommodation", serviceId: "svc-accommodation", criteriaText: "[PLACEHOLDER] General eligibility notes for accommodation.", caveatText: DEFAULT_CAVEAT },
  { id: "elig-psychological-support", serviceId: "svc-psychological-support", criteriaText: "[PLACEHOLDER] General eligibility notes for psychological support.", caveatText: DEFAULT_CAVEAT },
  { id: "elig-ndis", serviceId: "svc-ndis", criteriaText: "[PLACEHOLDER] General eligibility notes for NDIS services.", caveatText: DEFAULT_CAVEAT },
  { id: "elig-hh-kids", serviceId: "svc-hh-kids", criteriaText: "[PLACEHOLDER] General eligibility notes for HH Kids.", caveatText: DEFAULT_CAVEAT },
  { id: "elig-chaplaincy", serviceId: "svc-chaplaincy", criteriaText: "[PLACEHOLDER] Chaplaincy is generally open to all; confirm specifics with Haven House.", caveatText: DEFAULT_CAVEAT },
  { id: "elig-jobs-program", serviceId: "svc-jobs-program", criteriaText: "[PLACEHOLDER] General eligibility notes for the jobs program.", caveatText: DEFAULT_CAVEAT },
  { id: "elig-antisemitism-resources", serviceId: "svc-antisemitism-resources", criteriaText: "[PLACEHOLDER] General eligibility notes for antisemitism resources.", caveatText: DEFAULT_CAVEAT },
  { id: "elig-social-work", serviceId: "svc-social-work", criteriaText: "[PLACEHOLDER] General eligibility notes for social work support.", caveatText: DEFAULT_CAVEAT },
];

export function getEligibilityForService(serviceId) {
  return eligibilityCriteria.find((e) => e.serviceId === serviceId);
}