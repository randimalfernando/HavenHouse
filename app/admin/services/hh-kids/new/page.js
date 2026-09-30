import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import AdminShell from "@/components/admin/AdminShell";
import HhKidsForm from "@/components/admin/HhKidsForm";

export default async function NewHhKidsServicePage() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell activeHref="/admin/services">
      <h1>Add HH Kids Service</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        This creates a new location, service listing, and HH Kids program entry together.
      </p>
      <HhKidsForm mode="create" />
    </AdminShell>
  );
}