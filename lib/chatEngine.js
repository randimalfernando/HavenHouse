import { getActiveSafetyTriggers } from "@/content/safetyTriggers";
import { getPublishedServices } from "@/content/services";
import { getPublishedFaqs } from "@/content/faqs";
import { getEligibilityForService } from "@/content/eligibility";
import { siteConfig } from "@/lib/siteConfig";

// ---------------------------------------------------------------------------
// This module is intentionally deterministic (keyword/pattern based) rather
// than model-generated. The chatbot must never compose free-form advice on
// crisis, medical, psychological, or legal topics — it may only ever return
// one of: a safety interrupt, a matched service, a matched FAQ, eligibility
// guidance, contact info, or a neutral fallback. Nothing here stores any
// message or session data; each call is stateless.
// ---------------------------------------------------------------------------

function normalize(text) {
  return (text || "").toLowerCase().trim();
}

/**
 * Checks a single message for safety-trigger language.
 * Runs BEFORE any other intent matching, on every turn.
 */
export function checkSafetyTrigger(message) {
  const text = normalize(message);
  if (!text) return null;

  const triggers = getActiveSafetyTriggers();
  for (const trigger of triggers) {
    for (const pattern of trigger.matchPatterns) {
      if (text.includes(pattern.toLowerCase())) {
        return trigger;
      }
    }
  }
  return null;
}

export function buildSafetyInterruptResponse(trigger) {
  const isImmediateDanger =
    trigger.category === "immediate_danger" ||
    trigger.category === "violence_to_others" ||
    trigger.category === "overdose_emergency" ||
    trigger.category === "child_safety";

  const lines = [
    "It sounds like you may need urgent support right now. I'm not able to help with this directly, but Haven House is here for you.",
    `Please call Haven House on ${siteConfig.crisisNumber} now.`,
  ];

  if (isImmediateDanger) {
    lines.push(
      `If you or someone else is in immediate danger, call ${siteConfig.emergencyNumber} now.`
    );
  }

  return {
    type: "safety",
    triggerCategory: trigger.category,
    message: lines,
  };
}

// Simple keyword scoring — no model call, no external dependency, fully
// auditable. Good enough for a small, curated content set like this one.
function score(text, keywords) {
  let s = 0;
  for (const kw of keywords) {
    if (text.includes(kw.toLowerCase())) s += 1;
  }
  return s;
}

export function matchService(message) {
  const text = normalize(message);
  const services = getPublishedServices();

  let best = null;
  let bestScore = 0;

  for (const svc of services) {
    const keywords = [svc.name, svc.category.replace(/_/g, " "), svc.summary];
    const s = score(text, keywords.map(normalize));
    if (s > bestScore) {
      bestScore = s;
      best = svc;
    }
  }

  return bestScore > 0 ? best : null;
}

export function matchFaq(message) {
  const text = normalize(message);
  const faqList = getPublishedFaqs();

  let best = null;
  let bestScore = 0;

  for (const faq of faqList) {
    const s = score(text, normalize(faq.question).split(" ").filter((w) => w.length > 3));
    if (s > bestScore) {
      bestScore = s;
      best = faq;
    }
  }

  return bestScore >= 2 ? best : null;
}

export function buildServiceResponse(service) {
  const eligibility = getEligibilityForService(service.id);
  return {
    type: "service",
    service: {
      name: service.name,
      slug: service.slug,
      summary: service.summary,
      howToAccess: service.howToAccess,
    },
    eligibility: eligibility
      ? { criteriaText: eligibility.criteriaText, caveatText: eligibility.caveatText }
      : null,
  };
}

export function buildFaqResponse(faq) {
  return { type: "faq", question: faq.question, answer: faq.answer };
}

export function buildContactResponse() {
  return {
    type: "contact",
    contact: {
      generalPhone: siteConfig.generalPhone,
      crisisNumber: siteConfig.crisisNumber,
      email: siteConfig.generalEmail,
      address: siteConfig.address,
      hours: siteConfig.hours,
    },
  };
}

export function buildFallbackResponse() {
  return {
    type: "fallback",
    message:
      "I'm not sure I have information on that. You can contact Haven House directly, or try one of the options below.",
  };
}

/**
 * Main entry point used by the API route. Stateless: takes the current
 * message plus an optional intent hint from a quick-reply button, and
 * returns a single structured response. No data is persisted.
 */
export function processMessage({ message, intentHint }) {
  // 1. Safety check always runs first, regardless of hint.
  const trigger = checkSafetyTrigger(message);
  if (trigger) {
    return buildSafetyInterruptResponse(trigger);
  }

  // 2. Explicit quick-reply intents.
  if (intentHint === "contact") {
    return buildContactResponse();
  }
  if (intentHint === "urgent") {
    // Treated as a manual safety interrupt trigger (category 9 style),
    // even though no keyword necessarily matched.
    return buildSafetyInterruptResponse({
      category: "request_for_person",
    });
  }

  // 3. Free-text / general intent matching.
  const faqHit = matchFaq(message);
  if (faqHit) return buildFaqResponse(faqHit);

  const serviceHit = matchService(message);
  if (serviceHit) return buildServiceResponse(serviceHit);

  return buildFallbackResponse();
}
