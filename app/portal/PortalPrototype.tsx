"use client";

import { FormEvent, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";

type Screen = "home" | "request" | "ride" | "trips" | "desk" | "account";
type RequestPhase = "details" | "review" | "sent";

const navigation: Array<{ id: Screen; label: string; cue: string }> = [
  { id: "home", label: "Home", cue: "H" },
  { id: "request", label: "Book", cue: "+" },
  { id: "ride", label: "Ride detail", cue: "R" },
  { id: "trips", label: "Trips", cue: "T" },
  { id: "desk", label: "Coordination desk", cue: "D" },
  { id: "account", label: "Account", cue: "A" },
];

const screenTitles: Record<Screen, string> = {
  home: "Today",
  request: "Book a ride",
  ride: "Ride detail",
  trips: "Trips",
  desk: "Coordination desk",
  account: "Corporate account",
};

const trips = [
  { id: "AT-1048", date: "Tue, Jul 21 · 7:10 AM", route: "The Jefferson → DCA", rider: "Jordan Lee", status: "Confirmed", tone: "dark" },
  { id: "AT-1052", date: "Thu, Jul 23 · 1:30 PM", route: "IAD → 800 17th St NW", rider: "Priya Shah", status: "Confirmed", tone: "dark" },
  { id: "AT-1039", date: "Fri, Jul 10 · 5:45 PM", route: "Union Station → Georgetown", rider: "Daniel Wu", status: "Completed", tone: "line" },
];

function AltaieMark() {
  return <span className="portal-mark" aria-hidden="true"><i /></span>;
}

function StatusPill({ children, tone = "stone" }: { children: ReactNode; tone?: string }) {
  return <span className={`portal-status portal-status--${tone}`}>{children}</span>;
}

function RouteLine({ pickup = "The Jefferson", destination = "DCA · Terminal 2" }: { pickup?: string; destination?: string }) {
  return (
    <div className="portal-route">
      <div><span className="portal-route__node" /><p><small>Pickup</small>{pickup}</p></div>
      <div><span className="portal-route__node portal-route__node--end" /><p><small>Destination</small>{destination}</p></div>
    </div>
  );
}

function HomeScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  return (
    <div className="portal-screen portal-screen--home">
      <section className="portal-welcome">
        <p className="portal-kicker">Monday, July 20</p>
        <h1>Good morning, Maya.</h1>
        <p>Three assignments are confirmed. One ride-day update is with the coordination desk.</p>
      </section>

      <section className="portal-stat-grid" aria-label="Account overview">
        <article><span>01</span><strong>2</strong><p>Confirmed rides</p></article>
        <article><span>02</span><strong>1</strong><p>Active coordination</p></article>
        <article><span>03</span><strong>4</strong><p>Traveler profiles</p></article>
      </section>

      <div className="portal-home-grid">
        <section className="portal-next-card">
          <div className="portal-card-head"><div><p className="portal-kicker portal-kicker--light">Next assignment</p><h2>Tomorrow · 7:10 AM</h2></div><StatusPill tone="light">Confirmed</StatusPill></div>
          <RouteLine />
          <dl className="portal-detail-grid portal-detail-grid--inverse">
            <div><dt>Rider</dt><dd>Jordan Lee</dd></div>
            <div><dt>Service</dt><dd>Airport transfer</dd></div>
            <div><dt>Vehicle</dt><dd>Executive sedan</dd></div>
            <div><dt>Chauffeur</dt><dd>Fahad Hamid</dd></div>
          </dl>
          <div className="portal-actions"><button className="portal-button portal-button--white" onClick={() => navigate("ride")}>View ride</button><button className="portal-button portal-button--ghost" onClick={() => navigate("desk")}>Message desk</button></div>
        </section>

        <aside className="portal-desk-note">
          <p className="portal-kicker">Desk note</p>
          <h2>Departure adjusted.</h2>
          <p>DCA pickup moved 15 minutes earlier after the flight-time change. Jordan and the chauffeur brief are updated.</p>
          <button className="portal-text-button" onClick={() => navigate("desk")}>Open conversation <span>↗</span></button>
        </aside>
      </div>

      <section className="portal-section-head"><div><p className="portal-kicker">Upcoming</p><h2>Keep the week in view.</h2></div><button className="portal-text-button" onClick={() => navigate("trips")}>View all trips <span>↗</span></button></section>
      <div className="portal-trip-list">
        {trips.slice(0, 2).map((trip) => <button key={trip.id} className="portal-trip-row" onClick={() => navigate(trip.id === "AT-1048" ? "ride" : "trips")}><span>{trip.date}</span><strong>{trip.route}</strong><span>{trip.rider}</span><StatusPill tone={trip.tone}>{trip.status}</StatusPill><b>↗</b></button>)}
      </div>
    </div>
  );
}

