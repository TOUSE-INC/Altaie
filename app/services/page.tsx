import type { Metadata } from "next";
import { CTA, PageHero } from "../components/Content";

export const metadata: Metadata = { title: "Chauffeur services", description: "Airport, point-to-point, hourly, roadshow, and event chauffeur coordination in Washington, DC." };

const services = [
  { id: "airport", number: "01", title: "Airport transfers", body: "Advance-reserved arrivals and departures across DCA, IAD, and BWI. Flight details are reviewed before confirmation, and arrival assignments include a documented 60-minute grace period.", detail: "One way · Round trip · Meet instructions" },
  { id: "point-to-point", number: "02", title: "Point to point", body: "A fixed, all-inclusive quote between offices, hotels, residences, venues, and private aviation terminals throughout the launch service area.", detail: "Fixed quote · No surge pricing" },
  { id: "hourly", number: "03", title: "Hourly / as-directed", body: "Keep one chauffeur and vehicle available across a changing sequence of meetings, meals, and waits. Best for principal movement and government-affairs days.", detail: "Multi-stop · Schedule flexibility" },
  { id: "roadshows", number: "04", title: "Roadshows", body: "A single assignment brief covering passenger names, route sequence, wait points, and live changes—reviewed before the first pickup.", detail: "One itinerary · One accountable desk" },
  { id: "events", number: "05", title: "Events and groups", body: "Coordinated sedans, SUVs, and group vehicles for board dinners, conferences, association events, and guest movement. Group capacity is confirmed case by case.", detail: "Run of show · Backup planning" },
];

export default function ServicesPage() {
  return <>
    <PageHero eyebrow="Services" title="Ground transportation, managed as an assignment." body="Every request is reviewed for route, timing, vehicle class, passenger needs, and operator coverage before confirmation." action={{ label: "Request a ride", href: "/book" }} />
    <section className="page-shell detail-list">
      {services.map((service) => <article id={service.id} key={service.id}><span>{service.number}</span><div><h2>{service.title}</h2><p>{service.body}</p><b>{service.detail}</b></div></article>)}
    </section>
    <section className="policy-note page-shell"><p className="eyebrow">Launch policy</p><h2>Reserved, not hailed.</h2><p>Altaie is an advance-reservation service. Same-day requests remain pending until the coordination desk confirms an available, vetted operating partner. A request is not a confirmed ride until you receive written confirmation.</p></section>
    <CTA />
  </>;
}
