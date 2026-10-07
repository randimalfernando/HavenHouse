import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  requireApiSession,
  hashPassword,
  verifyPassword,
  createSessionToken,
  SESSION_COOKIE,
} from "@/lib/auth";

export async function PUT(request) {
  const session = await requireApiSession(request);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const firstName = (body?.firstName || "").toString().trim().slice(0, 100);
    const lastName = (body?.lastName || "").toString().trim().slice(0, 100);
    const email = (body?.email || "").toString().trim().toLowerCase().slice(0, 80);
    const currentPassword = (body?.currentPassword || "").toString();
    const newPassword = (body?.newPassword || "").toString();

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { ok: false, error: "First name, last name, and email are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.admin.findUnique({ where: { id: session.adminId } });
    if (!existing) {
      return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });
    }

    if (email !== existing.email) {
      const emailTaken = await prisma.admin.findUnique({ where: { email } });
      if (emailTaken) {
        return NextResponse.json(
          { ok: false, error: "An account with that email already exists." },
          { status: 409 }
        );
      }
    }

    const updateData = { firstName, lastName, email };

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { ok: false, error: "Enter your current password to set a new one." },
          { status: 400 }
        );
      }
      const valid = await verifyPassword(currentPassword, existing.passwordHash);
      if (!valid) {
        return NextResponse.json(
          { ok: false, error: "Current password is incorrect." },
          { status: 401 }
        );
      }
      if (newPassword.length < 8) {
        return NextResponse.json(
          { ok: false, error: "New password must be at least 8 characters." },
          { status: 400 }
        );
      }
      updateData.passwordHash = await hashPassword(newPassword);
    }

    const updated = await prisma.admin.update({
      where: { id: session.adminId },
      data: updateData,
    });

    const token = await createSessionToken({
      adminId: updated.id,
      email: updated.email,
      firstName: updated.firstName,
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
    console.error("[admin/profile PUT]", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong updating your profile." },
      { status: 500 }
    );
  }
}