import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/session";
import RegisterForm from "@/components/admin/RegisterForm";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminRegisterPage() {
  const adminCount = await prisma.admin.count();
  const session = await getServerSession();
  const isBootstrap = adminCount === 0;
  const isAuthenticated = !!session;

  if (!isBootstrap && !isAuthenticated) {
    return (
      <section className="section">
        <div className="container" style={{ maxWidth: 480 }}>
          <h1>Admin Registration</h1>
          <div className="card">
            <p style={{ margin: 0 }}>
              New admin accounts can only be created by an existing admin. If you&apos;re staff or
              a volunteer who needs access, ask an existing admin to log in and register your
              account for you.
            </p>
          </div>
          <p style={{ marginTop: "1.5rem", fontSize: "0.9rem" }}>
            Already have an account? <Link href="/admin/login">Log in</Link>
          </p>
        </div>
      </section>
    );
  }

  const formContent = (
    <>
      <h1>Admin Registration</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        {isBootstrap
          ? "No admin accounts exist yet — create the first one to get started."
          : "Create a new staff/volunteer account. You'll stay logged in as yourself; the new account is for them to log into separately."}
      </p>
      <RegisterForm isBootstrap={isBootstrap} />
    </>
  );

  if (isAuthenticated) {
    return <AdminShell activeHref="/admin/register">{formContent}</AdminShell>;
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 480 }}>
        {formContent}
      </div>
    </section>
  );
}