import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiSession } from "@/lib/auth";

export async function PUT(request, { params }) {
  const session = await requireApiSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  const body = await request.json().catch(() => ({}));
  const doc = await prisma.knowledgeDocument.update({
    where: { id },
    data: { isActive: Boolean(body.isActive) },
  });
  return NextResponse.json(doc);
}

export async function DELETE(request, { params }) {
  const session = await requireApiSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.knowledgeDocument.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ ok: true });
}
