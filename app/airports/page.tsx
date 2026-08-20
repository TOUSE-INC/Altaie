import type { Metadata } from "next";
import { CTA, PageHero } from "../components/Content";

export const metadata: Metadata = { title: "Washington airport car service", description: "Advance-reserved executive transfers for DCA and IAD with flight-aware coordination." };

const airports = [
  { code: "DCA", name: "Reagan National", body: "The closest commercial airport to central Washington. Arrival instructions are tailored to the terminal and current pickup protocol." },
  { code: "IAD", name: "Washington Dulles", body: "International and domestic arrivals coordinated with flight details, baggage timing, and the traveler’s onward Washington itinerary." },
];

export default function AirportsPage() {
  return <>
    <PageHero eyebrow="Airport service" title="The arrival is part of the itinerary." body="Flight-aware coordination for DCA and IAD, with clear meeting instructions and coverage confirmed before the traveler departs." action={{ label: "Request an airport ride", href: "/book" }} />
    <section className="page-shell airport-cards">{airports.map((airport) => <article key={airport.code}><strong>{airport.code}</strong><h2>{airport.name}</h2><p>{airport.body}</p></article>)}</section>
    <section className="page-shell arrival-process"><div><p className="eyebrow">Arrival standard</p><h2>What happens before wheels down.</h2></div><ol><li><span>01</span><div><h3>Flight details reviewed</h3><p>Airline, flight number, arrival time, terminal context, passenger contact, and luggage notes are attached to the assignment.</p></div></li><li><span>02</span><div><h3>Meeting instructions confirmed</h3><p>The confirmation states where the passenger should expect the chauffeur and how ride-day contact works.</p></div></li><li><span>03</span><div><h3>Arrival grace protected</h3><p>Airport arrivals include 60 minutes of grace time after landing adjustments, subject to the final written quote and terms.</p></div></li></ol></section>
    <section className="policy-note page-shell"><p className="eyebrow">Private aviation</p><h2>FBO pickups by request.</h2><p>Share the airport, FBO, arrival time, and tail number when appropriate. Coverage and airside or ramp access are never assumed; meeting instructions are confirmed for each assignment.</p></section>
    <CTA />
  </>;
}
