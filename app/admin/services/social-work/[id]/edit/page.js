import { redirect, notFound } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import SocialWorkForm from "@/components/admin/SocialWorkForm";

export default async function EditSocialWorkServicePage({ params }) {
  const session = await getServerSession();
  if (!session) redirect("/admin/login");

  const serviceId = Number(params.id);
  if (!Number.isInteger(serviceId)) notFound();

  const record = await prisma.socialWorkService.findUnique({
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
    walkInAvailable: record.walkInAvailable,
  };

  return (
    <AdminShell activeHref="/admin/services">
      <h1>Edit Social Work Service</h1>
      <SocialWorkForm mode="edit" serviceId={serviceId} initialData={initialData} />
    </AdminShell>
  );
}