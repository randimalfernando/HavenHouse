import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import { SERVICE_CATEGORIES } from "@/lib/serviceCategories";

export default async function AdminServicesPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/admin/login");
  }

  const [
    crisisLine, accommodation, hhKids, jobsProgram, socialWork,
    psychological, antisemitism, chaplaincy, ndis,
  ] = await Promise.all([
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
    <AdminShell activeHref="/admin/services">
      <h1>Manage Services</h1>
      <p>Choose a category to view, add, edit, or remove its services.</p>

      <div className="service-category-grid" style={{ marginTop: "1.5rem" }}>
        {SERVICE_CATEGORIES.map((cat, index) => {
          const count = categoryCounts[cat.countKey];
          const isTrailingCard =
            SERVICE_CATEGORIES.length % 4 === 1 && index === SERVICE_CATEGORIES.length - 1;

          return (
            <div
              className={"card service-category-card" + (isTrailingCard ? " service-category-card--wide" : "")}
              key={cat.countKey}
              style={{ "--card-accent": cat.accent }}
            >
              {isTrailingCard ? (
                <>
                  <div>
                    <h3 style={{ marginBottom: "0.2rem" }}>{cat.label}</h3>
                    <p style={{ margin: 0 }}>
                      {count} {count === 1 ? "service" : "services"}
                    </p>
                  </div>
                  <Link href={cat.href} className="card-link">
                    Manage →
                  </Link>
                </>
              ) : (
                <>
                  <h3 style={{ marginBottom: "0.2rem" }}>{cat.label}</h3>
                  <p style={{ marginBottom: "0.75rem" }}>
                    {count} {count === 1 ? "service" : "services"}
                  </p>
                  <Link href={cat.href} className="card-link">
                    Manage →
                  </Link>
                </>
              )}
            </div>
          );
        })}
      </div>
    </AdminShell>
  );
}