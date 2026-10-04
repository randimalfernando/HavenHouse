import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/siteConfig";

async function sendViaResend({ name, email, message }) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.CONTACT_FROM_ADDRESS;
  const toAddress = process.env.CONTACT_TO_ADDRESS || siteConfig.generalEmail;

  if (!apiKey || !fromAddress) {
    console.warn(
      "[contact] RESEND_API_KEY or CONTACT_FROM_ADDRESS not set — skipping email send. The submission was still saved to the database."
    );
    return { sent: false };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [toAddress],
      reply_to: email,
      subject: `New contact form submission from ${name}`,
      text: message,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend API error (${res.status}): ${errText}`);
  }

  return { sent: true };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = (body?.name || "").toString().trim().slice(0, 200);
    const email = (body?.email || "").toString().trim().slice(0, 200);
    const message = (body?.message || "").toString().trim().slice(0, 2000);

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Please fill in your name, contact details, and message." },
        { status: 400 }
      );
    }

    await prisma.contactSubmission.create({
      data: { name, email, message },
    });

    try {
      await sendViaResend({ name, email, message });
    } catch (emailErr) {
      console.error("[contact] Email send failed (submission was still saved):", emailErr);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Failed to save submission:", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong submitting the form." },
      { status: 500 }
    );
  }
}