import { redirect, notFound } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import PsychologicalForm from "@/components/admin/PsychologicalForm";

export default async function EditPsychologicalServicePage({ params }) {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  const serviceId = Number(params.id);
  if (!Number.isInteger(serviceId)) notFound();

  const record = await prisma.psychologicalService.findUnique({
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
    specialisation: record.specialisation,
  };

  return (
    <AdminShell activeHref="/admin/services">
      <h1>Edit Psychological Support Service</h1>
      <PsychologicalForm mode="edit" serviceId={serviceId} initialData={initialData} />
    </AdminShell>
  );
}