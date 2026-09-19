import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminServicesPage() {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell activeHref="/admin/services">
      <h1>Manage Services</h1>
      <p>Choose a category to manage its services.</p>
      <ul style={{ marginTop: "1rem" }}>
        <li><Link href="/admin/services/hh-kids">HH Kids</Link></li>
        <li>Crisis Line — coming soon</li>
        <li><Link href="/admin/services/accommodation">Accommodation</Link></li>
        <li><Link href="/admin/services/jobs-program">Jobs Program</Link></li>
        <li>Social Work — coming soon</li>
        <li>Psychological Support — coming soon</li>
        <li>Antisemitism Resources — coming soon</li>
        <li>Chaplaincy — coming soon</li>
        <li>NDIS — coming soon</li>
      </ul>
    </AdminShell>
  );
}