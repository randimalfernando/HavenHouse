import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import DeleteServiceButton from "@/components/admin/DeleteServiceButton";

export default async function CrisisLineListPage() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  const records = await prisma.crisisLineService.findMany({
    include: { service: { include: { location: true } } },
    orderBy: { serviceId: "desc" },
  });

  return (
    <AdminShell activeHref="/admin/services">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <h1 style={{ margin: 0 }}>Crisis Line Services</h1>
        <Link href="/admin/services/crisis-line/new" className="btn btn-primary">
          + Add New
        </Link>
      </div>

      {records.length === 0 ? (
        <p style={{ marginTop: "1.5rem" }}>
          No crisis line services yet — click &quot;Add New&quot; to create the first one.
        </p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Languages Supported</th>
                <th>Suburb</th>
                <th>Contact</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.serviceId}>
                  <td>{r.service.serviceName}</td>
                  <td>{r.languagesSupported}</td>
                  <td>{r.service.location?.suburb || "—"}</td>
                  <td>{r.service.contactPhone || r.service.contactEmail || "—"}</td>
                  <td className="admin-table__actions">
                    <Link href={`/admin/services/crisis-line/${r.serviceId}/edit`} className="table-action">
                      Edit
                    </Link>
                    <DeleteServiceButton serviceId={r.serviceId} apiPath="/api/admin/services/crisis-line" />
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