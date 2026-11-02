"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminThemeToggle from "@/components/admin/AdminThemeToggle";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/register", label: "Register New Admin" },
  { href: "/admin/services", label: "Manage Services" },
  { href: "/admin/contact-submissions", label: "Contact Messages" },
  { href: "/admin/profile", label: "My Profile" },
  { href: "/admin/knowledge", label: "Chatbot Documents" },
];

// Runs before the page paints: stash the public theme, then apply the admin's own theme (default dark).
const THEME_BOOT = `(function(){try{var h=document.documentElement;if(window.__hhPublicTheme===undefined){window.__hhPublicTheme=h.getAttribute("data-theme");}var t=localStorage.getItem("hh-admin-theme")==="light"?"light":"dark";h.setAttribute("data-theme",t);}catch(e){}})();`;

export default function AdminShell({ activeHref, children }) {
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu whenever the page changes.
  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  // While the mobile menu is open: Esc closes it and the page behind it does not scroll.
  useEffect(() => {
    if (!navOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [navOpen]);

  return (
    <div className={"admin-shell" + (navOpen ? " is-nav-open" : "")}>
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />

      {/* Top bar: only visible on phones and tablets */}
      <header className="admin-topbar">
        <button
          type="button"
          className="admin-topbar__menu"
          onClick={() => setNavOpen((v) => !v)}
          aria-label={navOpen ? "Close admin menu" : "Open admin menu"}
          aria-expanded={navOpen}
          aria-controls="admin-sidebar"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Link href="/admin/dashboard" className="admin-topbar__brand">
          <span className="admin-topbar__brand-name">Haven House</span>
          <span className="admin-topbar__brand-tag">Admin</span>
        </Link>
      </header>

      {/* Dark layer behind the open menu on phones */}
      <div className="admin-overlay" onClick={() => setNavOpen(false)} aria-hidden="true" />

      <aside id="admin-sidebar" className="admin-sidebar">
        <button
          type="button"
          className="admin-sidebar__close"
          onClick={() => setNavOpen(false)}
          aria-label="Close admin menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        </button>

        <Link href="/admin/dashboard" className="admin-sidebar__logo">
          <span className="logo-chip logo-chip--sidebar">
            <Image src="/logo V3.png" alt="" width={64} height={56} />
          </span>
          <span className="admin-sidebar__logo-text">
            Haven House
            <small>Admin</small>
          </span>
        </Link>

        <nav className="admin-sidebar__nav" aria-label="Admin">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={"admin-sidebar__link" + (activeHref === item.href ? " is-active" : "")}
              aria-current={activeHref === item.href ? "page" : undefined}
              onClick={() => setNavOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <AdminThemeToggle />
          <LogoutButton />
        </div>
      </aside>

      <div className="admin-shell__content">{children}</div>
    </div>
  );
}