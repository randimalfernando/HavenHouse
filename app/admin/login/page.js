"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 440 }}>
        <h1>Admin Login</h1>
        <p style={{ marginBottom: "1.5rem" }}>
          Staff and volunteer sign-in for managing Haven House services and content.
        </p>

        <div className="card">
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-field">
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary" type="submit" style={{ width: "100%" }} disabled={submitting}>
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>

          {error && (
            <p className="form-status" style={{ color: "var(--color-alert)" }}>
              {error}
            </p>
          )}
        </div>

        <p style={{ marginTop: "1.5rem", fontSize: "0.9rem" }}>
          Don&apos;t have an account? <Link href="/admin/register">Register</Link>
        </p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
          <Link href="/">← Back to the main site</Link>
        </p>
      </div>
    </section>
  );
}