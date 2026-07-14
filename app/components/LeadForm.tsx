"use client";

import { FormEvent, useId, useState } from "react";

type FormKind = "ride" | "corporate" | "partner";

const serviceOptions = ["Airport transfers", "Hourly / as-directed", "Roadshows", "Events and groups"];
const jurisdictionOptions = ["District of Columbia", "Maryland", "Virginia", "WMATC / interstate"];
const vehicleOptions = ["Executive sedan", "Premium SUV", "Sprinter / executive van", "Mini-coach / coach"];

function CheckboxGroup({ name, legend, options }: { name: string; legend: string; options: string[] }) {
  return (
    <fieldset className="checkbox-group">
      <legend>{legend}</legend>
      <div>
        {options.map((option) => (
          <label key={option}><input type="checkbox" name={name} value={option} /> <span>{option}</span></label>
        ))}
      </div>
    </fieldset>
  );
}

export function LeadForm({ kind }: { kind: FormKind }) {
  const id = useId();
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload: Record<string, string | string[] | boolean> = { kind, consent: data.get("consent") === "on" };

    for (const [key, value] of data.entries()) {
      if (key === "consent") continue;
      if (key.endsWith("[]")) {
        const cleanKey = key.slice(0, -2);
        payload[cleanKey] = data.getAll(key).map(String);
      } else {
        payload[key] = String(value);
      }
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error || "We couldn’t send this request.");
      form.reset();
      setState("success");
      setMessage(result.message || "Your request is with our coordination desk.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "We couldn’t send this request.");
    }
  }

  return (
    <form className="lead-form" onSubmit={submit} aria-labelledby={`${id}-title`}>
      <div className="form-heading">
        <p className="eyebrow">{kind === "ride" ? "Trip request" : kind === "corporate" ? "Corporate account" : "Operator application"}</p>
        <h2 id={`${id}-title`}>{kind === "ride" ? "Tell us where the day needs to go." : kind === "corporate" ? "Build a calmer ground program." : "Join the Altaie standard."}</h2>
        <p>{kind === "ride" ? "This is a request, not an automatic confirmation. We’ll verify coverage and return a fixed quote." : kind === "corporate" ? "Share your recurring needs and we’ll shape an account around the people who actually coordinate travel." : "Start with the operating facts. We do not ask for sensitive documents at this stage."}</p>
      </div>

      <div className="form-grid">
        <label>Contact name<input name="contactName" autoComplete="name" required maxLength={100} /></label>
        <label>{kind === "corporate" ? "Work email" : "Email"}<input name="email" type="email" autoComplete="email" required maxLength={160} /></label>
        <label>Phone<input name="phone" type="tel" autoComplete="tel" required maxLength={40} /></label>
        {kind !== "ride" && <label>Company<input name="company" autoComplete="organization" required maxLength={140} /></label>}

        {kind === "ride" && <>
          <label>Service type<select name="tripType" required defaultValue=""><option value="" disabled>Select one</option><option>One-way transfer</option><option>Round trip</option><option>Hourly / as-directed</option><option>Roadshow or event</option></select></label>
          <label>Pickup date and time<input name="pickupAt" type="datetime-local" required /></label>
          <label className="field-wide">Pickup location<input name="pickup" required maxLength={180} placeholder="Address, airport, hotel, or venue" /></label>
          <label className="field-wide">Destination<input name="dropoff" maxLength={180} placeholder="Leave blank for hourly service" /></label>
          <label>Passengers<select name="passengers" required defaultValue="1"><option>1</option><option>2</option><option>3</option><option>4</option><option>5–6</option><option>7+</option></select></label>
          <label>Flight number, if relevant<input name="flightNumber" maxLength={24} /></label>
        </>}

        {kind === "corporate" && <>
          <label>Expected rides per month<select name="monthlyRideBand" required defaultValue=""><option value="" disabled>Select a range</option><option>1–5</option><option>6–20</option><option>21–50</option><option>51+</option></select></label>
          <div className="field-spacer" />
          <CheckboxGroup name="serviceNeeds[]" legend="Typical needs" options={serviceOptions} />
        </>}

        {kind === "partner" && <>
          <CheckboxGroup name="jurisdictions[]" legend="Operating jurisdictions" options={jurisdictionOptions} />
          <CheckboxGroup name="vehicleCategories[]" legend="Vehicle categories" options={vehicleOptions} />
          <label className="field-wide">Operating authority identifiers<input name="authorityNumbers" maxLength={240} placeholder="DFHV, NDL, WMATC, MD PSC, VA DMV, USDOT, as applicable" /></label>
          <label className="field-wide">Primary service areas<input name="serviceAreas" required maxLength={240} placeholder="Cities, counties, airports, and usual corridors" /></label>
        </>}

        <label className="field-wide">{kind === "ride" ? "Itinerary notes" : "Anything we should know?"}<textarea name="notes" rows={5} maxLength={1500} placeholder={kind === "ride" ? "Passenger name, luggage, stops, accessibility needs, child seats, or preferences" : "Share only the details needed for this first conversation."} /></label>
        <label className="website-field" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>

      <label className="consent"><input name="consent" type="checkbox" required /> <span>I agree that Altaie may use these details to respond to this request. I have read the <a href="/privacy">privacy notice</a>.</span></label>
      <div className="form-actions">
        <button className="button button--brass" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : kind === "ride" ? "Request review" : "Send inquiry"}</button>
        <p className={`form-status form-status--${state}`} role="status" aria-live="polite">{message}</p>
      </div>
    </form>
  );
}
