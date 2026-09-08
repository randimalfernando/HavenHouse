// SAFETY_TRIGGER entity.
// matchPatterns are illustrative starting points only. Before launch, this
// list should be reviewed and expanded by Haven House / a qualified safety
// reviewer — this is not a clinically validated detection set.
// Matching is deliberately broad (substring match, case-insensitive) so it
// over-triggers rather than under-triggers: a false positive just shows the
// contact number, which is always safe to show.

export const safetyTriggers = [
  {
    id: "trig-self-harm-suicide",
    category: "self_harm_suicide",
    label: "Self-harm or suicide",
    matchPatterns: [
      "suicide", "kill myself", "end my life", "self harm", "self-harm",
      "hurt myself", "want to die", "don't want to be here", "no reason to live",
    ],
    isActive: true,
  },
  {
    id: "trig-immediate-danger",
    category: "immediate_danger",
    label: "Immediate danger",
    matchPatterns: [
      "in danger right now", "someone is trying to hurt me", "i'm not safe",
      "he's going to hurt me", "she's going to hurt me", "unsafe right now",
    ],
    isActive: true,
  },
  {
    id: "trig-dfv-urgent",
    category: "dfv_urgent",
    label: "Domestic or family violence (urgent)",
    matchPatterns: [
      "he hit me", "she hit me", "being abused", "domestic violence tonight",
      "partner is violent", "afraid to go home",
    ],
    isActive: true,
  },
  {
    id: "trig-child-safety",
    category: "child_safety",
    label: "Child safety",
    matchPatterns: [
      "my child is in danger", "a child is being hurt", "child abuse",
      "kid is not safe",
    ],
    isActive: true,
  },
  {
    id: "trig-severe-distress",
    category: "severe_distress",
    label: "Severe mental distress",
    matchPatterns: [
      "can't cope anymore", "having a breakdown", "losing control",
      "can't keep going", "having a crisis",
    ],
    isActive: true,
  },
  {
    id: "trig-urgent-homelessness",
    category: "urgent_homelessness",
    label: "Urgent homelessness",
    matchPatterns: [
      "nowhere to sleep tonight", "sleeping on the street tonight",
      "no place to stay tonight", "homeless tonight",
    ],
    isActive: true,
  },
  {
    id: "trig-violence-to-others",
    category: "violence_to_others",
    label: "Violence toward others",
    matchPatterns: [
      "going to hurt someone", "want to hurt someone", "going to hurt him",
      "going to hurt her",
    ],
    isActive: true,
  },
  {
    id: "trig-overdose-emergency",
    category: "overdose_emergency",
    label: "Overdose or serious substance-related emergency",
    matchPatterns: [
      "overdose", "took too many pills", "someone won't wake up",
      "can't wake them up",
    ],
    isActive: true,
  },
  {
    id: "trig-request-for-person",
    category: "request_for_person",
    label: "Direct request to speak to a person",
    matchPatterns: [
      "speak to a person", "talk to a human", "real person please",
      "speak to a staff member", "talk to someone now",
    ],
    isActive: true,
  },
];

export function getActiveSafetyTriggers() {
  return safetyTriggers.filter((t) => t.isActive);
}
