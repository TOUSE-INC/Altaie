"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./AdvancedMobilePortal.module.css";

type Tab = "home" | "rides" | "desk" | "you";
type BookingPhase = "plan" | "review" | "sent";

type Ride = {
  id: string;
  date: string;
  time: string;
  route: string;
  rider: string;
  status: string;
  tone: "live" | "watch" | "quiet";
};

const rides: Ride[] = [
  { id: "AT-1048", date: "Tomorrow", time: "7:10 AM", route: "The Jefferson → DCA", rider: "Jordan Lee", status: "Chauffeur briefed", tone: "live" },
  { id: "AT-1052", date: "Thu 13", time: "1:30 PM", route: "IAD → K Street", rider: "Priya Shah", status: "Confirmed", tone: "quiet" },
  { id: "AT-1057", date: "Fri 14", time: "6:45 PM", route: "Georgetown → DCA", rider: "Jordan Lee", status: "Desk watching", tone: "watch" },
];

function StatusDot({ tone = "live" }: { tone?: Ride["tone"] }) {
  return <span className={`${styles.statusDot} ${styles[`statusDot_${tone}`]}`} />;
}

function GlassTab({ active, icon, label, onClick }: { active: boolean; icon: string; label: string; onClick: () => void }) {
  return <button className={`${styles.navTab} ${active ? styles.navTabActive : ""}`} onClick={onClick}><span>{icon}</span><small>{label}</small></button>;
}

function RouteCanvas({ eta = "12", live = true }: { eta?: string; live?: boolean }) {
  return <div className={styles.routeCanvas} aria-label="Route status visualization">
    <div className={styles.mapGrid} />
    <div className={styles.mapGlow} />
    {live && <span className={styles.livePill}><StatusDot /> Live</span>}
    <div className={styles.etaBlock}><strong>{eta}</strong><span>MIN</span><small>{live ? "Chauffeur arriving" : "Estimated drive"}</small></div>
    <div className={styles.routeTrack}><i className={styles.routeOrigin} /><b /><i className={styles.routeDestination} /><span className={styles.vehicleMarker}>SUV</span></div>
  </div>;
}

function Home({ openBooking, go }: { openBooking: () => void; go: (tab: Tab) => void }) {
  return <div className={styles.screen}>
    <header className={styles.appHeader}>
      <div><span className={styles.brandDot} /> <b>ALTAIE DC</b></div>
      <span className={styles.onlinePill}><StatusDot /> Desk online</span>
    </header>
    <h1 className={styles.greeting}>Good evening, Maya.</h1>

    <button className={styles.nextMovement} onClick={() => go("rides")}>
      <div className={styles.cardTop}><span><StatusDot /> Next movement</span><small>AT-1048</small></div>
      <div className={styles.timeRow}><strong>7:10</strong><span>Tomorrow<br /><b>AM</b></span></div>
      <div className={styles.routeRow}><i /><b /><i /><div><strong>The Jefferson → DCA</strong><small>Executive sedan · UA 1842</small></div></div>
      <div className={styles.stateRow}><span><StatusDot /> Chauffeur briefed</span><small>On track</small></div>
      <div className={styles.progress}><i /></div>
    </button>

    <div className={styles.commandGrid}>
      <button onClick={openBooking}><span className={styles.commandIconChampagne}>↗</span><b>Book ride</b><small>New movement</small></button>
      <button onClick={() => go("desk")}><span className={styles.commandIconElectric}>✦</span><b>Message</b><small>Coordination desk</small></button>
      <button onClick={() => go("you")}><span className={styles.commandIconLive}>＋</span><b>Traveler</b><small>Profiles & prefs</small></button>
    </div>

    <div className={styles.sectionHead}><span>UPCOMING</span><button onClick={() => go("rides")}>View all</button></div>
    <div className={styles.upcomingList}>
      {rides.slice(1).map((ride) => <button key={ride.id} onClick={() => go("rides")}>
        <span className={styles.dateTile}><b>{ride.date}</b><small>{ride.time}</small></span>
        <span className={styles.rideCopy}><b>{ride.route}</b><small>{ride.rider} · {ride.status}</small></span>
        <span>›</span>
      </button>)}
    </div>
  </div>;
}

