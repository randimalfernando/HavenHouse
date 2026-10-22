"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const field = {
  width: "100%",
  boxSizing: "border-box",
  padding: "0.6rem 0.75rem",
  borderRadius: 10,
  border: "1px solid rgba(128,128,160,0.4)",
  background: "transparent",
  color: "inherit",
  font: "inherit",
};

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

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "0.9rem" }}>
      <label style={{ display: "grid", gap: 6 }}>
        <span>Title</span>
        <input style={field} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required />
      </label>
      <label style={{ display: "grid", gap: 6 }}>
        <span>
          Content (plain text){" "}
          <span style={{ opacity: 0.7 }}>{content.length}/6000</span>
        </span>
        <textarea
          style={{ ...field, minHeight: 260, resize: "vertical" }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={6000}
          required
        />
      </label>
      {error && <p style={{ color: "#f87171", margin: 0 }}>{error}</p>}
      <button
        type="submit"
        disabled={saving}
        style={{
          justifySelf: "start",
          padding: "0.65rem 1.4rem",
          borderRadius: 999,
          border: "none",
          background: "#7c5cff",
          color: "#fff",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {saving ? "Saving..." : "Add document"}
      </button>
    </form>
  );
}