import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import { getCategoryCountsForChart } from "@/lib/serviceCategories";
import { getMostViewedServices } from "@/lib/mostViewedServices";
import ServicesPerCategoryChart from "@/components/admin/ServicesPerCategoryChart";
import MostViewedServicesChart from "@/components/admin/MostViewedServicesChart";

export default async function AdminDashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/admin/login");
  }

  const [adminCount, serviceCount, categoryChartData, mostViewed] = await Promise.all([
    prisma.admin.count(),
    prisma.service.count(),
    getCategoryCountsForChart(),
    getMostViewedServices(5),
  ]);

  return (
    <AdminShell activeHref="/admin/dashboard">
      <h1>Dashboard</h1>
      <p>Welcome back, {session.firstName}.</p>

      <div className="stat-grid">
        <div className="card stat-card" style={{ "--card-accent": "#5b5ff0" }}>
          <span className="stat-card__label">Total Admins</span>
          <span className="stat-card__value">{adminCount}</span>
        </div>
        <div className="card stat-card" style={{ "--card-accent": "#ffb27a" }}>
          <span className="stat-card__label">Total Services</span>
          <span className="stat-card__value">{serviceCount}</span>
        </div>
      </div>

      <div className="dashboard-chart-grid">
        <ServicesPerCategoryChart data={categoryChartData} />
        <MostViewedServicesChart data={mostViewed} />
      </div>
    </AdminShell>
  );
}