function RideDetail() {
  return <div className={`${styles.screen} ${styles.rideScreen}`}>
    <RouteCanvas />
    <section className={styles.rideSheet}>
      <div className={styles.sheetGrab} />
      <h2>The Jefferson → DCA</h2><p>Tomorrow · 7:10 AM · UA 1842</p>
      <div className={styles.driverCard}><span className={styles.avatar}>MT</span><div><b>Marcus T.</b><small>Executive sedan · 4821</small></div><span className={styles.verified}>Verified</span></div>
      <div className={styles.dualActions}><button>✦ <span>Message desk</span></button><button>⌕ <span>Call chauffeur</span></button></div>
      <div className={styles.timelineLabel}>Ride timeline</div>
      <div className={styles.timeline}>{["Confirmed","Briefed","Assigned","En route","Complete"].map((item, i) => <span key={item} className={i < 3 ? styles.timelineDone : ""}><i />{item}</span>)}</div>
      <div className={styles.deskWatch}><StatusDot /><div><b>Altaie desk is watching this movement</b><small>Flight and traffic monitoring active</small></div></div>
    </section>
  </div>;
}

function Rides() {
  return <div className={styles.screen}>
    <div className={styles.pageIntro}><span>ASSIGNMENTS</span><h1>Every movement,<br />one record.</h1><p>Upcoming and completed rides stay with the traveler, booker, and coordination desk.</p></div>
    <div className={styles.rideList}>{rides.map((ride, index) => <article key={ride.id} className={styles.rideListCard}>
      <div className={styles.cardTop}><span>{ride.id}</span><span className={`${styles.rideStatus} ${styles[`rideStatus_${ride.tone}`]}`}><StatusDot tone={ride.tone} />{ride.status}</span></div>
      <h2>{ride.route}</h2><p>{ride.date} · {ride.time}</p>
      <div className={styles.rideListMeta}><span>{ride.rider}</span><span>{index === 1 ? "Airport arrival" : "Point-to-point"}</span><b>›</b></div>
    </article>)}</div>
  </div>;
}

function Desk() {
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  return <div className={styles.screen}>
    <div className={styles.pageIntro}><span>COORDINATION DESK</span><h1>A human is already<br />watching the details.</h1><p>Ride-day changes, passenger updates, and coverage questions route through one accountable desk.</p></div>
    <div className={styles.conciergeState}><span><StatusDot /> Online now</span><small>Typical response · under 3 min</small></div>
    <div className={styles.chatCard}>
      <div className={styles.chatInbound}>Good evening, Maya. I’m watching tomorrow’s DCA departure. What should I handle?</div>
      <div className={styles.chatOutbound}>Please keep Jordan’s assistant copied on the chauffeur update.</div>
      {sent && <div className={styles.chatOutbound}>{message || "Thanks — please handle it."}</div>}
    </div>
    <form className={styles.messageComposer} onSubmit={(e) => {e.preventDefault(); setSent(true);}}><input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Message the desk" /><button>↑</button></form>
  </div>;
}

