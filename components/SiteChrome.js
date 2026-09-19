"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CrisisBanner from "@/components/CrisisBanner";
import ChatWidget from "@/components/ChatWidget";

// Decides whether to show the public site chrome (crisis banner, header,
// footer, chat widget) based on the current route. Admin routes render
// with none of it — just their own page content, on the same dark
// background/fonts since those come from globals.css regardless.
export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <CrisisBanner />
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
      <ChatWidget />
    </>
  );
}