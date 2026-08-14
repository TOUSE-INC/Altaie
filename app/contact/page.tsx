import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "../components/LeadForm";
import { PageHero } from "../components/Content";

export const metadata: Metadata = { title: "Contact", description: "Contact the Altaie launch desk about corporate travel or a Washington chauffeur assignment." };

export default function ContactPage() {
  return <>
    <PageHero eyebrow="Contact" title="Start with the itinerary—or the program behind it." body="Individual ride requests start with the itinerary. Corporate programs, recurring needs, and launch-pilot interest can begin below." />
    <section className="page-shell contact-choices"><Link href="/book"><span>Individual assignment</span><h2>Request a ride</h2><p>Airport, point-to-point, hourly, roadshow, or event transportation.</p><b>Start a request ↗</b></Link><Link href="/partner-network"><span>Operating partner</span><h2>Join the network</h2><p>Licensed operators serving Washington, Maryland, Virginia, and the region.</p><b>Review partner criteria ↗</b></Link></section>
    <section className="form-section page-shell"><LeadForm kind="corporate" /></section>
  </>;
}
