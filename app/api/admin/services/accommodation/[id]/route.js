import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiSession } from "@/lib/auth";

export async function PUT(request, { params }) {
  const session = await requireApiSession(request);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  }

  const serviceId = Number(params.id);
  if (!Number.isInteger(serviceId)) {
    return NextResponse.json({ ok: false, error: "Invalid service id." }, { status: 400 });
  }

  try {
    const existing = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!existing) {
      return NextResponse.json({ ok: false, error: "Service not found." }, { status: 404 });
    }

    const body = await request.json();
    const serviceName = (body?.serviceName || "").toString().trim().slice(0, 150);
    const description = (body?.description || "").toString().trim().slice(0, 500);
    const contactPhone = (body?.contactPhone || "").toString().trim().slice(0, 20);
    const contactEmail = (body?.contactEmail || "").toString().trim().slice(0, 80);
    const addressLine = (body?.addressLine || "").toString().trim().slice(0, 255);
    const suburb = (body?.suburb || "").toString().trim().slice(0, 100);
    const postalCode = (body?.postalCode || "").toString().trim().slice(0, 50);
    const accommodationType = (body?.accommodationType || "").toString().trim().slice(0, 100);
    const capacity = Number(body?.capacity);

    if (
      !serviceName || !addressLine || !suburb || !postalCode || !accommodationType ||
      !Number.isInteger(capacity) || capacity < 0
    ) {
      return NextResponse.json(
        { ok: false, error: "Service name, address, suburb, postal code, accommodation type, and a valid capacity are required." },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.location.update({
        where: { id: existing.locationId },
        data: { addressLine, suburb, postalCode },
      }),
      prisma.service.update({
        where: { id: serviceId },
        data: {
          serviceName,
          description: description || null,
          contactPhone: contactPhone || null,
          contactEmail: contactEmail || null,
        },
      }),
      prisma.accommodationService.update({
        where: { serviceId },
        data: { accommodationType, capacity },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/services/accommodation PUT]", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong updating the service." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const session = await requireApiSession(request);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  }

  const serviceId = Number(params.id);
  if (!Number.isInteger(serviceId)) {
    return NextResponse.json({ ok: false, error: "Invalid service id." }, { status: 400 });
  }

  try {
    const existing = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!existing) {
      return NextResponse.json({ ok: false, error: "Service not found." }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.accommodationService.delete({ where: { serviceId } }),
      prisma.service.delete({ where: { id: serviceId } }),
      prisma.location.delete({ where: { id: existing.locationId } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/services/accommodation DELETE]", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong deleting the service." },
      { status: 500 }
    );
  }
}