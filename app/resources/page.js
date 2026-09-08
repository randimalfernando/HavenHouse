import Link from "next/link";
import { getPublishedResources } from "@/content/resources";

export const metadata = { title: "Resources — Haven House" };

export default function ResourcesIndexPage() {
  const resources = getPublishedResources();

  return (
    <section className="section">
      <div className="container">
        <h1>Resources</h1>
        <div className="grid grid-cols-services">
          {resources.map((r) => (
            <article className="card" key={r.id}>
              <span className="tag">{r.type.replace(/_/g, " ")}</span>
              <h3>{r.title}</h3>
              {r.type === "external_link" ? (
                <a href={r.url} target="_blank" rel="noreferrer">Visit resource ↗</a>
              ) : (
                <Link className="card-link" href={`/resources/${r.slug}`}>Read more →</Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
