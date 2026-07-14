"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

type Phase = "trip" | "vehicle" | "checkout" | "confirmed";
type Service = "one-way" | "round-trip" | "hourly";
type VehicleId = "sedan" | "suv" | "flagship";

const steps: Array<{ id: Exclude<Phase, "confirmed">; label: string }> = [
  { id: "trip", label: "Trip" },
  { id: "vehicle", label: "Vehicle" },
  { id: "checkout", label: "Traveler & payment" },
];

const vehicles: Array<{ id: VehicleId; name: string; category: string; image: string; imageWidth: number; imageHeight: number; seats: string; luggage: string; note: string; prices: Record<Service, number> }> = [
  { id: "sedan", name: "Executive Sedan", category: "Business class", image: "/brand/principal-movement.png", imageWidth: 1812, imageHeight: 868, seats: "3 passengers", luggage: "2 large bags", note: "Discreet black sedan", prices: { "one-way": 168, "round-trip": 336, hourly: 495 } },
  { id: "suv", name: "Cadillac Escalade ESV", category: "Premium SUV", image: "/images/owner/icons/escalade-fleet.jpg", imageWidth: 341, imageHeight: 341, seats: "6 passengers", luggage: "5 large bags", note: "Extended-length SUV", prices: { "one-way": 224, "round-trip": 448, hourly: 645 } },
  { id: "flagship", name: "Mercedes-Maybach S-Class", category: "Flagship sedan", image: "/images/owner/icons/maybach-fleet.jpg", imageWidth: 341, imageHeight: 341, seats: "2 passengers", luggage: "2 large bags", note: "Limited live availability", prices: { "one-way": 395, "round-trip": 790, hourly: 1050 } },
];

function AltaieMiniMark() {
  return <span className="direct-mark" aria-hidden="true"><i /></span>;
}

function Money({ amount }: { amount: number }) {
  return <>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount)}</>;
}

