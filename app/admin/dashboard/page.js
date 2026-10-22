import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import { getCategoryCountsForChart } from "@/lib/serviceCategories";
import { getMostViewedServices } from "@/lib/mostViewedServices";
import { getServicesByState } from "@/lib/servicesByState";
import ServicesPerCategoryChart from "@/components/admin/ServicesPerCategoryChart";
import MostViewedServicesChart from "@/components/admin/MostViewedServicesChart";
import ServicesByStateMap from "@/components/admin/ServicesByStateMap";
import DownloadReportButton from "@/components/admin/DownloadReportButton";

export default async function AdminDashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/admin/login");
  }

  const [adminCount, serviceCount, categoryChartData, mostViewed, stateData] = await Promise.all([
    prisma.admin.count(),
    prisma.service.count(),
    getCategoryCountsForChart(),
    getMostViewedServices(5),
    getServicesByState(),
  ]);

  return (
    <AdminShell activeHref="/admin/dashboard">
      <div className="page-header-row">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {session.firstName}.</p>
        </div>
        <DownloadReportButton />
      </div>

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
        <ServicesByStateMap data={stateData} />
      </div>
    </AdminShell>
  );
}