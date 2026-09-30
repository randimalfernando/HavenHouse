import { redirect, notFound } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import JobsProgramForm from "@/components/admin/JobsProgramForm";

export default async function EditJobsProgramServicePage({ params }) {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  const serviceId = Number(params.id);
  if (!Number.isInteger(serviceId)) notFound();

  const record = await prisma.jobsProgramService.findUnique({
    where: { serviceId },
    include: { service: { include: { location: true } } },
  });

  if (!record) notFound();

  const initialData = {
    serviceName: record.service.serviceName,
    description: record.service.description || "",
    contactPhone: record.service.contactPhone || "",
    contactEmail: record.service.contactEmail || "",
    addressLine: record.service.location.addressLine,
    suburb: record.service.location.suburb,
    postalCode: record.service.location.postalCode,
    durationWeeks: record.durationWeeks,
    certificationProvided: record.certificationProvided,
  };

  return (
    <AdminShell activeHref="/admin/services">
      <h1>Edit Jobs Program Service</h1>
      <JobsProgramForm mode="edit" serviceId={serviceId} initialData={initialData} />
    </AdminShell>
  );
}