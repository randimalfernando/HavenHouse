"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

const btn = {
  padding: "0.35rem 0.85rem",
  borderRadius: 999,
  border: "1px solid rgba(128,128,160,0.45)",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
  font: "inherit",
  fontSize: "0.85rem",
  textDecoration: "none",
  display: "inline-block",
};

export default function KnowledgeDocumentActions({ id, isActive }) {
  const router = useRouter();

  async function toggle() {
    await fetch(`/api/admin/knowledge-documents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    router.refresh();
  }

  async function remove() {
    if (!window.confirm("Delete this document?")) return;
    await fetch(`/api/admin/knowledge-documents/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <span style={{ display: "inline-flex", gap: "0.5rem" }}>
      <Link href={`/admin/knowledge/${id}`} style={{ ...btn, color: "#a5b4fc", borderColor: "rgba(165,180,252,0.5)" }}>
        Edit
      </Link>
      <button type="button" style={btn} onClick={toggle}>{isActive ? "Disable" : "Enable"}</button>
      <button type="button" style={{ ...btn, color: "#fb923c", borderColor: "rgba(251,146,60,0.5)" }} onClick={remove}>Delete</button>
    </span>
  );
}