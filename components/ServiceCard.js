import Link from "next/link";
import ServiceCardImage from "@/components/ServiceCardImage";

export default function ServiceCard({ service }) {
  return (
    <article className="card">
      <ServiceCardImage slug={service.slug} alt={`${service.name} photo`} ratio="wide" />
      <span className="tag">{service.category.replace(/_/g, " ")}</span>
      <h3>{service.name}</h3>
      <p>{service.summary}</p>
      <Link className="card-link" href={`/services/${service.slug}`}>
        Learn more →
      </Link>
    </article>
  );
}
