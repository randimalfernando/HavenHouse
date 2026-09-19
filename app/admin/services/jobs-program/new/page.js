import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import AdminShell from "@/components/admin/AdminShell";
import JobsProgramForm from "@/components/admin/JobsProgramForm";

export default async function NewJobsProgramServicePage() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell activeHref="/admin/services">
      <h1>Add Jobs Program Service</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        This creates a new location, service listing, and jobs program entry together.
      </p>
      <JobsProgramForm mode="create" />
    </AdminShell>
  );
}