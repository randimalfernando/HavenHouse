import ContactForm from "@/components/ContactForm";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = { title: "Contact — Haven House" };

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container" style={{ display: "grid", gap: "2rem", maxWidth: 900 }}>
        <div>
          <h1>Contact Haven House</h1>
          <p>
            General enquiries: <strong>{siteConfig.generalPhone}</strong><br />
            24/7 crisis line: <strong>{siteConfig.crisisNumber}</strong><br />
            Email: <strong>{siteConfig.generalEmail}</strong><br />
            Address: {siteConfig.address}<br />
            Hours: {siteConfig.hours}
          </p>
          <p style={{ fontWeight: 700, color: "var(--color-alert)" }}>
            This form is not for urgent or emergency situations. If you need help right now,
            please call {siteConfig.crisisNumber}, or {siteConfig.emergencyNumber} in an
            emergency.
          </p>
        </div>

        <div className="card" style={{ maxWidth: 560 }}>
          <h2 style={{ marginBottom: "0.5rem" }}>Send a message</h2>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
