import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { getPublishedServices } from "@/content/services";
import { getPublishedResources } from "@/content/resources";
import { siteConfig } from "@/lib/siteConfig";

export default function HomePage() {
  const services = getPublishedServices();
  const resources = getPublishedResources().slice(0, 2);

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div>
            <span className="hero__eyebrow">{siteConfig.orgName} · {siteConfig.suburb}</span>
            <h1>A steady place to find the right support.</h1>
            <p style={{ fontSize: "1.15rem", maxWidth: "48ch" }}>
              [PLACEHOLDER] A short, warm sentence describing what Haven House does, written in
              Haven House's own voice.
            </p>
            <div className="hero__actions">
              <Link href="/find-support" className="btn btn-primary">Find Support</Link>
              <a href="#chatbot-entry" className="btn btn-secondary">Talk to our Assistant</a>
            </div>
          </div>
          <div className="beacon-hero" aria-hidden="true" />
        </div>
      </section>

      <section className="section section-quiet">
        <div className="container">
          <h2>How can we help?</h2>
          <p>Choose an area below to learn more, or use Find Support if you're not sure where to start.</p>
          <div className="grid grid-cols-services">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ display: "grid", gap: "1.5rem", alignItems: "center" }}>
          <div className="card" style={{ maxWidth: 640 }}>
            <h2 style={{ marginBottom: "0.4rem" }}>Not sure where to start?</h2>
            <p>
              Find Support is a short, guided way to work out which service might be relevant to
              you. It's not a diagnosis or an assessment — just a pointer in the right direction.
            </p>
            <Link href="/find-support" className="btn btn-primary" style={{ width: "fit-content" }}>
              Go to Find Support
            </Link>
          </div>
        </div>
      </section>

      <section id="chatbot-entry" className="section section-quiet">
        <div className="container">
          <div className="card" style={{ maxWidth: 640 }}>
            <span className="tag">Digital assistant</span>
            <h2 style={{ marginBottom: "0.4rem" }}>Ask our assistant</h2>
            <p>
              Our assistant can help you find services, answer general questions, and share
              contact details. It can't provide medical, psychological, legal, or crisis advice —
              and it doesn't save your conversation.
            </p>
            <p style={{ fontWeight: 700 }}>Use the "Chat with our assistant" button in the corner of the screen to get started.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>About Haven House</h2>
          <p style={{ maxWidth: "60ch" }}>
            [PLACEHOLDER] A short "about" summary for the homepage, with a link to the full About
            page.
          </p>
          <Link href="/about" className="btn btn-secondary">More about us</Link>
        </div>
      </section>

      <section className="section section-quiet">
        <div className="container">
          <h2>Resources</h2>
          <div className="grid grid-cols-services">
            {resources.map((r) => (
              <article className="card" key={r.id}>
                <h3>{r.title}</h3>
                {r.type === "external_link" ? (
                  <a href={r.url} target="_blank" rel="noreferrer">Visit resource ↗</a>
                ) : (
                  <Link className="card-link" href={`/resources/${r.slug}`}>Read more →</Link>
                )}
              </article>
            ))}
          </div>
          <div style={{ marginTop: "1.25rem" }}>
            <Link href="/resources" className="btn btn-secondary">See all resources</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>Contact</h2>
          <p>
            General enquiries: <strong>{siteConfig.generalPhone}</strong><br />
            24/7 crisis line: <strong>{siteConfig.crisisNumber}</strong>
          </p>
          <Link href="/contact" className="btn btn-secondary">Full contact details</Link>
        </div>
      </section>
    </>
  );
}
