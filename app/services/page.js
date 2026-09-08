import ServiceCard from "@/components/ServiceCard";
import { getPublishedServices } from "@/content/services";

export const metadata = { title: "Services — Haven House" };

export default function ServicesIndexPage() {
  const services = getPublishedServices();

  return (
    <section className="section">
      <div className="container">
        <h1>Services</h1>
        <p style={{ maxWidth: "60ch" }}>
          An overview of Haven House's support areas. Select one to learn more, including how to
          access it and general eligibility guidance.
        </p>
        <div className="grid grid-cols-services">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}
