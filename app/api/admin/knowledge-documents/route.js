import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireApiSession } from "@/lib/auth";

export async function POST(request) {
  const session = await requireApiSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const title = String(body.title || "").trim();
  const content = String(body.content || "").trim();

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
  }
  if (title.length > 200) {
    return NextResponse.json({ error: "Title is too long (max 200)." }, { status: 400 });
  }
  if (content.length > 6000) {
    return NextResponse.json({ error: "Content is too long (max 6000 characters)." }, { status: 400 });
  }

  const doc = await prisma.knowledgeDocument.create({ data: { title, content } });
  return NextResponse.json(doc, { status: 201 });
}
