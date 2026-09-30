"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const EMPTY_VALUES = {
  serviceName: "", description: "", contactPhone: "", contactEmail: "",
  addressLine: "", suburb: "", postalCode: "", walkInAvailable: false,
};

export default function SocialWorkForm({ mode, serviceId, initialData }) {
  const router = useRouter();
  const [values, setValues] = useState(initialData || EMPTY_VALUES);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!values.serviceName || !values.addressLine || !values.suburb || !values.postalCode) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      const url = mode === "create" ? "/api/admin/services/social-work" : `/api/admin/services/social-work/${serviceId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      router.push("/admin/services/social-work");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="serviceName">Service name *</label>
          <input id="serviceName" type="text" value={values.serviceName} onChange={(e) => update("serviceName", e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="description">Description</label>
          <textarea id="description" rows={3} value={values.description} onChange={(e) => update("description", e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="contactPhone">Contact phone</label>
          <input id="contactPhone" type="text" value={values.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="contactEmail">Contact email</label>
          <input id="contactEmail" type="email" value={values.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="addressLine">Address line *</label>
          <input id="addressLine" type="text" value={values.addressLine} onChange={(e) => update("addressLine", e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="suburb">Suburb *</label>
          <input id="suburb" type="text" value={values.suburb} onChange={(e) => update("suburb", e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="postalCode">Postal code *</label>
          <input id="postalCode" type="text" value={values.postalCode} onChange={(e) => update("postalCode", e.target.value)} required />
        </div>
        <div className="form-field form-field--checkbox">
          <label htmlFor="walkInAvailable">
            <input
              id="walkInAvailable"
              type="checkbox"
              checked={values.walkInAvailable}
              onChange={(e) => update("walkInAvailable", e.target.checked)}
            />
            Walk-ins available
          </label>
        </div>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving…" : mode === "create" ? "Add service" : "Save changes"}
        </button>
      </form>

      {error && <p className="form-status" style={{ color: "var(--color-alert)" }}>{error}</p>}
    </div>
  );
}