function RequestScreen({ phase, setPhase }: { phase: RequestPhase; setPhase: (phase: RequestPhase) => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPhase("review");
  }

  if (phase === "sent") {
    return (
      <div className="portal-screen portal-center-state">
        <span className="portal-confirm-mark">✓</span>
        <p className="portal-kicker">Request AT-1058</p>
        <h1>The desk has it.</h1>
        <p>Your Altaie ride is confirmed. The itinerary, fixed total, and ride-day contact details have been sent to the traveler and booker.</p>
        <div className="portal-summary-card"><RouteLine pickup="The Hay-Adams" destination="IAD · Main Terminal" /><dl className="portal-detail-grid"><div><dt>Pickup</dt><dd>Jul 28 · 3:40 PM</dd></div><div><dt>Rider</dt><dd>Priya Shah</dd></div><div><dt>Vehicle</dt><dd>Premium SUV</dd></div><div><dt>Status</dt><dd>Confirmed</dd></div><div><dt>Fixed total</dt><dd>$224</dd></div><div><dt>Payment</dt><dd>Corporate account</dd></div></dl></div>
        <button className="portal-button portal-button--dark" onClick={() => setPhase("details")}>Book another ride</button>
      </div>
    );
  }

  if (phase === "review") {
    return (
      <div className="portal-screen portal-request-review">
        <div className="portal-form-intro"><p className="portal-kicker">Confirm booking</p><h1>One last look.</h1><p>This vehicle is available. Confirming creates the booking immediately at the fixed total shown.</p></div>
        <section className="portal-summary-card portal-summary-card--large">
          <div className="portal-card-head"><h2>Airport transfer</h2><StatusPill tone="dark">Available</StatusPill></div>
          <RouteLine pickup="The Hay-Adams" destination="IAD · Main Terminal" />
          <dl className="portal-detail-grid"><div><dt>Date and time</dt><dd>Tue, Jul 28 · 3:40 PM</dd></div><div><dt>Rider</dt><dd>Priya Shah</dd></div><div><dt>Passengers</dt><dd>2</dd></div><div><dt>Vehicle</dt><dd>Premium SUV</dd></div><div><dt>Flight</dt><dd>LH 419</dd></div><div><dt>Cost center</dt><dd>Client 247</dd></div></dl>
          <div className="portal-review-note"><strong>Fixed total · $224</strong><p>Includes flight tracking, tolls, airport access, standard grace time, and Altaie coordination. No surge pricing.</p></div>
        </section>
        <div className="portal-actions"><button className="portal-button portal-button--dark" onClick={() => setPhase("sent")}>Confirm booking · $224</button><button className="portal-button portal-button--line" onClick={() => setPhase("details")}>Edit details</button></div>
      </div>
    );
  }

  return (
    <div className="portal-screen portal-request">
      <div className="portal-form-intro"><p className="portal-kicker">Direct booking</p><h1>Where does the day need to go?</h1><p>Enter the itinerary, select an available class, and confirm a fixed total directly.</p></div>
      <form className="portal-request-form" onSubmit={submit}>
        <fieldset className="portal-service-picker"><legend>Service</legend><label><input type="radio" name="service" defaultChecked /><span>One-way</span></label><label><input type="radio" name="service" /><span>Round trip</span></label><label><input type="radio" name="service" /><span>Hourly</span></label></fieldset>
        <div className="portal-form-grid">
          <label className="portal-field portal-field--wide"><span>Pickup</span><input defaultValue="The Hay-Adams, 800 16th St NW" required /></label>
          <label className="portal-field portal-field--wide"><span>Destination</span><input defaultValue="IAD · Main Terminal" required /></label>
          <label className="portal-field"><span>Date</span><input type="date" defaultValue="2026-07-28" required /></label>
          <label className="portal-field"><span>Pickup time</span><input type="time" defaultValue="15:40" required /></label>
          <label className="portal-field"><span>Rider</span><select defaultValue="Priya Shah"><option>Priya Shah</option><option>Jordan Lee</option><option>Daniel Wu</option><option>Guest traveler</option></select></label>
          <label className="portal-field"><span>Passengers</span><select defaultValue="2"><option>1</option><option>2</option><option>3</option><option>4</option><option>5–6</option></select></label>
          <label className="portal-field"><span>Vehicle</span><select defaultValue="Premium SUV"><option>Executive sedan</option><option>Premium SUV</option><option>Sprinter by request</option></select></label>
          <label className="portal-field"><span>Flight</span><input defaultValue="LH 419" /></label>
          <label className="portal-field"><span>Cost center</span><select defaultValue="Client 247"><option>Client 247</option><option>Corporate</option><option>Non-billable</option></select></label>
          <label className="portal-field"><span>Contact phone</span><input type="tel" defaultValue="202 555 0148" /></label>
          <label className="portal-field portal-field--wide"><span>Notes for the desk</span><textarea rows={4} defaultValue="Two checked bags. Rider prefers text updates to the assistant only." /></label>
        </div>
        <div className="portal-form-footer"><p><strong>Same-day?</strong> Only vehicle classes with verified live coverage are shown as bookable.</p><button className="portal-button portal-button--dark" type="submit">Review booking</button></div>
      </form>
    </div>
  );
}

function RideScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  const [notice, setNotice] = useState("");
  return (
    <div className="portal-screen portal-ride">
      <section className="portal-ride-hero">
        <div><p className="portal-kicker portal-kicker--light">AT-1048 · Tomorrow</p><h1>7:10 AM</h1><p>The Jefferson → DCA</p></div><StatusPill tone="light">Confirmed</StatusPill>
      </section>
      <div className="portal-ride-grid">
        <section className="portal-summary-card portal-summary-card--large">
          <div className="portal-card-head"><div><p className="portal-kicker">Itinerary</p><h2>Airport departure</h2></div><button className="portal-text-button" onClick={() => setNotice("Change request opened. The desk will confirm any itinerary update in writing.")}>Request change</button></div>
          <RouteLine />
          <div className="portal-progress" aria-label="Ride progress"><span className="is-complete" /><span className="is-complete" /><span className="is-current" /><span /><span /></div>
          <div className="portal-progress-labels"><span>Confirmed</span><span>Briefed</span><strong>Chauffeur assigned</strong><span>En route</span><span>Complete</span></div>
          {notice && <p className="portal-notice" role="status">{notice}</p>}
          <dl className="portal-detail-grid"><div><dt>Rider</dt><dd>Jordan Lee</dd></div><div><dt>Passengers</dt><dd>1</dd></div><div><dt>Vehicle</dt><dd>Executive sedan</dd></div><div><dt>Flight</dt><dd>UA 1842</dd></div><div><dt>Pickup standard</dt><dd>Chauffeur planned 15 min early</dd></div><div><dt>Airport grace</dt><dd>60 minutes for arrivals</dd></div></dl>
        </section>
        <aside className="portal-assignment-card">
          <p className="portal-kicker">Assignment</p>
          <Image className="portal-avatar portal-avatar--driver" src="/images/chauffeurs/fahad-hamid-portrait.webp" width={116} height={116} alt="Fahad Hamid chauffeur portrait" />
          <h2>Fahad Hamid</h2><p>Chauffeur profile preview</p>
          <div className="portal-vehicle-swatch" aria-hidden="true" />
          <dl><div><dt>Vehicle</dt><dd>Black executive sedan</dd></div><div><dt>Identifier</dt><dd>4821</dd></div><div><dt>Meet note</dt><dd>Main entrance, curbside</dd></div></dl>
          <button className="portal-button portal-button--line" onClick={() => navigate("desk")}>Contact coordination desk</button>
        </aside>
      </div>
    </div>
  );
}

function TripsScreen({ navigate }: { navigate: (screen: Screen) => void }) {
  const [filter, setFilter] = useState<"upcoming" | "history">("upcoming");
  const visible = filter === "upcoming" ? trips.slice(0, 2) : trips.slice(2);
  return (
    <div className="portal-screen portal-trips">
      <div className="portal-page-intro"><p className="portal-kicker">Assignments</p><h1>Every ride, one record.</h1></div>
      <div className="portal-tabs" role="tablist" aria-label="Trip filter"><button role="tab" aria-selected={filter === "upcoming"} onClick={() => setFilter("upcoming")}>Upcoming</button><button role="tab" aria-selected={filter === "history"} onClick={() => setFilter("history")}>History</button></div>
      <div className="portal-trip-cards">
        {visible.map((trip) => <button key={trip.id} className="portal-trip-card" onClick={() => trip.id === "AT-1048" && navigate("ride")}><div><p className="portal-kicker">{trip.id}</p><h2>{trip.route}</h2><p>{trip.date}</p></div><dl><div><dt>Rider</dt><dd>{trip.rider}</dd></div><div><dt>Service</dt><dd>{trip.id === "AT-1052" ? "Airport arrival" : "Point-to-point"}</dd></div><div><dt>Status</dt><dd><StatusPill tone={trip.tone}>{trip.status}</StatusPill></dd></div></dl><b>↗</b></button>)}
      </div>
      <button className="portal-button portal-button--dark" onClick={() => navigate("request")}>Book a ride</button>
    </div>
  );
}

