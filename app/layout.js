import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CrisisBanner from "@/components/CrisisBanner";
import ChatWidget from "@/components/ChatWidget";

export const metadata = {
  title: "Haven House Safe Service Navigation Assistant",
  description:
    "Find Haven House support services in Bondi, Sydney, and get help navigating to the right service.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Atkinson+Hyperlegible:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <CrisisBanner />
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <ChatWidget />
      </body>
    </html>
  );
}
