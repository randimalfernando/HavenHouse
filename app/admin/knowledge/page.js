import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { MAX_TOTAL_CHARS } from "@/lib/documentContext";
import AdminShell from "@/components/admin/AdminShell";
import KnowledgeDocumentForm from "@/components/admin/KnowledgeDocumentForm";
import KnowledgeDocumentActions from "@/components/admin/KnowledgeDocumentActions";

export const dynamic = "force-dynamic";

const card = {
  border: "1px solid rgba(128,128,160,0.25)",
  borderRadius: 14,
  padding: "1.25rem",
  background: "rgba(128,128,160,0.07)",
};

export default async function KnowledgePage() {
  const docs = await prisma.knowledgeDocument.findMany({ orderBy: { createdAt: "asc" } });
  const used = docs
    .filter((d) => d.isActive)
    .reduce((n, d) => n + d.title.length + d.content.trim().length + 5, 0);
  const pct = Math.min(100, Math.round((used / MAX_TOTAL_CHARS) * 100));

  return (
    <AdminShell activeHref="/admin/knowledge">

      <div className="page-header-row">
        <div>
          <h1 style={{ margin: 0 }}>Chatbot Documents</h1>
          <p style={{ margin: "0.4rem 0 0", opacity: 0.8 }}>
            Approved text the chatbot can use when answering.
          </p>
        </div>
        <div style={{ minWidth: 220 }}>
          <div style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: 4 }}>
            {used} of {MAX_TOTAL_CHARS} characters used
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "rgba(128,128,160,0.25)" }}>
            <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: "#7c5cff" }} />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "1.25rem", alignItems: "start" }}>
        <section style={card}>
          <h2 style={{ marginTop: 0, fontSize: "1.15rem" }}>Add a document</h2>
          <KnowledgeDocumentForm />
        </section>

        <section style={card}>
          <h2 style={{ marginTop: 0, fontSize: "1.15rem" }}>Existing documents</h2>
          {docs.length === 0 ? (
            <p style={{ opacity: 0.8 }}>No documents yet.</p>
          ) : (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {docs.map((d) => (
                <div
                  key={d.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                    paddingBottom: "0.75rem",
                    borderBottom: "1px solid rgba(128,128,160,0.2)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{d.title}</div>
                    <div style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                      {d.content.length} characters · {d.isActive ? "Active" : "Disabled"}
                    </div>
                  </div>
                  <KnowledgeDocumentActions id={d.id} isActive={d.isActive} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}