import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth";
import { getServicesReportData } from "@/lib/reportData";
import { buildServicesReportPdf } from "@/lib/servicesReport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request) {
  const session = await requireApiSession(request);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Not authenticated." }, { status: 401 });
  }

  try {
    const data = await getServicesReportData();
    // Shown in the report header when the session carries an email; otherwise it is left out.
    data.generatedBy = session.email || null;

    const pdf = await buildServicesReportPdf(data);
    const day = new Date().toISOString().slice(0, 10);

    return new NextResponse(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="haven-house-services-report-${day}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[admin/reports/services]", err);
    return NextResponse.json({ ok: false, error: "Could not generate the report." }, { status: 500 });
  }
}
