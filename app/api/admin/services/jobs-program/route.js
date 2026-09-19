import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiSession } from "@/lib/auth";

export async function POST(request) {
  const session = await requireApiSession(request);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const serviceName = (body?.serviceName || "").toString().trim().slice(0, 150);
    const description = (body?.description || "").toString().trim().slice(0, 500);
    const contactPhone = (body?.contactPhone || "").toString().trim().slice(0, 20);
    const contactEmail = (body?.contactEmail || "").toString().trim().slice(0, 80);
    const addressLine = (body?.addressLine || "").toString().trim().slice(0, 255);
    const suburb = (body?.suburb || "").toString().trim().slice(0, 100);
    const postalCode = (body?.postalCode || "").toString().trim().slice(0, 50);
    const durationWeeks = Number(body?.durationWeeks);
    const certificationProvided = Boolean(body?.certificationProvided);

    if (
      !serviceName || !addressLine || !suburb || !postalCode ||
      !Number.isInteger(durationWeeks) || durationWeeks <= 0
    ) {
      return NextResponse.json(
        { ok: false, error: "Service name, address, suburb, postal code, and a valid duration in weeks are required." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const location = await tx.location.create({
        data: { addressLine, suburb, postalCode },
      });

      const service = await tx.service.create({
        data: {
          serviceName,
          description: description || null,
          contactPhone: contactPhone || null,
          contactEmail: contactEmail || null,
          locationId: location.id,
        },
      });

      const jobsProgram = await tx.jobsProgramService.create({
        data: { serviceId: service.id, durationWeeks, certificationProvided },
      });

      return { service, jobsProgram };
    });

    return NextResponse.json({ ok: true, id: result.service.id });
  } catch (err) {
    console.error("[admin/services/jobs-program POST]", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong creating the service." },
      { status: 500 }
    );
  }
}