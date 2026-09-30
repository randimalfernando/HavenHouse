import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import AdminShell from "@/components/admin/AdminShell";
import PsychologicalForm from "@/components/admin/PsychologicalForm";

export default async function NewPsychologicalServicePage() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell activeHref="/admin/services">
      <h1>Add Psychological Support Service</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        This creates a new location, service listing, and psychological support entry together.
      </p>
      <PsychologicalForm mode="create" />
    </AdminShell>
  );
}