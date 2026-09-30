import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import AdminShell from "@/components/admin/AdminShell";
import NdisForm from "@/components/admin/NdisForm";

export default async function NewNdisServicePage() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell activeHref="/admin/services">
      <h1>Add NDIS Service</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        This creates a new location, service listing, and NDIS entry together.
      </p>
      <NdisForm mode="create" />
    </AdminShell>
  );
}