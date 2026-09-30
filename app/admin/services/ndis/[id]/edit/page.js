import { redirect, notFound } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import NdisForm from "@/components/admin/NdisForm";

export default async function EditNdisServicePage({ params }) {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  const serviceId = Number(params.id);
  if (!Number.isInteger(serviceId)) notFound();

  const record = await prisma.ndisService.findUnique({
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
    ndisRegistrationNumber: record.ndisRegistrationNumber,
  };

  return (
    <AdminShell activeHref="/admin/services">
      <h1>Edit NDIS Service</h1>
      <NdisForm mode="edit" serviceId={serviceId} initialData={initialData} />
    </AdminShell>
  );
}