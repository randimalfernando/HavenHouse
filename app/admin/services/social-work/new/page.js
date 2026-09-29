import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import AdminShell from "@/components/admin/AdminShell";
import SocialWorkForm from "@/components/admin/SocialWorkForm";

export default async function NewSocialWorkServicePage() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell activeHref="/admin/services">
      <h1>Add Social Work Service</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        This creates a new location, service listing, and social work entry together.
      </p>
      <SocialWorkForm mode="create" />
    </AdminShell>
  );
}