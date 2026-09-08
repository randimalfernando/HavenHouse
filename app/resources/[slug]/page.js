import Link from "next/link";
import { notFound } from "next/navigation";
import { getResourceBySlug, getPublishedResources } from "@/content/resources";

export function generateStaticParams() {
  return getPublishedResources()
    .filter((r) => r.type !== "external_link")
    .map((r) => ({ slug: r.slug }));
}

export default function ResourceDetailPage({ params }) {
  const resource = getResourceBySlug(params.slug);
  if (!resource || resource.type === "external_link") notFound();

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <p><Link href="/resources">← All resources</Link></p>
        <h1>{resource.title}</h1>
        <p>{resource.body}</p>
      </div>
    </section>
  );
}
