export const metadata = { title: "Accessibility — Haven House" };

export default function AccessibilityPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1>Accessibility</h1>
        <p>
          Haven House aims for this website to be usable by as many people as possible,
          including people using screen readers, keyboard navigation, and other assistive
          technology. We are working towards WCAG 2.1 AA conformance.
        </p>

        <h2>Features of this site</h2>
        <ul>
          <li>Large, readable text and high-contrast colour choices</li>
          <li>Keyboard-accessible navigation and chat assistant</li>
          <li>A "skip to content" link on every page</li>
          <li>Reduced-motion support for people sensitive to animation</li>
        </ul>

        <h2>Let us know</h2>
        <p>
          [PLACEHOLDER] Contact details for reporting accessibility issues on this website.
        </p>
      </div>
    </section>
  );
}