function DeskScreen() {
  const [messages, setMessages] = useState(["Departure adjusted to 7:10 AM after UA 1842 moved earlier.", "Thank you. Please keep updates with me rather than the traveler.", "Understood. Jordan’s brief now routes ride-day updates to you."]);
  const [draft, setDraft] = useState("");
  function send(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!draft.trim()) return; setMessages([...messages, draft.trim()]); setDraft(""); }
  return (
    <div className="portal-screen portal-desk">
      <div className="portal-page-intro"><p className="portal-kicker">Live support</p><h1>One accountable desk.</h1><p>For booking questions and ride-day coordination. This prototype does not provide emergency or security support.</p></div>
      <section className="portal-message-shell">
        <header><div className="portal-avatar portal-avatar--small">A</div><div><strong>Altaie coordination desk</strong><span>Typically replies within the pilot service window</span></div><StatusPill>AT-1048</StatusPill></header>
        <div className="portal-messages" aria-live="polite">{messages.map((message, index) => <div key={`${index}-${message.slice(0, 8)}`} className={index % 2 ? "portal-message portal-message--user" : "portal-message"}><span>{index % 2 ? "You" : "Altaie desk"}</span><p>{message}</p><time>{index === messages.length - 1 ? "Now" : `8:${32 + index * 4} AM`}</time></div>)}</div>
        <form className="portal-compose" onSubmit={send}><label><span className="sr-only">Message the coordination desk</span><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Write a message" /></label><button className="portal-button portal-button--dark" type="submit">Send</button></form>
      </section>
    </div>
  );
}

function AccountScreen() {
  return (
    <div className="portal-screen portal-account">
      <div className="portal-page-intro"><p className="portal-kicker">Founding account</p><h1>Aster & Rowe LLP</h1><p>Washington office · Corporate travel pilot</p></div>
      <div className="portal-account-grid">
        <section className="portal-summary-card"><div className="portal-card-head"><h2>Traveler profiles</h2><button className="portal-text-button">Add traveler</button></div><div className="portal-profile-list">{[["JL","Jordan Lee","Text assistant only"],["PS","Priya Shah","Premium SUV preferred"],["DW","Daniel Wu","Quiet ride"],["+","Guest traveler","Add when requesting"]].map(([initials,name,note]) => <button key={name}><span>{initials}</span><strong>{name}</strong><small>{note}</small><b>↗</b></button>)}</div></section>
        <section className="portal-summary-card"><h2>Program settings</h2><dl className="portal-settings"><div><dt>Primary booker</dt><dd>Maya Chen</dd></div><div><dt>Default updates</dt><dd>Booker + traveler</dd></div><div><dt>Direct booking</dt><dd>Enabled</dd></div><div><dt>Billing reference</dt><dd>Cost center per ride</dd></div><div><dt>Ride history</dt><dd>Connected through Moovs in production</dd></div></dl><button className="portal-button portal-button--line">Edit preferences</button></section>
      </div>
    </div>
  );
}

export function PortalPrototype() {
  const [screen, setScreen] = useState<Screen>("home");
  const [requestPhase, setRequestPhase] = useState<RequestPhase>("details");

  function navigate(next: Screen) {
    setScreen(next);
    if (next !== "request") setRequestPhase("details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="portal-root">
      <aside className="portal-sidebar">
        <div className="portal-logo"><AltaieMark /><div><strong>Altaie</strong><span>Client portal</span></div></div>
        <nav aria-label="Client portal navigation">{navigation.map((item) => <button key={item.id} className={screen === item.id ? "is-active" : ""} aria-current={screen === item.id ? "page" : undefined} onClick={() => navigate(item.id)}><span>{item.cue}</span>{item.label}</button>)}</nav>
        <div className="portal-sidebar-foot"><span>Pilot preview</span><p>Washington · DCA · IAD · BWI</p></div>
      </aside>

      <div className="portal-main">
        <header className="portal-topbar"><div><span className="portal-mobile-mark"><AltaieMark /></span><p>{screenTitles[screen]}</p></div><div><button className="portal-help" onClick={() => navigate("desk")}>Help desk</button><button className="portal-user" onClick={() => navigate("account")} aria-label="Open account">MC</button></div></header>
        <main className="portal-content">
          {screen === "home" && <HomeScreen navigate={navigate} />}
          {screen === "request" && <RequestScreen phase={requestPhase} setPhase={setRequestPhase} />}
          {screen === "ride" && <RideScreen navigate={navigate} />}
          {screen === "trips" && <TripsScreen navigate={navigate} />}
          {screen === "desk" && <DeskScreen />}
          {screen === "account" && <AccountScreen />}
        </main>
        <footer className="portal-product-note">Interactive product concept · Production reservations, accounts, payments, and ride history remain connected through Moovs.</footer>
      </div>

      <nav className="portal-mobile-nav" aria-label="Mobile client portal navigation">{navigation.filter((item) => ["home","request","trips","desk","account"].includes(item.id)).map((item) => <button key={item.id} className={screen === item.id ? "is-active" : ""} onClick={() => navigate(item.id)}><span>{item.cue}</span>{item.label === "Coordination desk" ? "Desk" : item.label}</button>)}</nav>
    </div>
  );
}
