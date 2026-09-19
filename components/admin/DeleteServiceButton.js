"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteServiceButton({ serviceId, apiPath }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Delete this service? This can't be undone.");
    if (!confirmed) return;

    setDeleting(true);
    try {
      const res = await fetch(`${apiPath}/${serviceId}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.ok) {
        alert(data.error || "Failed to delete.");
        return;
      }
      router.refresh();
    } catch (err) {
      alert("Something went wrong deleting this record.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button type="button" className="table-action table-action--delete" onClick={handleDelete} disabled={deleting}>
      {deleting ? "Deleting…" : "Delete"}
    </button>
  );
}