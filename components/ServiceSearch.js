"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const MIN_CHARS = 2;

export default function ServiceSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const boxRef = useRef(null);
  const inputRef = useRef(null);

  // Debounced search; cancels the previous request when typing continues.
  useEffect(() => {
    const q = query.trim();
    if (q.length < MIN_CHARS) {
      setResults([]);
      setStatus("idle");
      return;
    }
    setStatus("loading");
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        const data = await res.json();
        if (!data.ok) {
          setStatus("error");
          setResults([]);
          return;
        }
        setResults(data.results || []);
        setActive(-1);
        setStatus("done");
      } catch (err) {
        if (err.name !== "AbortError") setStatus("error");
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  // Close the list when clicking outside.
  useEffect(() => {
    function onDown(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function clear() {
    setQuery("");
    setResults([]);
    setStatus("idle");
    setOpen(false);
    inputRef.current?.focus();
  }

  function onKeyDown(e) {
    if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "ArrowDown" && results.length) {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp" && results.length) {
      e.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0 && results[active]) {
      e.preventDefault();
      window.location.href = `/services/${results[active].slug}`;
    }
  }

  const showPanel = open && query.trim().length >= MIN_CHARS;

  return (
    <div className="service-search" ref={boxRef}>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="service-search__form">
        <label htmlFor="service-search-input" className="visually-hidden">
          Search Haven House services
        </label>
        <input
          id="service-search-input"
          ref={inputRef}
          type="search"
          className="service-search__input"
          placeholder="Search services, e.g. housing, counselling, kids, jobs…"
          value={query}
          maxLength={60}
          autoComplete="off"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls="service-search-results"
          aria-activedescendant={active >= 0 ? `service-search-opt-${active}` : undefined}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {query && (
          <button type="button" className="service-search__clear" onClick={clear} aria-label="Clear search">
            ×
          </button>
        )}
      </form>

      {showPanel && (
        <div className="service-search__panel" id="service-search-results" role="listbox" aria-live="polite">
          {status === "loading" && <p className="service-search__note">Searching…</p>}
          {status === "error" && <p className="service-search__note">Search is unavailable right now. Please try again.</p>}
          {status === "done" && results.length === 0 && (
            <p className="service-search__note">
              No services found for “{query.trim()}”. Try a simpler word like “housing” or “counselling”, or{" "}
              <Link href="/services">browse all services</Link>.
            </p>
          )}
          {status === "done" &&
            results.map((r, i) => (
              <Link
                key={`${r.slug}-${r.name}-${i}`}
                id={`service-search-opt-${i}`}
                role="option"
                aria-selected={i === active}
                href={`/services/${r.slug}`}
                className={`service-search__item${i === active ? " is-active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <span className="service-search__title">{r.name}</span>
                <span className="service-search__tag">{r.category}</span>
                {r.description && <span className="service-search__desc">{r.description}</span>}
                {(r.phone || r.suburb) && (
                  <span className="service-search__meta">
                    {[r.phone, r.suburb].filter(Boolean).join(" · ")}
                  </span>
                )}
              </Link>
            ))}
          <p className="service-search__urgent">Need urgent help? Call 000 if you are in danger.</p>
        </div>
      )}
    </div>
  );
}

