import { NextResponse } from "next/server";

// Stateless contact endpoint. No database write occurs here — this route
// is a placeholder for wiring up an email/notification service (e.g.
// Resend, Postmark, SES). It does not create any application-side record
// of the submission, consistent with "no user accounts, no CMS" scope.

export async function POST(request) {
  try {
    const body = await request.json();
    const name = (body?.name || "").toString().slice(0, 200);
    const email = (body?.email || "").toString().slice(0, 200);
    const message = (body?.message || "").toString().slice(0, 2000);

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Please fill in your name, contact details, and message." },
        { status: 400 }
      );
    }

    // TODO (before launch): send this via an email/notification provider.
    // Example:
    // await sendEmail({
    //   to: siteConfig.generalEmail,
    //   subject: `New contact form submission from ${name}`,
    //   text: message,
    //   replyTo: email,
    // });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Something went wrong submitting the form." },
      { status: 500 }
    );
  }
}
