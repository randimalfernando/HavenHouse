"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfileForm({ initialData }) {
  const router = useRouter();
  const [values, setValues] = useState({
    firstName: initialData.firstName,
    lastName: initialData.lastName,
    email: initialData.email,
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!values.firstName || !values.lastName || !values.email) {
      setError("First name, last name, and email are required.");
      return;
    }

    const isChangingPassword = values.newPassword || values.confirmNewPassword;
    if (isChangingPassword) {
      if (values.newPassword !== values.confirmNewPassword) {
        setError("New passwords do not match.");
        return;
      }
      if (values.newPassword.length < 8) {
        setError("New password must be at least 8 characters.");
        return;
      }
      if (!values.currentPassword) {
        setError("Enter your current password to set a new one.");
        return;
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          currentPassword: values.currentPassword || undefined,
          newPassword: values.newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSuccess(true);
      setValues((v) => ({ ...v, currentPassword: "", newPassword: "", confirmNewPassword: "" }));
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="firstName">First name *</label>
            <input id="firstName" type="text" value={values.firstName} onChange={(e) => update("firstName", e.target.value)} required />
          </div>
          <div className="form-field">
            <label htmlFor="lastName">Last name *</label>
            <input id="lastName" type="text" value={values.lastName} onChange={(e) => update("lastName", e.target.value)} required />
          </div>
          <div className="form-field form-grid__full">
            <label htmlFor="email">Email *</label>
            <input id="email" type="email" autoComplete="username" value={values.email} onChange={(e) => update("email", e.target.value)} required />
          </div>
        </div>

        <h3 style={{ marginTop: "1rem", marginBottom: "0.25rem" }}>Change password</h3>
        <p style={{ marginTop: 0, marginBottom: "1rem", fontSize: "0.9rem", opacity: 0.75 }}>
          Leave these blank to keep your current password.
        </p>

        <div className="form-grid">
          <div className="form-field form-grid__full">
            <label htmlFor="currentPassword">Current password</label>
            <input id="currentPassword" type="password" autoComplete="current-password" value={values.currentPassword} onChange={(e) => update("currentPassword", e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="newPassword">New password</label>
            <input id="newPassword" type="password" autoComplete="new-password" value={values.newPassword} onChange={(e) => update("newPassword", e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="confirmNewPassword">Confirm new password</label>
            <input id="confirmNewPassword" type="password" autoComplete="new-password" value={values.confirmNewPassword} onChange={(e) => update("confirmNewPassword", e.target.value)} />
          </div>
        </div>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Save changes"}
        </button>
      </form>

      {error && <p className="form-status" style={{ color: "var(--color-alert)" }}>{error}</p>}
      {success && <p className="form-status" style={{ color: "var(--color-sage)" }}>Profile updated.</p>}
    </div>
  );
}