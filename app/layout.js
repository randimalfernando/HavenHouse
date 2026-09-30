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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${atkinson.variable}`}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}