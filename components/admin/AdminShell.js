import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminThemeToggle from "@/components/admin/AdminThemeToggle";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/register", label: "Register New Admin" },
  { href: "/admin/services", label: "Manage Services" },
  { href: "/admin/profile", label: "My Profile" },
];

// Runs before the page paints: stash the public theme, then apply the admin's own theme (default dark).
const THEME_BOOT = `(function(){try{var h=document.documentElement;if(window.__hhPublicTheme===undefined){window.__hhPublicTheme=h.getAttribute("data-theme");}var t=localStorage.getItem("hh-admin-theme")==="light"?"light":"dark";h.setAttribute("data-theme",t);}catch(e){}})();`;

export default function AdminShell({ activeHref, children }) {
  return (
    <div className="admin-shell">
      <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      <aside className="admin-sidebar">
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