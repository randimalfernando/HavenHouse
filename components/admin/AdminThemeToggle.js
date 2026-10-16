"use client";

import { useEffect, useState } from "react";

const ADMIN_KEY = "hh-admin-theme"; // admin's own setting, separate from the public site
const ATTR = "data-theme";          // the attribute your public theme uses on <html>
const DARK = "dark";
const LIGHT = "light";

export default function AdminThemeToggle() {
  const [theme, setTheme] = useState(DARK);

  useEffect(() => {
    const html = document.documentElement;

    // Remember the public site's theme the first time we enter admin.
    if (window.__hhPublicTheme === undefined) {
      window.__hhPublicTheme = html.getAttribute(ATTR);
    }

    let saved = DARK;
    try {
      saved = localStorage.getItem(ADMIN_KEY) === LIGHT ? LIGHT : DARK;
    } catch {}
    html.setAttribute(ATTR, saved);
    setTheme(saved);

    // When we leave the admin area, put the public theme back.
    return () => {
      setTimeout(() => {
        if (document.querySelector(".admin-shell")) return; // still in admin
        const original = window.__hhPublicTheme;
        if (original) html.setAttribute(ATTR, original);
        else html.removeAttribute(ATTR);
        delete window.__hhPublicTheme;
      }, 0);
    };
  }, []);

  function toggle() {
    const next = theme === DARK ? LIGHT : DARK;
    document.documentElement.setAttribute(ATTR, next);
    setTheme(next);
    try {
      localStorage.setItem(ADMIN_KEY, next);
    } catch {}
  }

  const isDark = theme === DARK;

  return (
    <button
      type="button"
      className="admin-theme-toggle"
      onClick={toggle}
      aria-label={isDark ? "Switch admin panel to light mode" : "Switch admin panel to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}