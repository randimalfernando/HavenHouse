import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import DeleteContactSubmissionButton from "@/components/admin/DeleteContactSubmissionButton";

export default async function ContactSubmissionsPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/admin/login");
  }

  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell activeHref="/admin/contact-submissions">
      <h1>Contact Messages</h1>
      <p style={{ marginBottom: "1.5rem" }}>Messages submitted through the public Contact page.</p>

      {submissions.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {submissions.map((s) => (
            <div className="card" key={s.id}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  marginBottom: "0.5rem",
                }}
              >
                <div>
                  <h3 style={{ margin: 0 }}>{s.name}</h3>
                  <p style={{ margin: 0, opacity: 0.8, fontSize: "0.9rem" }}>{s.email}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                    {new Date(s.createdAt).toLocaleString()}
                  </span>
                  <DeleteContactSubmissionButton id={s.id} />
                </div>
              </div>
              <p style={{ margin: 0, whiteSpace: "pre-line" }}>{s.message}</p>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}