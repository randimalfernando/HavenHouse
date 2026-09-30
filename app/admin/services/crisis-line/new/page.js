import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import AdminShell from "@/components/admin/AdminShell";
import CrisisLineForm from "@/components/admin/CrisisLineForm";

export default async function NewCrisisLineServicePage() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell activeHref="/admin/services">
      <h1>Add Crisis Line Service</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        This creates a new location, service listing, and crisis line entry together.
      </p>
      <CrisisLineForm mode="create" />
    </AdminShell>
  );
}