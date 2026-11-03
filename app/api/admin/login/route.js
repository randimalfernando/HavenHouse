import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  verifyPassword,
  hashPassword,
  needsRehash,
  createSessionToken,
  SESSION_COOKIE,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = (body?.email || "").toString().trim().toLowerCase().slice(0, 80);
    const password = (body?.password || "").toString();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      return NextResponse.json({ ok: false, error: "Incorrect email or password." }, { status: 401 });
    }

    const valid = await verifyPassword(password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ ok: false, error: "Incorrect email or password." }, { status: 401 });
    }

    // Old cost-12 hashes are upgraded to cost 10 on a successful login, so
    // every later login is faster. Never blocks login if it fails.
    if (needsRehash(admin.passwordHash)) {
      try {
        await prisma.admin.update({
          where: { id: admin.id },
          data: { passwordHash: await hashPassword(password) },
        });
      } catch (e) {
        console.error("[admin/login] rehash skipped", e);
      }
    }

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
  } catch (err) {
    console.error("[admin/login]", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong logging in." },
      { status: 500 }
    );
  }
}