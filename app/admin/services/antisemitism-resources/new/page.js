import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import AdminShell from "@/components/admin/AdminShell";
import AntisemitismForm from "@/components/admin/AntisemitismForm";

export default async function NewAntisemitismServicePage() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell activeHref="/admin/services">
      <h1>Add Antisemitism Resource Service</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        This creates a new location and service listing under this category.
      </p>
      <AntisemitismForm mode="create" />
    </AdminShell>
  );
}
