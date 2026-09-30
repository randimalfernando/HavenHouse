import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import AdminShell from "@/components/admin/AdminShell";
import AccommodationForm from "@/components/admin/AccommodationForm";

export default async function NewAccommodationServicePage() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell activeHref="/admin/services">
      <h1>Add Accommodation Service</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        This creates a new location, service listing, and accommodation entry together.
      </p>
      <AccommodationForm mode="create" />
    </AdminShell>
  );
}