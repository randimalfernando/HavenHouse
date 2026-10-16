import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import DeleteContactSubmissionButton from "@/components/admin/DeleteContactSubmissionButton";

export const dynamic = "force-dynamic";

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Australia/Sydney",
  }).format(new Date(value));
}

function preview(text, max = 90) {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + "…" : t;
}

export default async function ContactSubmissionsPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/admin/login");
  }

  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <AdminShell activeHref="/admin/contact-submissions">
      <h1>Contact Messages</h1>
      <p>
        {submissions.length === 0
          ? "No messages yet."
          : `${submissions.length} message${submissions.length === 1 ? "" : "s"} from visitors.`}
      </p>

      {submissions.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Received</th>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id}>
                  <td>{formatDate(s.createdAt)}</td>
                  <td>{s.name}</td>
                  <td>
                    <a href={`mailto:${s.email}`}>{s.email}</a>
                  </td>
                  <td>{preview(s.message)}</td>
                  <td className="admin-table__actions">
                    <DeleteContactSubmissionButton id={s.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}