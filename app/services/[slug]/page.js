import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug, getPublishedServices } from "@/content/services";
import { getEligibilityForService } from "@/content/eligibility";
import { getFaqsForService } from "@/content/faqs";
import { getPublishedResources } from "@/content/resources";
import Accordion from "@/components/Accordion";

export function generateStaticParams() {
  return getPublishedServices().map((s) => ({ slug: s.slug }));
}

export default function ServiceDetailPage({ params }) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const eligibility = getEligibilityForService(service.id);
  const relatedFaqs = getFaqsForService(service.id);
  const relatedResources = getPublishedResources().filter((r) =>
    r.relatedServiceIds?.includes(service.id)
  );

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <p><Link href="/services">← All services</Link></p>
        <span className="tag">{service.category.replace(/_/g, " ")}</span>
        <h1>{service.name}</h1>
        <p style={{ fontSize: "1.1rem" }}>{service.description}</p>

        <h2>How to access this</h2>
        <p>{service.howToAccess}</p>

        {eligibility && (
          <>
            <h2>Eligibility guidance</h2>
            <div className="eligibility-box">
              <p style={{ margin: 0 }}>{eligibility.criteriaText}</p>
              <p className="eligibility-caveat">{eligibility.caveatText}</p>
            </div>
          </>
        )}

        {relatedFaqs.length > 0 && (
          <>
            <h2>Related questions</h2>
            <Accordion items={relatedFaqs} />
          </>
        )}

        {relatedResources.length > 0 && (
          <>
            <h2>Related resources</h2>
            <ul>
              {relatedResources.map((r) => (
                <li key={r.id}>
                  {r.type === "external_link" ? (
                    <a href={r.url} target="_blank" rel="noreferrer">{r.title} ↗</a>
                  ) : (
                    <Link href={`/resources/${r.slug}`}>{r.title}</Link>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="card" style={{ marginTop: "2rem" }}>
          <h3 style={{ marginBottom: "0.3rem" }}>Not sure this is the right fit?</h3>
          <p style={{ marginBottom: "0.6rem" }}>
            Use the assistant in the corner of the screen, or try Find Support for a guided
            option.
          </p>
          <Link href="/find-support" className="btn btn-secondary" style={{ width: "fit-content" }}>
            Go to Find Support
          </Link>
        </div>
      </div>
    </section>
  );
}
