import { prisma } from "@/lib/prisma";
import { MAX_TOTAL_CHARS } from "@/lib/documentContext";
import KnowledgeDocumentForm from "@/components/admin/KnowledgeDocumentForm";
import KnowledgeDocumentActions from "@/components/admin/KnowledgeDocumentActions";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const docs = await prisma.knowledgeDocument.findMany({ orderBy: { createdAt: "asc" } });
  const used = docs.filter((d) => d.isActive).reduce((n, d) => n + d.title.length + d.content.trim().length + 5, 0);

  return (
    <div>
      <h1>Chatbot Documents</h1>
      <p style={{ opacity: 0.8 }}>
        Approved text the chatbot can use when answering. Active documents use {used} of {MAX_TOTAL_CHARS} characters.
      </p>

      <h2 style={{ marginTop: "1.5rem" }}>Add a document</h2>
      <KnowledgeDocumentForm />

      <h2 style={{ marginTop: "2rem" }}>Existing documents</h2>
      {docs.length === 0 ? (
        <p>No documents yet.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>Title</th><th>Characters</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d) => (
              <tr key={d.id} style={{ borderTop: "1px solid #444" }}>
                <td style={{ padding: "0.5rem 0" }}>{d.title}</td>
                <td>{d.content.length}</td>
                <td>{d.isActive ? "Active" : "Disabled"}</td>
                <td><KnowledgeDocumentActions id={d.id} isActive={d.isActive} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
