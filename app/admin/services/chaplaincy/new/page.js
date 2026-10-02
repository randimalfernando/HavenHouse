import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import AdminShell from "@/components/admin/AdminShell";
import ChaplaincyForm from "@/components/admin/ChaplaincyForm";

export default async function NewChaplaincyServicePage() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell activeHref="/admin/services">
      <h1>Add Chaplaincy Service</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        This creates a new location, service listing, and chaplaincy entry together.
      </p>
      <ChaplaincyForm mode="create" />
    </AdminShell>
  );
}