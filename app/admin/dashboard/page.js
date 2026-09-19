import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";

// Category cards map straight to the 9 "Is a" subtype tables in the ERD.
// Update this list if a new service subtype is ever added to the schema.
const SERVICE_CATEGORIES = [
  { label: "Crisis Line", countKey: "crisisLine", accent: "#ef8a62", href: "/admin/services" },
  { label: "Accommodation", countKey: "accommodation", accent: "#67a9cf", href: "/admin/services/accommodation" },
  { label: "HH Kids", countKey: "hhKids", accent: "#7fbf7b", href: "/admin/services/hh-kids" },
  { label: "Jobs Program", countKey: "jobsProgram", accent: "#f6cf65", href: "/admin/services/jobs-program" },
  { label: "Social Work", countKey: "socialWork", accent: "#af8dc3", href: "/admin/services" },
  { label: "Psychological Support", countKey: "psychological", accent: "#66c2a5", href: "/admin/services" },
  { label: "Antisemitism Resources", countKey: "antisemitism", accent: "#f4a5ae", href: "/admin/services" },
  { label: "Chaplaincy", countKey: "chaplaincy", accent: "#e6ab02", href: "/admin/services" },
  { label: "NDIS", countKey: "ndis", accent: "#8da0cb", href: "/admin/services" },
];

export default async function AdminDashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/admin/login");
  }

  const [
    adminCount,
    serviceCount,
    crisisLine,
    accommodation,
    hhKids,
    jobsProgram,
    socialWork,
    psychological,
    antisemitism,
    chaplaincy,
    ndis,
  ] = await Promise.all([
    prisma.admin.count(),
    prisma.service.count(),
    prisma.crisisLineService.count(),
    prisma.accommodationService.count(),
    prisma.hhKidsService.count(),
    prisma.jobsProgramService.count(),
    prisma.socialWorkService.count(),
    prisma.psychologicalService.count(),
    prisma.antisemitismResourceService.count(),
    prisma.chaplaincyService.count(),
    prisma.ndisService.count(),
  ]);

  const categoryCounts = {
    crisisLine, accommodation, hhKids, jobsProgram, socialWork,
    psychological, antisemitism, chaplaincy, ndis,
  };

  return (
    <AdminShell activeHref="/admin/dashboard">
      <h1>Dashboard</h1>
      <p>Welcome back, {session.firstName}.</p>

      <div className="stat-grid">
        <div className="card stat-card">
          <span className="stat-card__label">Total Admins</span>
          <span className="stat-card__value">{adminCount}</span>
        </div>
        <div className="card stat-card">
          <span className="stat-card__label">Total Services</span>
          <span className="stat-card__value">{serviceCount}</span>
        </div>
      </div>

      <h2 style={{ marginTop: "0.5rem" }}>Service Categories</h2>
      <div className="service-category-grid">
        {SERVICE_CATEGORIES.map((cat) => {
          const count = categoryCounts[cat.countKey];
          return (
            <div className="card service-category-card" key={cat.countKey}>
              <h3 style={{ marginBottom: "0.2rem" }}>{cat.label}</h3>
              <p style={{ marginBottom: "0.75rem" }}>
                {count} {count === 1 ? "service" : "services"}
              </p>
              <Link href="/admin/services" className="card-link">
                Manage →
              </Link>
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}