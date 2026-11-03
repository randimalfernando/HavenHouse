import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import KnowledgeDocumentForm from "@/components/admin/KnowledgeDocumentForm";

export const dynamic = "force-dynamic";

export default async function EditKnowledgeDocumentPage({ params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id)) notFound();

  const doc = await prisma.knowledgeDocument.findUnique({ where: { id } });
  if (!doc) notFound();

  return (
    <AdminShell activeHref="/admin/knowledge">
      {/* <Link href="/admin/knowledge" style={{ display: "inline-block", marginBottom: "0.75rem", opacity: 0.8 }}>
        ← Back to Chatbot Documents
      </Link> */}

      <h1 style={{ margin: "0 0 0.4rem" }}>Edit document</h1>
      <p style={{ margin: "0 0 1.25rem", opacity: 0.8 }}>
        Changes apply to the chatbot from its next message.
      </p>

      <section
        style={{
          border: "1px solid rgba(128,128,160,0.25)",
          borderRadius: 14,
          padding: "1.25rem",
          background: "rgba(128,128,160,0.07)",
          maxWidth: 900,
        }}
      >
        <KnowledgeDocumentForm doc={{ id: doc.id, title: doc.title, content: doc.content }} />
      </section>
    </AdminShell>
  );
}