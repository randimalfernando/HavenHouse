import { prisma } from "@/lib/prisma";

// key = Prisma relation name on Service, slug = the /services/[slug] page.
// `words` are everyday terms people might type, so "homeless" finds Accommodation.
const CATEGORIES = [
  { key: "crisisLine", slug: "crisis-line", label: "Crisis Line", words: ["crisis", "emergency", "urgent", "helpline", "phone", "call", "talk", "24/7", "suicide", "distress"] },
  { key: "accommodation", slug: "accommodation", label: "Accommodation", words: ["housing", "homeless", "shelter", "stay", "sleep", "bed", "rent", "refuge", "temporary", "home"] },
  { key: "psychological", slug: "psychological-support", label: "Psychological Support", words: ["psychology", "psychologist", "counselling", "counseling", "mental", "anxiety", "depression", "therapy", "stress", "mood"] },
  { key: "ndis", slug: "ndis", label: "NDIS Services", words: ["disability", "ndis", "carer", "funding", "support worker"] },
  { key: "hhKids", slug: "hh-kids", label: "HH Kids", words: ["kids", "children", "child", "teen", "youth", "young", "parent", "family", "school"] },
  { key: "chaplaincy", slug: "chaplaincy", label: "Chaplaincy", words: ["chaplain", "faith", "spiritual", "pastoral", "religion", "prayer", "rabbi"] },
  { key: "jobsProgram", slug: "jobs-program", label: "Jobs Program", words: ["job", "jobs", "work", "employment", "career", "training", "resume", "cv", "unemployed"] },
  { key: "antisemitism", slug: "antisemitism-resources", label: "Antisemitism Resources", words: ["antisemitism", "jewish", "hate", "discrimination", "abuse", "racism"] },
  { key: "socialWork", slug: "social-work", label: "Social Work", words: ["social", "advocacy", "paperwork", "centrelink", "benefits", "walk-in", "walk in", "navigate", "support"] },
];

export const MIN_QUERY = 2;
export const MAX_QUERY = 60;
const MAX_RESULTS = 8;

function normalise(s) {
  return String(s || "").toLowerCase().trim();
}

function snippet(text, max = 110) {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + "…" : t;
}

export function cleanQuery(raw) {
  return String(raw || "").replace(/\s+/g, " ").trim().slice(0, MAX_QUERY);
}

export async function searchServices(rawQuery) {
  const q = normalise(cleanQuery(rawQuery));
  if (q.length < MIN_QUERY) return [];

  const terms = q.split(" ").filter((t) => t.length >= 2);

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
  });

  const scored = [];
  for (const s of services) {
    const cat = CATEGORIES.find((c) => s[c.key]);
    if (!cat) continue; // not listed publicly without a category record

    const name = normalise(s.serviceName);
    const desc = normalise(s.description);
    const suburb = normalise(s.location?.suburb);
    const label = normalise(cat.label);

    let score = 0;
    if (name === q) score += 100;
    else if (name.startsWith(q)) score += 80;
    else if (name.includes(q)) score += 60;
    if (label.includes(q)) score += 40;
    if (desc.includes(q)) score += 25;
    if (suburb && suburb.includes(q)) score += 20;
    if (cat.words.some((w) => w.includes(q) || q.includes(w))) score += 30;

    // multi-word queries: reward each word that matches somewhere
    if (terms.length > 1) {
      for (const t of terms) {
        if (name.includes(t)) score += 12;
        else if (desc.includes(t)) score += 6;
        else if (label.includes(t) || cat.words.some((w) => w.includes(t))) score += 8;
      }
    }

    if (score > 0) {
      scored.push({
        score,
        name: s.serviceName,
        description: snippet(s.description),
        category: cat.label,
        slug: cat.slug,
        phone: s.contactPhone || "",
        suburb: s.location?.suburb || "",
      });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
  return scored.slice(0, MAX_RESULTS).map(({ score, ...rest }) => rest);
}
