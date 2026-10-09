"use client";

import { useEffect } from "react";

export default function ServiceViewTracker({ serviceIds }) {
  useEffect(() => {
    if (!serviceIds || serviceIds.length === 0) return;

    fetch("/api/services/track-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceIds }),
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}