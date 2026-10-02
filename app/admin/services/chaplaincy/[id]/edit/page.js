import { redirect, notFound } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import ChaplaincyForm from "@/components/admin/ChaplaincyForm";

export default async function EditChaplaincyServicePage({ params }) {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  const serviceId = Number(params.id);
  if (!Number.isInteger(serviceId)) notFound();

  const record = await prisma.chaplaincyService.findUnique({
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
    languagesOffered: record.languagesOffered,
  };

  return (
    <AdminShell activeHref="/admin/services">
      <h1>Edit Chaplaincy Service</h1>
      <ChaplaincyForm mode="edit" serviceId={serviceId} initialData={initialData} />
    </AdminShell>
  );
}