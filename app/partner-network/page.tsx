import type { Metadata } from "next";
import { LeadForm } from "../components/LeadForm";
import { PageHero } from "../components/Content";

export const metadata: Metadata = { title: "Partner network", description: "Apply to join Altaie's vetted Washington, DC chauffeur operator network." };

const criteria = ["Applicable operating authority in each served jurisdiction", "Commercial auto insurance and required umbrella coverage", "Documented chauffeur screening and driving-record review", "Vehicle condition, age, capacity, and presentation standards", "Airport pickup permissions and accurate meeting procedures", "Ride-day escalation, incident reporting, and backup availability"];

export default function PartnerNetworkPage() {
  return <>
    <PageHero eyebrow="Partner network" title="Local operators. One shared standard." body="Altaie is building a curated network for advance-reserved executive transportation. The initial inquiry collects operating facts—not sensitive documents." action={{ label: "Start an application", href: "#apply" }} />
    <section className="page-shell partner-criteria"><div><p className="eyebrow">Initial criteria</p><h2>What we verify before pilot work.</h2><p>Final thresholds will be set with transportation counsel and an insurance professional before live assignments.</p></div><ul>{criteria.map((item) => <li key={item}>{item}</li>)}</ul></section>
    <section id="apply" className="form-section page-shell"><LeadForm kind="partner" /></section>
  </>;
}
