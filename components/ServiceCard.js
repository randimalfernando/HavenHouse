import Link from "next/link";

export default function ServiceCard({ service }) {
  return (
    <article className="card">
      <span className="tag">{service.category.replace(/_/g, " ")}</span>
      <h3>{service.name}</h3>
      <p>{service.summary}</p>
      <Link className="card-link" href={`/services/${service.slug}`}>
        Learn more →
      </Link>
    </article>
  );
}
