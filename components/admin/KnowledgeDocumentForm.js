"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function KnowledgeDocumentForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/admin/knowledge-documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Could not save the document.");
      return;
    }
    setTitle("");
    setContent("");
    router.refresh();
  }

  const field = { width: "100%", padding: "0.6rem", borderRadius: 8, border: "1px solid #444", background: "transparent", color: "inherit", font: "inherit" };

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "0.75rem", maxWidth: 800 }}>
      <label>
        Title
        <input style={field} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required />
      </label>
      <label>
        Content (plain text, max 6000 characters) <span style={{ opacity: 0.7 }}>{content.length}/6000</span>
        <textarea style={{ ...field, minHeight: 220 }} value={content} onChange={(e) => setContent(e.target.value)} maxLength={6000} required />
      </label>
      {error && <p style={{ color: "#f87171" }}>{error}</p>}
      <button type="submit" disabled={saving} style={{ justifySelf: "start", padding: "0.6rem 1.2rem", borderRadius: 8, cursor: "pointer" }}>
        {saving ? "Saving..." : "Add document"}
      </button>
    </form>
  );
}
