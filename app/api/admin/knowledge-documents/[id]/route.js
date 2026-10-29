import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiSession } from "@/lib/auth";

export async function PUT(request, { params }) {
  const session = await requireApiSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  const body = await request.json().catch(() => ({}));
  const data = {};

  if (body.title !== undefined) {
    const title = String(body.title).trim();
    if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });
    if (title.length > 200) {
      return NextResponse.json({ error: "Title is too long (max 200)." }, { status: 400 });
    }
    data.title = title;
  }

  if (body.content !== undefined) {
    const content = String(body.content).trim();
    if (!content) return NextResponse.json({ error: "Content is required." }, { status: 400 });
    if (content.length > 6000) {
      return NextResponse.json({ error: "Content is too long (max 6000 characters)." }, { status: 400 });
    }
    data.content = content;
  }

  if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  try {
    const doc = await prisma.knowledgeDocument.update({ where: { id }, data });
    return NextResponse.json(doc);
  } catch (e) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }
}

export async function DELETE(request, { params }) {
  const session = await requireApiSession(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.knowledgeDocument.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }
}