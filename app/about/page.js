import ImagePlaceholder from "@/components/ImagePlaceholder";

export const metadata = { title: "About — Haven House" };

export default function AboutPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1>About Haven House</h1>
        <ImagePlaceholder label="Haven House building or team photo" ratio="banner" />
        <p style={{ marginTop: "1.5rem" }}>
          [PLACEHOLDER] Full "About" content — history, mission, values, and community context —
          to be supplied and approved by Haven House.
        </p>
        <h2>Our approach</h2>
        <p>
          [PLACEHOLDER] Description of Haven House's approach to support, written in a warm,
          non-clinical tone.
        </p>
        <h2>Where we are</h2>
        <p>[PLACEHOLDER] Bondi, Sydney — full address and area description.</p>
        <ImagePlaceholder label="Bondi location or neighbourhood photo" ratio="wide" />
      </div>
    </section>
  );
}
