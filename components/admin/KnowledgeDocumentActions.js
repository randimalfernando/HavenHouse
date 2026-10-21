"use client";
import { useRouter } from "next/navigation";

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
      <button type="button" onClick={toggle}>{isActive ? "Disable" : "Enable"}</button>
      <button type="button" onClick={remove}>Delete</button>
    </span>
  );
}
