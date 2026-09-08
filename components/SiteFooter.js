import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <span className="logo-chip logo-chip--footer">
            <Image src="/haven-house-icon.png" alt={`${siteConfig.orgName} logo`} width={44} height={38} />
          </span>
          <h4 style={{ marginTop: "0.75rem" }}>{siteConfig.orgName}</h4>
          <p>{siteConfig.suburb}</p>
          <p>{siteConfig.address}</p>
        </div>

        <div>
          <h4>Site</h4>
          <ul>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/find-support">Find Support</Link></li>
            <li><Link href="/resources">Resources</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4>Support & policies</h4>
          <ul>
            <li>24/7 crisis line: <a href={`tel:${siteConfig.crisisNumber}`}>{siteConfig.crisisNumber}</a></li>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/accessibility">Accessibility</Link></li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        © {new Date().getFullYear()} {siteConfig.orgName}. This website does not store chat
        history and does not replace emergency services.
      </div>
    </footer>
  );
}
