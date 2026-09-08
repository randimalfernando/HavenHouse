"use client";

import { useState } from "react";
import Link from "next/link";
import { services } from "@/content/services";

// A simple, button-only alternative to the chatbot for people who prefer
// not to type. Purely a mapping to service categories — no eligibility
// decisions, no advice, no safety detection needed here since it never
// accepts free text.

const NEEDS = [
  { label: "I need somewhere safe to stay", categories: ["temporary_accommodation", "crisis_support"] },
  { label: "I'm affected by domestic or family violence", categories: ["dfv", "crisis_support"] },
  { label: "I'd like mental health support", categories: ["mental_health"] },
  { label: "I'd like support with alcohol or other drugs", categories: ["addiction"] },
  { label: "I'm looking for NDIS-related support", categories: ["ndis"] },
  { label: "I'm looking for support for my kids or family", categories: ["hh_kids"] },
  { label: "I'd like pastoral or chaplaincy support", categories: ["chaplaincy"] },
  { label: "I'm looking for work or employment support", categories: ["employment"] },
  { label: "I'm affected by antisemitism", categories: ["antisemitism_support"] },
];

export default function FindSupportPage() {
  const [selected, setSelected] = useState(null);

  const matches = selected
    ? services.filter((s) => selected.categories.includes(s.category))
    : [];

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1>Find Support</h1>
        <p>
          Choose the option below that best describes what you need help with. This will point
          you to relevant Haven House services — it doesn't make a decision for you, and it isn't
          a substitute for talking to Haven House directly.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", margin: "1.5rem 0" }}>
          {NEEDS.map((need) => (
            <button
              key={need.label}
              className="btn btn-quiet"
              style={{ justifyContent: "flex-start", textAlign: "left" }}
              onClick={() => setSelected(need)}
              aria-pressed={selected?.label === need.label}
            >
              {need.label}
            </button>
          ))}
        </div>

        {selected && (
          <div className="card" role="region" aria-live="polite">
            <h2 style={{ marginBottom: "0.4rem" }}>Services that may help</h2>
            <ul>
              {matches.map((s) => (
                <li key={s.id}>
                  <Link href={`/services/${s.slug}`}>{s.name}</Link> — {s.summary}
                </li>
              ))}
            </ul>
            <p style={{ marginTop: "1rem" }}>
              Prefer to talk it through? Use the assistant in the corner of the screen, or{" "}
              <Link href="/contact">contact Haven House directly</Link>.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
