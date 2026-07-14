import type { Metadata } from "next";
import { BookingPanel } from "../components/BookingPanel";

export const metadata: Metadata = { title: "Request a ride", description: "Request an advance-reserved Altaie chauffeur assignment in Washington, DC." };

export default function BookPage() {
  return <section className="form-page"><div className="page-shell"><div className="form-page__intro"><p className="eyebrow">Concierge booking</p><h1>Request the assignment.</h1><p>We review every request before confirmation. No surge pricing, no automatic same-day acceptance, and no charge through this staging request form.</p><div className="request-steps"><span><b>01</b> Share the itinerary</span><span><b>02</b> We verify coverage</span><span><b>03</b> You receive a fixed quote</span></div></div><BookingPanel /></div></section>;
}
