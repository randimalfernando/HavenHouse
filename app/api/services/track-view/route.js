import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const serviceIds = Array.isArray(body?.serviceIds)
      ? body.serviceIds.filter((id) => Number.isInteger(id) && id > 0)
      : [];

    if (serviceIds.length === 0) {
      return NextResponse.json({ ok: false, error: "No valid service IDs provided." }, { status: 400 });
    }

    await prisma.service.updateMany({
      where: { id: { in: serviceIds } },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[services/track-view]", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}