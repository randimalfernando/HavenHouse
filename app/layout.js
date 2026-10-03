import "./globals.css";
import { Fraunces, Atkinson_Hyperlegible } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-atkinson",
  display: "swap",
});

export const metadata = {
  title: "Haven House Safe Service Navigation Assistant",
  description:
    "Find Haven House support services in Bondi, Sydney, and get help navigating to the right service.",
};

const themeInitScript = `
(function () {
  try {
    var theme = localStorage.getItem('hh-theme');
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (err) {}
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${atkinson.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}