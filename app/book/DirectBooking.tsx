"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Phase = "trip" | "vehicle" | "checkout" | "submitted";
type Service = "one-way" | "round-trip" | "hourly";
type VehicleId = "sedan" | "suv" | "flagship";

type TripState = {
  pickup: string;
  destination: string;
  date: string;
  time: string;
  passengers: string;
  flightNumber: string;
};

type ContactState = {
  contactName: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  consent: boolean;
};

const steps: Array<{ id: Exclude<Phase, "submitted">; label: string }> = [
  { id: "trip", label: "Trip" },
  { id: "vehicle", label: "Vehicle" },
  { id: "checkout", label: "Contact" },
];

const vehicles: Array<{
  id: VehicleId;
  name: string;
  category: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  seats: string;
  luggage: string;
  note: string;
  estimates: Record<Service, number>;
}> = [
  {
    id: "sedan",
    name: "Executive Sedan",
    category: "Business class",
    image: "/brand/principal-movement.png",
    imageWidth: 1812,
    imageHeight: 868,
    seats: "3 passengers",
    luggage: "2 large bags",
    note: "Discreet black sedan",
    estimates: { "one-way": 165, "round-trip": 330, hourly: 495 },
  },
  {
    id: "suv",
    name: "Cadillac Escalade ESV",
    category: "Premium SUV",
    image: "/images/owner/icons/escalade-fleet.jpg",
    imageWidth: 341,
    imageHeight: 341,
    seats: "6 passengers",
    luggage: "5 large bags",
    note: "Extended-length SUV",
    estimates: { "one-way": 225, "round-trip": 450, hourly: 645 },
  },
  {
    id: "flagship",
    name: "Mercedes-Maybach S-Class",
    category: "Flagship sedan",
    image: "/images/owner/icons/maybach-fleet.jpg",
    imageWidth: 341,
    imageHeight: 341,
    seats: "2 passengers",
    luggage: "2 large bags",
    note: "Limited pilot availability",
    estimates: { "one-way": 395, "round-trip": 790, hourly: 1050 },
  },
];

function AltaieMiniMark() {
  return <span className="direct-mark" aria-hidden="true"><i /></span>;
}

function Money({ amount }: { amount: number }) {
  return <>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount)}</>;
}

function formatService(service: Service) {
  if (service === "one-way") return "One way";
  if (service === "round-trip") return "Round trip";
  return "Hourly";
}

function formatLocalDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DirectBooking() {
  const [phase, setPhase] = useState<Phase>("trip");
  const [service, setService] = useState<Service>("one-way");
  const [vehicleId, setVehicleId] = useState<VehicleId>("suv");
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [trip, setTrip] = useState<TripState>({
    pickup: "",
    destination: "",
    date: "",
    time: "",
    passengers: "2",
    flightNumber: "",
  });
  const [contact, setContact] = useState<ContactState>({
    contactName: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
    consent: false,
  });

  useEffect(() => {
    if (dateInputRef.current) {
      dateInputRef.current.min = formatLocalDate(new Date());
    }
  }, []);

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === vehicleId) ?? vehicles[1],
    [vehicleId],
  );
  const estimate = selectedVehicle.estimates[service];
  const phaseIndex = phase === "submitted" ? 3 : steps.findIndex((step) => step.id === phase);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function go(next: Phase) {
    setError("");
    setPhase(next);
    scrollTop();
  }

  function advanceTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!trip.pickup || !trip.date || !trip.time) return;
    go("vehicle");
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contact.consent || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    const preferenceNote = [
      `Preferred vehicle: ${selectedVehicle.name}.`,
      `Pilot estimate shown: $${estimate}.`,
      contact.notes.trim(),
    ].filter(Boolean).join(" ");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "ride",
          contactName: contact.contactName,
          email: contact.email,
          phone: contact.phone,
          company: contact.company || undefined,
          tripType: formatService(service),
          pickupAt: `${trip.date}T${trip.time}`,
          pickup: trip.pickup,
          dropoff: trip.destination || undefined,
          passengers: trip.passengers,
          flightNumber: trip.flightNumber || undefined,
          notes: preferenceNote,
          consent: contact.consent,
          website: "",
        }),
      });

      const payload = await response.json().catch(() => ({})) as { message?: string; error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "We couldn’t send this request. Please try again.");
      }

      setServerMessage(payload.message || "Request received. The Altaie desk will confirm coverage and final pricing shortly.");
      setPhase("submitted");
      scrollTop();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We couldn’t send this request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (phase === "submitted") {
    return (
      <section className="direct-booking direct-booking--confirmed">
        <div className="direct-confirmation">
          <div className="direct-confirmation__mark">✓</div>
          <p className="direct-kicker">Private beta request</p>
          <h1>Request received.</h1>
          <p>{serverMessage}</p>
          <div className="direct-confirmation__card">
            <div><span>Pickup</span><strong>{trip.pickup}</strong><small>{trip.date} · {trip.time}</small></div>
            <i />
            <div><span>{service === "hourly" ? "First stop" : "Destination"}</span><strong>{trip.destination || "To be coordinated"}</strong><small>{selectedVehicle.name} preferred</small></div>
            <dl>
              <div><dt>Status</dt><dd>Awaiting desk confirmation</dd></div>
              <div><dt>Pilot estimate</dt><dd><Money amount={estimate} /></dd></div>
              <div><dt>Passengers</dt><dd>{trip.passengers}</dd></div>
              <div><dt>Contact</dt><dd>{contact.contactName}</dd></div>
            </dl>
          </div>
          <div className="direct-confirmation__actions">
            <button className="direct-button direct-button--dark" onClick={() => {
              setPhase("trip");
              setServerMessage("");
              setContact((current) => ({ ...current, consent: false }));
              scrollTop();
            }}>Request another ride</button>
            <Link className="direct-button direct-button--line" href="/">Back to Altaie</Link>
          </div>
          <p className="direct-prototype-note">No card was charged. Final availability and price are confirmed by the Altaie coordination desk.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="direct-booking">
      <header className="direct-booking__header">
        <div><AltaieMiniMark /><span>Altaie private beta</span></div>
        <p><i /> Washington desk online</p>
      </header>

      <div className="direct-booking__layout">
        <aside className="direct-booking__steps" aria-label="Request progress">
          <p className="direct-kicker">Service request</p>
          <h1>Washington,<br />handled.</h1>
          <ol>
            {steps.map((step, index) => (
              <li key={step.id} className={phase === step.id ? "is-current" : index < phaseIndex ? "is-complete" : ""}>
                <span>{index < phaseIndex ? "✓" : `0${index + 1}`}</span>
                <strong>{step.label}</strong>
              </li>
            ))}
          </ol>
          <div className="direct-booking__assurance">
            <strong>One accountable desk.</strong>
            <p>Submit the itinerary once. Altaie confirms coverage, partner assignment, and the final total before the ride is accepted.</p>
          </div>
        </aside>

        <div className="direct-booking__main">
          {phase === "trip" && (
            <form className="direct-screen" onSubmit={advanceTrip}>
              <div className="direct-screen__heading">
                <p className="direct-kicker">01 · Trip</p>
                <h2>Where does the day need to go?</h2>
                <p>Start with the itinerary. The desk will validate real coverage before anything is confirmed.</p>
              </div>

              <fieldset className="direct-service-tabs">
                <legend>Service type</legend>
                {(["one-way", "round-trip", "hourly"] as Service[]).map((item) => (
                  <label key={item}>
                    <input type="radio" name="service" checked={service === item} onChange={() => setService(item)} />
                    <span>{formatService(item)}</span>
                  </label>
                ))}
              </fieldset>

              <div className="direct-fields">
                <label className="direct-field direct-field--wide">
                  <span>Pickup</span>
                  <input value={trip.pickup} onChange={(event) => setTrip({ ...trip, pickup: event.target.value })} placeholder="Hotel, office, residence, airport" required autoComplete="street-address" />
                </label>
                <label className="direct-field direct-field--wide">
                  <span>{service === "hourly" ? "First stop" : "Destination"}</span>
                  <input value={trip.destination} onChange={(event) => setTrip({ ...trip, destination: event.target.value })} placeholder={service === "hourly" ? "Optional first stop" : "Airport, office, hotel, residence"} />
                </label>
                <label className="direct-field">
                  <span>Date</span>
                  <input ref={dateInputRef} type="date" value={trip.date} onChange={(event) => setTrip({ ...trip, date: event.target.value })} required />
                </label>
                <label className="direct-field">
                  <span>Pickup time</span>
                  <input type="time" value={trip.time} onChange={(event) => setTrip({ ...trip, time: event.target.value })} required />
                </label>
                <label className="direct-field">
                  <span>Passengers</span>
                  <select value={trip.passengers} onChange={(event) => setTrip({ ...trip, passengers: event.target.value })}>
                    <option>1</option><option>2</option><option>3</option><option>4</option><option>5–6</option>
                  </select>
                </label>
                <label className="direct-field">
                  <span>Flight number</span>
                  <input value={trip.flightNumber} onChange={(event) => setTrip({ ...trip, flightNumber: event.target.value.toUpperCase() })} placeholder="Optional" autoCapitalize="characters" />
                </label>
              </div>

              <div className="direct-inline-note">
                <span>Private beta</span>
                <p>Only the Altaie desk confirms live availability. No vehicle, chauffeur, or price is represented as final until the desk accepts the assignment.</p>
              </div>
              <button className="direct-button direct-button--dark direct-button--wide" type="submit">Choose vehicle preference</button>
            </form>
          )}

          {phase === "vehicle" && (
            <section className="direct-screen">
              <div className="direct-screen__heading">
                <p className="direct-kicker">02 · Vehicle</p>
                <h2>Choose the experience.</h2>
                <p>Select the class you prefer. The desk will confirm the exact operator and vehicle before acceptance.</p>
              </div>
              <div className="direct-vehicles" role="radiogroup" aria-label="Vehicle preference">
                {vehicles.map((vehicle) => (
                  <button key={vehicle.id} type="button" className={vehicleId === vehicle.id ? "is-selected" : ""} role="radio" aria-checked={vehicleId === vehicle.id} onClick={() => setVehicleId(vehicle.id)}>
                    <Image src={vehicle.image} width={vehicle.imageWidth} height={vehicle.imageHeight} alt={`${vehicle.name} vehicle class`} />
                    <div className="direct-vehicle-copy"><span>{vehicle.category}</span><h3>{vehicle.name}</h3><p>{vehicle.seats} · {vehicle.luggage}</p><small>{vehicle.note}</small></div>
                    <div className="direct-vehicle-price"><strong><Money amount={vehicle.estimates[service]} /></strong><span>Pilot estimate</span></div>
                    <i>{vehicleId === vehicle.id ? "✓" : ""}</i>
                  </button>
                ))}
              </div>
              <div className="direct-screen__actions">
                <button className="direct-button direct-button--dark" type="button" onClick={() => go("checkout")}>Continue with {selectedVehicle.name}</button>
                <button className="direct-text-button" type="button" onClick={() => go("trip")}>Edit itinerary</button>
              </div>
            </section>
          )}

          {phase === "checkout" && (
            <form className="direct-screen" onSubmit={submitRequest}>
              <div className="direct-screen__heading">
                <p className="direct-kicker">03 · Contact</p>
                <h2>Give the desk one point of contact.</h2>
                <p>We use this information only to coordinate and respond to this request.</p>
              </div>
              <div className="direct-fields">
                <label className="direct-field"><span>Name</span><input value={contact.contactName} onChange={(event) => setContact({ ...contact, contactName: event.target.value })} autoComplete="name" required /></label>
                <label className="direct-field"><span>Mobile</span><input type="tel" value={contact.phone} onChange={(event) => setContact({ ...contact, phone: event.target.value })} autoComplete="tel" inputMode="tel" required /></label>
                <label className="direct-field direct-field--wide"><span>Email</span><input type="email" value={contact.email} onChange={(event) => setContact({ ...contact, email: event.target.value })} autoComplete="email" inputMode="email" required /></label>
                <label className="direct-field direct-field--wide"><span>Company or account</span><input value={contact.company} onChange={(event) => setContact({ ...contact, company: event.target.value })} autoComplete="organization" placeholder="Optional" /></label>
                <label className="direct-field direct-field--wide"><span>Notes for the desk</span><textarea rows={4} value={contact.notes} onChange={(event) => setContact({ ...contact, notes: event.target.value })} placeholder="Luggage, accessibility, traveler preferences, stops, meet instructions…" /></label>
              </div>
              <label className="direct-consent">
                <input type="checkbox" checked={contact.consent} onChange={(event) => setContact({ ...contact, consent: event.target.checked })} required />
                <span>I agree that Altaie may contact me about this request and understand that the displayed amount is a pilot estimate until coverage is confirmed.</span>
              </label>
              {error && <p className="direct-prototype-note" role="alert">{error}</p>}
              <div className="direct-screen__actions">
                <button className="direct-button direct-button--dark" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending request…" : <>Send request · est. <Money amount={estimate} /></>}</button>
                <button className="direct-text-button" type="button" onClick={() => go("vehicle")}>Change vehicle</button>
              </div>
              <p className="direct-prototype-note">No payment is collected in this private-beta flow. Altaie confirms availability and final pricing before acceptance.</p>
            </form>
          )}
        </div>

        <aside className="direct-booking__summary">
          <div className="direct-summary-status"><span>Pilot estimate</span><strong><Money amount={estimate} /></strong><small>Subject to desk confirmation</small></div>
          <div className="direct-summary-route">
            <span>Pickup · {trip.date || "Choose date"} · {trip.time || "Choose time"}</span>
            <strong>{trip.pickup || "Add pickup"}</strong>
            <i />
            <span>{service === "hourly" ? "First stop" : "Destination"}</span>
            <strong>{trip.destination || "To be coordinated"}</strong>
          </div>
          <dl>
            <div><dt>Service</dt><dd>{formatService(service)}</dd></div>
            <div><dt>Vehicle</dt><dd>{selectedVehicle.name}</dd></div>
            <div><dt>Passengers</dt><dd>{trip.passengers}</dd></div>
            <div><dt>Confirmation</dt><dd>Altaie desk</dd></div>
          </dl>
          <div className="direct-summary-help"><strong>Need coordination?</strong><p>Complex timing, multi-stop movement, airport changes, and traveler preferences can all be handled in the notes or directly by the desk.</p></div>
        </aside>
      </div>
    </section>
  );
}
