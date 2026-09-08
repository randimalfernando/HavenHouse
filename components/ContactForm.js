"use client";

import { useState } from "react";

export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!values.name.trim()) next.name = "Please enter your name.";
    if (!values.email.trim()) next.email = "Please enter an email or phone number.";
    if (!values.message.trim()) next.message = "Please enter a message.";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
        setValues({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="name">Your name</label>
        <input
          id="name"
          type="text"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && <span className="form-error" id="name-error">{errors.name}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="email">Email or phone</label>
        <input
          id="email"
          type="text"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && <span className="form-error" id="email-error">{errors.email}</span>}
      </div>

      <div className="form-field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          rows={5}
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && <span className="form-error" id="message-error">{errors.message}</span>}
      </div>

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Send message"}
      </button>

      {status === "success" && (
        <p className="form-status" style={{ color: "var(--color-sage-deep)" }}>
          Thank you — your message has been sent.
        </p>
      )}
      {status === "error" && (
        <p className="form-status" style={{ color: "var(--color-alert)" }}>
          Something went wrong sending your message. Please try again or call us directly.
        </p>
      )}
    </form>
  );
}
