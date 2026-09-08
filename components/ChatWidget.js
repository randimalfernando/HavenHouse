"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

const OPENING_MESSAGE =
  "Hi, I'm the Haven House digital assistant. I can help you find information and guide you to Haven House services. I can't provide medical, psychological, legal, or crisis advice.";

const OPENING_QUICK_REPLIES = [
  { label: "I'm looking for a service", intentHint: "service" },
  { label: "I have a question", intentHint: "faq" },
  { label: "Find contact details", intentHint: "contact" },
  { label: "I need urgent help", intentHint: "urgent" },
];

function makeMessage(role, content, extra = {}) {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, role, content, ...extra };
}

// All state here lives only in memory for the lifetime of this component.
// Nothing is written to localStorage, sessionStorage, cookies, or any
// network call other than the single stateless /api/chat request per turn.
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => [makeMessage("assistant", OPENING_MESSAGE)]);
  const [input, setInput] = useState("");
  const [locked, setLocked] = useState(false); // true once a safety interrupt fires
  const [loading, setLoading] = useState(false);
  const bodyRef = useRef(null);

  function scrollToBottom() {
    requestAnimationFrame(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    });
  }

  function resetConversation() {
    setMessages([makeMessage("assistant", OPENING_MESSAGE)]);
    setLocked(false);
    setInput("");
  }

  function toggleOpen() {
    setIsOpen((v) => !v);
  }

  async function sendToServer({ message, intentHint }) {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, intentHint }),
      });
      const data = await res.json();
      handleResponse(data);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        makeMessage("assistant", "Sorry, something went wrong. Please try again."),
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  }

  function handleResponse(data) {
    if (data.type === "safety") {
      setLocked(true);
      const text = Array.isArray(data.message) ? data.message.join(" ") : data.message;
      setMessages((prev) => [...prev, makeMessage("assistant", text, { variant: "safety" })]);
      return;
    }

    if (data.type === "service") {
      const { service, eligibility } = data;
      let text = `${service.name}: ${service.summary}\n\nHow to access: ${service.howToAccess}`;
      if (eligibility) {
        text += `\n\n${eligibility.criteriaText}\n\n${eligibility.caveatText}`;
      }
      setMessages((prev) => [...prev, makeMessage("assistant", text)]);
      return;
    }

    if (data.type === "faq") {
      setMessages((prev) => [...prev, makeMessage("assistant", data.answer)]);
      return;
    }

    if (data.type === "contact") {
      const c = data.contact;
      const text = `General enquiries: ${c.generalPhone}\n24/7 crisis line: ${c.crisisNumber}\nEmail: ${c.email}\nAddress: ${c.address}\nHours: ${c.hours}`;
      setMessages((prev) => [...prev, makeMessage("assistant", text)]);
      return;
    }

    if (data.type === "fallback") {
      setMessages((prev) => [...prev, makeMessage("assistant", data.message)]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      makeMessage("assistant", "Sorry, I couldn't process that. Please try again."),
    ]);
  }

  function handleQuickReply(option) {
    if (locked) return;
    setMessages((prev) => [...prev, makeMessage("user", option.label)]);
    scrollToBottom();
    sendToServer({ message: option.label, intentHint: option.intentHint });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (locked) return;
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, makeMessage("user", text)]);
    setInput("");
    scrollToBottom();
    sendToServer({ message: text });
  }

  return (
    <>
      {!isOpen && (
        <button className="chat-launcher" onClick={toggleOpen}>
          <span className="beacon-dot" aria-hidden="true" />
          Chat with our assistant
        </button>
      )}

      {isOpen && (
        <div
          className="chat-window"
          role="dialog"
          aria-label="Haven House digital assistant"
          aria-modal="false"
        >
          <div className="chat-window__header">
            <div>
              <strong>Haven House Assistant</strong>
              <div style={{ fontSize: "0.78rem", opacity: 0.85 }}>Service navigation only</div>
            </div>
            <button onClick={toggleOpen} aria-label="Close chat">✕</button>
          </div>

          <div className="chat-disclaimer">
            Not for crisis, medical, legal, or counselling advice.
          </div>

          <div
            className="chat-window__body"
            ref={bodyRef}
            aria-live="polite"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  "chat-bubble " +
                  (m.variant === "safety"
                    ? "chat-bubble--safety"
                    : m.role === "user"
                    ? "chat-bubble--user"
                    : "chat-bubble--assistant")
                }
                style={{ whiteSpace: "pre-line" }}
                {...(m.variant === "safety" ? { role: "alert", "aria-live": "assertive" } : {})}
              >
                {m.content}
                {m.variant === "safety" && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <a href={`tel:${siteConfig.crisisNumber}`} style={{ fontWeight: 800 }}>
                      Call {siteConfig.crisisNumber}
                    </a>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble chat-bubble--assistant" aria-hidden="true">
                …
              </div>
            )}
          </div>

          {!locked && messages.length <= 1 && (
            <div className="chat-quick-replies">
              {OPENING_QUICK_REPLIES.map((opt) => (
                <button
                  key={opt.label}
                  className="chat-quick-reply"
                  onClick={() => handleQuickReply(opt)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {locked ? (
            <div style={{ padding: "0 1rem 1rem" }}>
              <Link href="/contact" className="btn btn-secondary" style={{ width: "100%" }}>
                View contact page
              </Link>
              <button
                className="btn btn-quiet"
                style={{ width: "100%", marginTop: "0.6rem" }}
                onClick={resetConversation}
              >
                Start a new conversation
              </button>
            </div>
          ) : (
            <form className="chat-window__input" onSubmit={handleSubmit}>
              <label htmlFor="chat-input" style={{ position: "absolute", left: "-9999px" }}>
                Type a message
              </label>
              <input
                id="chat-input"
                type="text"
                placeholder="Type your question…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading}>Send</button>
            </form>
          )}

          <div className="chat-window__footnote">
            This conversation is not saved. Closing the chat clears it.
          </div>
        </div>
      )}
    </>
  );
}