export function DirectBooking() {
  const [phase, setPhase] = useState<Phase>("trip");
  const [service, setService] = useState<Service>("one-way");
  const [vehicleId, setVehicleId] = useState<VehicleId>("suv");
  const [pickup, setPickup] = useState("The Hay-Adams, 800 16th St NW");
  const [destination, setDestination] = useState("DCA · Terminal 2");
  const [date, setDate] = useState("2026-07-28");
  const [time, setTime] = useState("15:40");
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === vehicleId) ?? vehicles[1];
  const price = selectedVehicle.prices[service];
  const phaseIndex = phase === "confirmed" ? 3 : steps.findIndex((step) => step.id === phase);

  function advanceTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPhase("vehicle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function confirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPhase("confirmed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function go(next: Phase) {
    setPhase(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (phase === "confirmed") {
    return <section className="direct-booking direct-booking--confirmed">
      <div className="direct-confirmation">
        <div className="direct-confirmation__mark">✓</div>
        <p className="direct-kicker">Booking AT-1062</p>
        <h1>You&apos;re booked.</h1>
        <p>Your Altaie assignment is confirmed. The traveler and account booker will receive the itinerary and ride-day contact details.</p>
        <div className="direct-confirmation__card">
          <div><span>Pickup</span><strong>{pickup}</strong><small>Tue, Jul 28 · 3:40 PM</small></div>
          <i />
          <div><span>Destination</span><strong>{destination}</strong><small>{selectedVehicle.name}</small></div>
          <dl><div><dt>Status</dt><dd>Confirmed</dd></div><div><dt>Fixed total</dt><dd><Money amount={price} /></dd></div><div><dt>Payment</dt><dd>Corporate account</dd></div><div><dt>Chauffeur</dt><dd>Assigned before pickup</dd></div></dl>
        </div>
        <div className="direct-confirmation__actions"><Link className="direct-button direct-button--dark" href="/portal">Open client portal</Link><button className="direct-button direct-button--line" onClick={() => go("trip")}>Book another ride</button></div>
        <p className="direct-prototype-note">Interactive staging flow · No payment was charged.</p>
      </div>
    </section>;
  }

  return <section className="direct-booking">
    <header className="direct-booking__header"><div><AltaieMiniMark /><span>Direct booking</span></div><p><i /> Live DC inventory</p></header>
    <div className="direct-booking__layout">
      <aside className="direct-booking__steps" aria-label="Booking progress">
        <p className="direct-kicker">New booking</p>
        <h1>Washington,<br />handled.</h1>
        <ol>{steps.map((step, index) => <li key={step.id} className={phase === step.id ? "is-current" : index < phaseIndex ? "is-complete" : ""}><span>{index < phaseIndex ? "✓" : `0${index + 1}`}</span><strong>{step.label}</strong></li>)}</ol>
        <div className="direct-booking__assurance"><strong>Fixed price. No surge.</strong><p>Flight tracking, tolls, airport fees and standard grace time are included.</p></div>
      </aside>

      <div className="direct-booking__main">
        {phase === "trip" && <form className="direct-screen" onSubmit={advanceTrip}>
          <div className="direct-screen__heading"><p className="direct-kicker">01 · Trip</p><h2>Where are we going?</h2><p>Enter the itinerary to see vehicles that can be confirmed now.</p></div>
          <fieldset className="direct-service-tabs"><legend>Service type</legend>{(["one-way", "round-trip", "hourly"] as Service[]).map((item) => <label key={item}><input type="radio" name="service" checked={service === item} onChange={() => setService(item)} /><span>{item === "one-way" ? "One way" : item === "round-trip" ? "Round trip" : "Hourly"}</span></label>)}</fieldset>
          <div className="direct-fields">
            <label className="direct-field direct-field--wide"><span>Pickup</span><input value={pickup} onChange={(event) => setPickup(event.target.value)} required autoComplete="street-address" /></label>
            <label className="direct-field direct-field--wide"><span>{service === "hourly" ? "First stop" : "Destination"}</span><input value={destination} onChange={(event) => setDestination(event.target.value)} required /></label>
            <label className="direct-field"><span>Date</span><input type="date" value={date} min="2026-07-14" onChange={(event) => setDate(event.target.value)} required /></label>
            <label className="direct-field"><span>Pickup time</span><input type="time" value={time} onChange={(event) => setTime(event.target.value)} required /></label>
            <label className="direct-field"><span>Passengers</span><select defaultValue="2"><option>1</option><option>2</option><option>3</option><option>4</option><option>5–6</option></select></label>
            <label className="direct-field"><span>Flight number</span><input placeholder="Optional" /></label>
          </div>
          <div className="direct-inline-note"><span>Same-day booking</span><p>Only vehicle classes with verified live coverage will appear. Unavailable service cannot be confirmed.</p></div>
          <button className="direct-button direct-button--dark direct-button--wide" type="submit">See available vehicles</button>
        </form>}

        {phase === "vehicle" && <section className="direct-screen">
          <div className="direct-screen__heading"><p className="direct-kicker">02 · Vehicle</p><h2>Available now.</h2><p>Select a confirmed class. The price shown is the fixed total for this itinerary.</p></div>
          <div className="direct-vehicles" role="radiogroup" aria-label="Available vehicles">{vehicles.map((vehicle) => <button key={vehicle.id} className={vehicleId === vehicle.id ? "is-selected" : ""} role="radio" aria-checked={vehicleId === vehicle.id} onClick={() => setVehicleId(vehicle.id)}><Image src={vehicle.image} width={vehicle.imageWidth} height={vehicle.imageHeight} alt={`${vehicle.name} vehicle class`} /><div className="direct-vehicle-copy"><span>{vehicle.category}</span><h3>{vehicle.name}</h3><p>{vehicle.seats} · {vehicle.luggage}</p><small>{vehicle.note}</small></div><div className="direct-vehicle-price"><strong><Money amount={vehicle.prices[service]} /></strong><span>Fixed total</span></div><i>{vehicleId === vehicle.id ? "✓" : ""}</i></button>)}</div>
          <div className="direct-screen__actions"><button className="direct-button direct-button--dark" onClick={() => go("checkout")}>Continue with {selectedVehicle.name}</button><button className="direct-text-button" onClick={() => go("trip")}>Edit itinerary</button></div>
        </section>}

        {phase === "checkout" && <form className="direct-screen" onSubmit={confirm}>
          <div className="direct-screen__heading"><p className="direct-kicker">03 · Traveler & payment</p><h2>Confirm the details.</h2><p>The booking is confirmed immediately after this step.</p></div>
          <div className="direct-fields">
            <label className="direct-field"><span>Traveler</span><select defaultValue="Priya Shah"><option>Priya Shah</option><option>Jordan Lee</option><option>Daniel Wu</option><option>Guest traveler</option></select></label>
            <label className="direct-field"><span>Mobile</span><input type="tel" defaultValue="202 555 0148" required /></label>
            <label className="direct-field direct-field--wide"><span>Email</span><input type="email" defaultValue="maya@asterrowe.example" required /></label>
            <label className="direct-field direct-field--wide"><span>Payment</span><select defaultValue="account"><option value="account">Aster & Rowe corporate account</option><option value="card">Visa ending 4242</option></select></label>
            <label className="direct-field"><span>Cost center</span><input defaultValue="Client 247" /></label>
            <label className="direct-field"><span>Ride updates</span><select defaultValue="booker"><option value="booker">Booker + traveler</option><option value="traveler">Traveler only</option><option value="assistant">Booker only</option></select></label>
            <label className="direct-field direct-field--wide"><span>Chauffeur notes</span><textarea rows={4} defaultValue="Two checked bags. Send ride-day updates to the booker and traveler." /></label>
          </div>
          <label className="direct-consent"><input type="checkbox" required /><span>I agree to the cancellation, waiting-time and service terms for this confirmed booking.</span></label>
          <div className="direct-screen__actions"><button className="direct-button direct-button--dark" type="submit">Confirm booking · <Money amount={price} /></button><button className="direct-text-button" type="button" onClick={() => go("vehicle")}>Change vehicle</button></div>
          <p className="direct-prototype-note">Staging prototype: this interaction demonstrates direct confirmation but does not charge a payment method.</p>
        </form>}
      </div>

      <aside className="direct-booking__summary">
        <div className="direct-summary-status"><span>Live price</span><strong><Money amount={price} /></strong><small>Fixed · all inclusive</small></div>
        <div className="direct-summary-route"><span>Pickup · {date} · {time}</span><strong>{pickup}</strong><i /><span>{service === "hourly" ? "First stop" : "Destination"}</span><strong>{destination}</strong></div>
        <dl><div><dt>Service</dt><dd>{service === "one-way" ? "One way" : service === "round-trip" ? "Round trip" : "Hourly · 3 hr minimum"}</dd></div><div><dt>Vehicle</dt><dd>{selectedVehicle.name}</dd></div><div><dt>Passengers</dt><dd>2</dd></div><div><dt>Included</dt><dd>Fees · tolls · standard grace</dd></div></dl>
        <div className="direct-summary-help"><strong>Need coordination?</strong><p>The Altaie desk can modify a confirmed ride without making you restart.</p></div>
      </aside>
    </div>
  </section>;
}
