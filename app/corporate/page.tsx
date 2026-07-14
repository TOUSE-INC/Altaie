import type { Metadata } from "next";
import { LeadForm } from "../components/LeadForm";
import { CTA, NumberedList, PageHero } from "../components/Content";

export const metadata: Metadata = { title: "Corporate travel", description: "Assistant-first executive car coordination for Washington law firms, associations, embassies, and corporate travel teams." };

export default function CorporatePage() {
  return <>
    <PageHero eyebrow="Corporate travel" title="Built for the person behind the itinerary." body="A calmer ground program for assistants, travel coordinators, legal teams, associations, and organizations moving senior travelers through Washington." action={{ label: "Discuss an account", href: "#account" }} />
    <section className="page-shell two-column-section">
      <div><p className="eyebrow">Account design</p><h2>Consistency without another layer of administration.</h2></div>
      <NumberedList items={[
        { title: "One traveler record", body: "Capture vehicle preferences, contact protocols, arrival instructions, and recurring notes once." },
        { title: "One confirmation standard", body: "Keep passenger, booker, and assignment details clear across every reservation." },
        { title: "One escalation path", body: "Route ride-day changes through an accountable coordination desk instead of starting over." },
      ]} />
    </section>
    <section className="corporate-use-cases"><div className="page-shell"><p className="eyebrow eyebrow--light">Designed around Washington work</p><div className="use-case-grid"><article><h3>Legal and client movement</h3><p>Partner arrivals, hearings, depositions, client dinners, and multi-office schedules.</p></article><article><h3>Government affairs</h3><p>Full-day, multi-stop movement across offices, associations, and private meetings.</p></article><article><h3>Associations and embassies</h3><p>Guest arrivals, board meetings, delegations, and coordinated event movement without claims of official affiliation.</p></article></div></div></section>
    <section id="account" className="form-section page-shell"><LeadForm kind="corporate" /></section>
    <CTA eyebrow="Need one ride first?" title="Start with the next assignment." body="Request an individual trip and experience the operating standard before opening an account." />
  </>;
}
