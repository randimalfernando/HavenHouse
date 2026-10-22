import Link from "next/link";
import { Heart, ShieldCheck, Users, Lock, Phone, Mail, MapPin, Clock } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = { title: "About — Haven House" };

const STATS = [
  { value: "9", label: "support services" },
  { value: "24/7", label: "crisis line" },
  { value: "Bondi", label: "Sydney, NSW" },
  { value: "100%", label: "not-for-profit" },
];

const VALUES = [
  { icon: Heart, title: "Compassion", text: "Everyone who reaches out is met with warmth, patience and respect." },
  { icon: ShieldCheck, title: "Safety first", text: "Your safety comes before anything else, at every step." },
  { icon: Users, title: "Community", text: "We work alongside people, families and local partners to help." },
  { icon: Lock, title: "Privacy", text: "This site does not save your conversations or collect personal details." },
];

const SERVICES = [
  { name: "Crisis Line", text: "Urgent phone support, 24 hours a day." },
  { name: "Accommodation", text: "Crisis and temporary housing for people who need somewhere safe to stay." },
  { name: "Psychological Support", text: "Professional psychological support services." },
  { name: "Social Work", text: "Practical support, advocacy and help finding the right services." },
  { name: "NDIS Services", text: "Support for people with disability who use the NDIS." },
  { name: "HH Kids", text: "Programs for children, young people and their families." },
  { name: "Jobs Program", text: "Employment support, job readiness and training." },
  { name: "Chaplaincy", text: "Pastoral and spiritual care for anyone who wants it." },
  { name: "Antisemitism Resources", text: "Support and information for people affected by antisemitism." },
];

function HeroIllustration() {
  return (
    <svg className="about-illustration" viewBox="0 0 800 300" role="img" aria-label="A house by the sea at sunrise">
      <defs>
        <linearGradient id="ab-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6b68a" />
          <stop offset="1" stopColor="#fbe3c8" />
        </linearGradient>
        <linearGradient id="ab-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4c8b8f" />
          <stop offset="1" stopColor="#2c5f66" />
        </linearGradient>
      </defs>
      <rect width="800" height="300" fill="url(#ab-sky)" />
      <circle cx="610" cy="150" r="62" fill="#fff3d6" opacity="0.9" />
      <rect y="190" width="800" height="110" fill="url(#ab-sea)" />
      <path d="M0 215 Q50 200 100 215 T200 215 T300 215 T400 215 T500 215 T600 215 T700 215 T800 215 V230 H0Z" fill="#fff" opacity="0.18" />
      <path d="M0 245 Q50 230 100 245 T200 245 T300 245 T400 245 T500 245 T600 245 T700 245 T800 245 V260 H0Z" fill="#fff" opacity="0.12" />
      <rect x="0" y="262" width="800" height="38" fill="#e8cfa6" />
      <g transform="translate(190 92)">
        <polygon points="0,70 100,0 200,70" fill="#2f4f3e" />
        <rect x="20" y="70" width="160" height="100" fill="#f7efe1" />
        <rect x="85" y="110" width="30" height="60" rx="3" fill="#b9733f" />
        <rect x="38" y="88" width="30" height="30" rx="3" fill="#8fc3c9" />
        <rect x="132" y="88" width="30" height="30" rx="3" fill="#8fc3c9" />
        <circle cx="100" cy="42" r="9" fill="#f6b68a" />
      </g>
    </svg>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="section about-hero">
        <div className="container">
          <p className="about-eyebrow">About us</p>
          <h1>About Haven House</h1>
          <p className="about-lead">
            Haven House is a not-for-profit support organisation in Bondi, Sydney. We help people
            find safe, practical support, and this website makes it easier to work out which
            service is right for you.
          </p>
          <HeroIllustration />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-stats">
            {STATS.map((s) => (
              <div key={s.label} className="about-stat">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about-split">
          <div>
            <h2>Our mission</h2>
            <p>
              We believe everyone deserves a safe place to turn to. Our mission is to connect
              people in need with caring, practical support, quickly and without judgement.
            </p>
          </div>
          <div>
            <h2>Our approach</h2>
            <p>
              We listen first. Our team and partners offer support that is warm, respectful and
              focused on what matters to you. If we are not the right fit, we will point you to
              someone who is.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>What we stand for</h2>
          <div className="about-grid about-grid--4">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <div key={title} className="about-card">
                <span className="about-icon"><Icon size={22} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>What we offer</h2>
          <p className="about-lead">Nine services, each with its own team and contact details.</p>
          <div className="about-grid about-grid--3">
            {SERVICES.map((s) => (
              <Link key={s.name} href="/services" className="about-card about-card--link">
                <h3>{s.name}</h3>
                <p>{s.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about-split">
          <div>
            <h2>Where we are</h2>
            <p>Haven House is based in Bondi, on the eastern coast of Sydney, close to the beach and public transport.</p>
            <ul className="about-contact">
              <li><MapPin size={18} aria-hidden="true" /> {siteConfig.address}</li>
              <li><Phone size={18} aria-hidden="true" /> {siteConfig.generalPhone}</li>
              <li><Mail size={18} aria-hidden="true" /> {siteConfig.generalEmail}</li>
              <li><Clock size={18} aria-hidden="true" /> {siteConfig.hours}</li>
            </ul>
          </div>
          <div className="about-card">
            <h3>Need urgent help?</h3>
            <p>If you or someone else is in immediate danger, call 000. For 24/7 crisis support, call Haven House on {siteConfig.crisisNumber}.</p>
            <div className="about-actions">
              <a className="btn btn-primary" href={`tel:${siteConfig.crisisNumber}`}>Call {siteConfig.crisisNumber}</a>
              <Link className="btn btn-secondary" href="/contact">Contact us</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about-cta">
          <h2>Not sure where to start?</h2>
          <p>Browse our services or talk to our assistant, and we will help you find the right support.</p>
          <div className="about-actions">
            <Link className="btn btn-primary" href="/services">Find support</Link>
            <Link className="btn btn-secondary" href="/contact">Contact Haven House</Link>
          </div>
        </div>
      </section>
    </>
  );
}