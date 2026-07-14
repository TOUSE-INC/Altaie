import type { Metadata } from "next";
import { CTA, PageHero } from "../components/Content";

export const metadata: Metadata = { title: "Our service standard", description: "The operating principles behind Altaie's chauffeur partner network and ride coordination." };

const standards = [
  ["Operator verification", "Applicable operating authority, commercial insurance, airport permissions, vehicle records, and driver screening are reviewed before pilot assignments."],
  ["Assignment briefing", "Each confirmed ride carries one operating brief: passenger, booker, service class, timing, stops, preferences, and escalation contacts."],
  ["Early positioning", "The chauffeur arrival target is 15 minutes before the scheduled pickup, with exceptions documented when local rules or venue access require another plan."],
  ["Clean, appropriate vehicles", "Vehicle class, capacity, condition, age standard, and luggage fit are checked during partner onboarding and assignment review."],
  ["Discreet service", "Professional presentation, minimal unnecessary conversation, passenger privacy, and careful handling of itinerary information are baseline expectations."],
  ["Backup planning", "Core launch coverage requires primary and backup partners for sedan, SUV, and airport work before live reservations are accepted."],
];

export default function StandardsPage() {
  return <>
    <PageHero eyebrow="The Altaie standard" title="A promise must have an operating procedure behind it." body="These are launch requirements and pilot targets—not historical claims. Public performance claims will be added only after the data exists." />
    <section className="page-shell standard-grid">{standards.map(([title, body], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{title}</h2><p>{body}</p></article>)}</section>
    <section className="compliance-band"><div className="page-shell"><div><p className="eyebrow eyebrow--light">Compliance gate</p><h2>Authority before availability.</h2></div><p>Altaie will not accept live transportation until qualified counsel and insurance professionals confirm the applicable DC business, DFHV, non-District limousine, WMATC, state, airport, and insurance requirements for the operating model and each partner.</p></div></section>
    <CTA />
  </>;
}
