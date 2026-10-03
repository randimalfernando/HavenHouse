import Link from "next/link";
import { notFound } from "next/navigation";
import { getServiceBySlug, getPublishedServices } from "@/content/services";
import { getFaqsForService } from "@/content/faqs";
import { getPublishedResources } from "@/content/resources";
import Accordion from "@/components/Accordion";
import ServiceCardImage from "@/components/ServiceCardImage";
import CategoryIcon from "@/components/CategoryIcon";
import ServiceViewTracker from "@/components/ServiceViewTracker";
import { getDbServicesForCategory } from "@/lib/publicServiceCategory";

export function generateStaticParams() {
  return getPublishedServices().map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({ params }) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const relatedFaqs = getFaqsForService(service.id);
  const relatedResources = getPublishedResources().filter((r) =>
    r.relatedServiceIds?.includes(service.id)
  );
  const { records: dbServices, fields: dbFields } = await getDbServicesForCategory(
    service.category
  );

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 760 }}>
        <p><Link href="/services">← All services</Link></p>
        <ServiceCardImage slug={service.slug} alt={`${service.name} photo`} ratio="banner" />
        <span className="tag" style={{ marginTop: "1.25rem" }}>{service.category.replace(/_/g, " ")}</span>
        <h1>{service.name}</h1>
        <p style={{ fontSize: "1.1rem" }}>{service.description}</p>

        <h2>Available {service.name} services</h2>

        {dbServices.length > 0 && (
          <ServiceViewTracker serviceIds={dbServices.map((r) => r.serviceId)} />
        )}

        {dbServices.length === 0 ? (
          <p style={{ opacity: 0.85 }}>
            No services are currently listed in this category. Please check back soon, or
            contact Haven House directly for the latest availability.
          </p>
        ) : (
          <div className="db-service-grid">
            {dbServices.map((r) => (
              <div className="db-service-card" key={r.serviceId}>
                <CategoryIcon category={service.category} />
                <h3>{r.service.serviceName}</h3>
                {r.service.description && (
                  <p className="db-service-card__desc">{r.service.description}</p>
                )}
                <dl className="db-service-card__meta">
                  {r.service.location?.suburb && (
                    <div className="db-service-card__row">
                      <dt>Location</dt>
                      <dd>{r.service.location.suburb}</dd>
                    </div>
                  )}
                  {r.service.contactPhone && (
                    <div className="db-service-card__row">
                      <dt>Phone</dt>
                      <dd>{r.service.contactPhone}</dd>
                    </div>
                  )}
                  {r.service.contactEmail && (
                    <div className="db-service-card__row">
                      <dt>Email</dt>
                      <dd>{r.service.contactEmail}</dd>
                    </div>
                  )}
                  {dbFields.map((f) => {
                    const value = r[f.key];
                    if (value === null || value === undefined || value === "") return null;
                    return (
                      <div className="db-service-card__row" key={f.key}>
                        <dt>{f.label}</dt>
                        <dd>{f.boolean ? (value ? "Yes" : "No") : String(value)}</dd>
                      </div>
                    );
                  })}
                </dl>
              </div>
            ))}
          </div>
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