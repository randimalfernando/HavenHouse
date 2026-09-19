import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken, verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request) {
  try {
    const adminCount = await prisma.admin.count();
    const isBootstrap = adminCount === 0;

    let creatorId = null;

    if (!isBootstrap) {
      const token = request.cookies.get(SESSION_COOKIE)?.value;
      const session = token ? await verifySessionToken(token) : null;
      if (!session) {
        return NextResponse.json(
          { ok: false, error: "Only an existing admin can register a new admin account. Please log in first." },
          { status: 401 }
        );
      }
      creatorId = session.adminId;
    }

    const body = await request.json();
    const firstName = (body?.firstName || "").toString().trim().slice(0, 100);
    const lastName = (body?.lastName || "").toString().trim().slice(0, 100);
    const email = (body?.email || "").toString().trim().toLowerCase().slice(0, 80);
    const password = (body?.password || "").toString();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ ok: false, error: "All fields are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ ok: false, error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ ok: false, error: "An account with that email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const admin = await prisma.admin.create({
      data: { firstName, lastName, email, passwordHash, registeredBy: creatorId },
    });

    if (isBootstrap) {
      const token = await createSessionToken({
        adminId: admin.id,
        email: admin.email,
        firstName: admin.firstName,
      });
      const response = NextResponse.json({ ok: true });
      response.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/register]", err);
    return NextResponse.json({ ok: false, error: "Something went wrong creating the account." }, { status: 500 });
  }
}