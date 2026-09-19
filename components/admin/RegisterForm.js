"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm({ isBootstrap }) {
  const router = useRouter();
  const [values, setValues] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
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

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (values.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Registration failed.");
        return;
      }

      if (isBootstrap) {
        router.push("/admin/dashboard");
        router.refresh();
        return;
      }

      setSuccess(true);
      setValues({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card">
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-field">
          <label htmlFor="firstName">First name</label>
          <input id="firstName" type="text" value={values.firstName} onChange={(e) => update("firstName", e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="lastName">Last name</label>
          <input id="lastName" type="text" value={values.lastName} onChange={(e) => update("lastName", e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="username" value={values.email} onChange={(e) => update("email", e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="new-password" value={values.password} onChange={(e) => update("password", e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" type="password" autoComplete="new-password" value={values.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required />
        </div>

        <button className="btn btn-primary" type="submit" style={{ width: "100%" }} disabled={submitting}>
          {submitting ? "Creating account…" : isBootstrap ? "Create account" : "Create admin account"}
        </button>
      </form>

      {error && <p className="form-status" style={{ color: "var(--color-alert)" }}>{error}</p>}
      {success && (
        <p className="form-status" style={{ color: "var(--color-sage)" }}>
          Account created — they can now log in at /admin/login.
        </p>
      )}
    </div>
  );
}