import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import ProfileForm from "@/components/admin/ProfileForm";

export default async function AdminProfilePage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/admin/login");
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.adminId },
    include: { registeredByAdmin: { select: { firstName: true, lastName: true } } },
  });

  if (!admin) {
    redirect("/admin/login");
  }

  const initialData = {
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
  };

  const registeredByLabel = admin.registeredByAdmin
    ? `${admin.registeredByAdmin.firstName} ${admin.registeredByAdmin.lastName}`
    : "Self-registered (first admin account)";

  return (
    <AdminShell activeHref="/admin/profile">
      <h1>My Profile</h1>
      <p style={{ marginBottom: "1.5rem" }}>View and update your admin account details.</p>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ marginBottom: "0.4rem" }}>Account info</h3>
        <p style={{ margin: 0 }}>Member since: {new Date(admin.createdAt).toLocaleDateString()}</p>
        <p style={{ margin: 0 }}>Registered by: {registeredByLabel}</p>
      </div>

      <ProfileForm initialData={initialData} />
    </AdminShell>
  );
}