function You() {
  return <div className={styles.screen}>
    <div className={styles.profileHero}><span className={styles.profileAvatar}>MC</span><div><span>ASTER & ROWE LLP</span><h1>Maya Chen</h1><p>Executive assistant · Founding account</p></div></div>
    <div className={styles.accountMetrics}><article><span>Travelers</span><b>4</b></article><article><span>Rides this month</span><b>11</b></article><article><span>Spend</span><b>$2.8K</b></article></div>
    <section className={styles.preferenceCard}><div className={styles.sectionHead}><span>SAVED PREFERENCES</span><button>Edit</button></div>{[["Service class","Black SUV / Executive"],["Meet & greet","Yes"],["Route preference","Avoid I-66 at peak"],["Refreshments","Still water"]].map(([k,v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}</section>
  </div>;
}

function BookingSheet({ phase, setPhase, close }: { phase: BookingPhase; setPhase: (p: BookingPhase) => void; close: () => void }) {
  const [pickup, setPickup] = useState("The Hay-Adams, 800 16th St NW");
  const [destination, setDestination] = useState("DCA · Terminal 2");
  const [email, setEmail] = useState("maya@asterrowe.example");
  const [phone, setPhone] = useState("202 555 0148");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const date = useMemo(() => { const d = new Date(Date.now() + 86400000); return d.toISOString().slice(0,10); }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (phase === "plan") { setPhase("review"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/leads", { method: "POST", headers: {"content-type":"application/json"}, body: JSON.stringify({ kind:"ride", contactName:"Maya Chen", email, phone, tripType:"one-way", pickupAt:`${date}T07:10`, pickup, dropoff:destination, passengers:"2", notes:"Advanced mobile portal request · Executive sedan", consent:true, website:"" }) });
      const data = await res.json(); if (!res.ok) throw new Error(data.error || "Unable to send request."); setPhase("sent");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to send request."); } finally { setLoading(false); }
  }

  return <div className={styles.bookingBackdrop} role="dialog" aria-modal="true" aria-label="New ride">
    <form className={styles.bookingSheet} onSubmit={submit}>
      <div className={styles.sheetGrab} /><div className={styles.bookingTop}><div><span>NEW RIDE</span><h2>{phase === "sent" ? "The desk has it." : phase === "review" ? "One last look." : "Plan the movement."}</h2></div><button type="button" onClick={close}>×</button></div>
      {phase === "sent" ? <div className={styles.sentState}><span>✓</span><h3>Request received</h3><p>Altaie will confirm coverage and the final total in writing.</p><button type="button" onClick={close}>Done</button></div> : <>
        <div className={styles.servicePills}><span className={styles.serviceActive}>One way</span><span>Hourly</span><span>Airport</span></div>
        <div className={styles.routeInputs}><label><i /><span>Pickup</span><input value={pickup} onChange={(e)=>setPickup(e.target.value)} required /></label><label><i /><span>Destination</span><input value={destination} onChange={(e)=>setDestination(e.target.value)} required /></label></div>
        <div className={styles.detailChips}><span>Tomorrow · 7:10 AM</span><span>2 riders</span><span>2 bags</span></div>
        <div className={styles.vehicleChoice}><span>Executive sedan<small>3 seats</small></span><b>$168</b></div>
        {phase === "review" && <div className={styles.contactFields}><input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} aria-label="Email" /><input type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} aria-label="Phone" /></div>}
        <div className={styles.estimate}><span><b>Pilot estimate</b><small>Coverage + final total confirmed by desk</small></span><strong>$168</strong></div>
        {error && <p className={styles.error}>{error}</p>}
        <button className={styles.primaryCta} disabled={loading}>{loading ? "Sending…" : phase === "review" ? "Send request →" : "Review request →"}</button>
      </>}
    </form>
  </div>;
}

export function AdvancedMobilePortal() {
  const [tab, setTab] = useState<Tab>("home");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingPhase, setBookingPhase] = useState<BookingPhase>("plan");
  function openBooking() { setBookingPhase("plan"); setBookingOpen(true); }
  return <div className={`${styles.root} altaie-mobile-app`}>
    <main className={styles.viewport}>{tab === "home" && <Home openBooking={openBooking} go={setTab} />}{tab === "rides" && <RideDetail />}{tab === "desk" && <Desk />}{tab === "you" && <You />}</main>
    <nav className={styles.floatingNav} aria-label="Client navigation">
      <GlassTab active={tab === "home"} icon="⌂" label="Home" onClick={() => setTab("home")} />
      <GlassTab active={tab === "rides"} icon="◇" label="Rides" onClick={() => setTab("rides")} />
      <button className={styles.bookAction} onClick={openBooking} aria-label="Book a ride">＋</button>
      <GlassTab active={tab === "desk"} icon="✦" label="Desk" onClick={() => setTab("desk")} />
      <GlassTab active={tab === "you"} icon="◉" label="You" onClick={() => setTab("you")} />
    </nav>
    {bookingOpen && <BookingSheet phase={bookingPhase} setPhase={setBookingPhase} close={() => setBookingOpen(false)} />}
  </div>;
}
