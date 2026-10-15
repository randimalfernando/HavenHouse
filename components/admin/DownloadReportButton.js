"use client";

import { useState } from "react";

export default function DownloadReportButton({ label = "Download Summary Report" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/reports/services", { cache: "no-store" });
      if (!res.ok) {
        let message = "Could not generate the report.";
        try {
          const data = await res.json();
          if (data?.error) message = data.error;
        } catch {}
        setError(message);
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `haven-house-services-report-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem" }}>
      <button type="button" className="btn btn-primary" onClick={handleDownload} disabled={busy}>
        {busy ? "Generating report…" : label}
      </button>
      {error && <span style={{ color: "var(--color-alert)", fontSize: "0.85rem" }}>{error}</span>}
    </div>
  );
}
