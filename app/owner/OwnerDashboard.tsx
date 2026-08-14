"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";

type View = "overview" | "operations" | "network" | "accounts" | "financials" | "compliance";
type RideFilter = "all" | "attention" | "airport";

const navigation: Array<{ id: View; label: string; cue: string }> = [
  { id: "overview", label: "Overview", cue: "01" },
  { id: "operations", label: "Live operations", cue: "02" },
  { id: "network", label: "Partner network", cue: "03" },
  { id: "accounts", label: "Corporate accounts", cue: "04" },
  { id: "financials", label: "Financials", cue: "05" },
  { id: "compliance", label: "Compliance", cue: "06" },
];

const rides = [
  { id: "AT-1054", time: "07:10", route: "The Jefferson → DCA", rider: "Jordan Lee", vehicle: "Sedan", partner: "Monument", driver: "Fahad Hamid", driverImage: "/images/chauffeurs/fahad-hamid-portrait.webp", status: "En route", tone: "live", type: "airport" },
  { id: "AT-1055", time: "08:30", route: "IAD → The Willard", rider: "Elena Park", vehicle: "SUV", partner: "Potomac", driver: "Lena R.", driverImage: "/images/owner/icons/driver-lena.jpg", status: "Flight delayed", tone: "watch", type: "airport" },
  { id: "AT-1056", time: "10:00", route: "K Street → Capitol Hill", rider: "Daniel Wu", vehicle: "Sedan", partner: "District", driver: "Omar K.", driverImage: "/images/owner/icons/driver-omar.jpg", status: "Confirmed", tone: "ready", type: "city" },
  { id: "AT-1057", time: "14:15", route: "Embassy Row · 4 stops", rider: "Amira Hassan", vehicle: "SUV", partner: "Monument", driver: "Fahad Hamid", driverImage: "/images/chauffeurs/fahad-hamid-portrait.webp", status: "Briefed", tone: "ready", type: "city" },
  { id: "AT-1058", time: "18:10", route: "Georgetown → DCA", rider: "Priya Shah", vehicle: "SUV", partner: "Unassigned", driver: "Unassigned", driverImage: "", status: "Needs coverage", tone: "alert", type: "airport" },
  { id: "AT-1059", time: "20:40", route: "BWI → Dupont Circle", rider: "Marcus Bell", vehicle: "Sedan", partner: "Capital", driver: "Omar K.", driverImage: "/images/owner/icons/driver-omar.jpg", status: "Confirmed", tone: "ready", type: "airport" },
];

const driverRoster = [
  { name: "Fahad Hamid", image: "/images/chauffeurs/fahad-hamid-portrait.webp", status: "En route", assignment: "AT-1054" },
  { name: "Lena R.", image: "/images/owner/icons/driver-lena.jpg", status: "Holding", assignment: "AT-1055" },
  { name: "Omar K.", image: "/images/owner/icons/driver-omar.jpg", status: "Briefed", assignment: "AT-1056" },
];

const fleetRoster = [
  { name: "Escalade ESV", image: "/images/owner/icons/escalade-fleet.jpg", count: "6 ready", note: "Core SUV" },
  { name: "Maybach S-Class", image: "/images/owner/icons/maybach-fleet.jpg", count: "2 by request", note: "Flagship sedan" },
];

const partners = [
  { name: "Monument Executive", code: "ME", status: "Preferred", sedans: 5, suvs: 4, sprinters: 1, score: 98.4, onTime: "99.1%", zones: "DC · DCA · IAD" },
  { name: "Potomac Mobility", code: "PM", status: "Active", sedans: 3, suvs: 4, sprinters: 1, score: 96.8, onTime: "97.5%", zones: "DC · VA · IAD" },
  { name: "District Chauffeur", code: "DC", status: "Active", sedans: 4, suvs: 2, sprinters: 0, score: 95.9, onTime: "96.8%", zones: "DC · DCA" },
  { name: "Capital Transport", code: "CT", status: "Backup", sedans: 2, suvs: 2, sprinters: 1, score: 94.2, onTime: "95.4%", zones: "DC · BWI" },
];

const accounts = [
  { name: "Aster & Rowe LLP", sector: "Law firm", rides: 18, value: "$14,820", growth: "+22%", status: "Active pilot" },
  { name: "Northbank Strategies", sector: "Government affairs", rides: 14, value: "$11,460", growth: "+18%", status: "Active pilot" },
  { name: "Meridian Association", sector: "Association", rides: 11, value: "$8,930", growth: "+9%", status: "Active pilot" },
  { name: "Halcyon Embassy Desk", sector: "Diplomatic travel", rides: 8, value: "$7,680", growth: "New", status: "Onboarding" },
];

function AltaieMark() {
  return <span className="owner-mark" aria-hidden="true"><i /></span>;
}

function Badge({ children, tone = "stone" }: { children: ReactNode; tone?: string }) {
  return <span className={`owner-badge owner-badge--${tone}`}>{children}</span>;
}

function SectionTitle({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return <div className="owner-section-title"><div><p className="owner-kicker">{eyebrow}</p><h2>{title}</h2></div>{action}</div>;
}

function Metric({ index, label, value, note, dark = false }: { index: string; label: string; value: string; note: string; dark?: boolean }) {
  return <article className={dark ? "owner-metric owner-metric--dark" : "owner-metric"}><span>{index}</span><p>{label}</p><strong>{value}</strong><small>{note}</small></article>;
}

function CoverageBars() {
  return <div className="owner-coverage-bars" aria-label="Available network capacity"><div><span>DCA</span><i style={{ width: "92%" }} /><strong>92%</strong></div><div><span>IAD</span><i style={{ width: "84%" }} /><strong>84%</strong></div><div><span>BWI</span><i style={{ width: "71%" }} /><strong>71%</strong></div><div><span>DC core</span><i style={{ width: "96%" }} /><strong>96%</strong></div></div>;
}

function Overview({ navigate }: { navigate: (view: View) => void }) {
  return <div className="owner-view owner-overview">
    <section className="owner-hero">
      <div className="owner-hero-copy">
        <p className="owner-kicker owner-kicker--light">Monday, July 20 · 6:42 AM EDT</p>
        <h1>Good morning,<br />Fahad.</h1>
        <div className="owner-readiness"><span>Network readiness</span><strong>96.8%</strong><p>One exception needs a decision.</p></div>
      </div>
      <figure className="owner-hero-visual">
        <Image src="/images/chauffeurs/fahad-hamid-airport.webp" width={1536} height={1024} priority alt="Fahad Hamid preparing a black executive SUV for an airport arrival" />
        <figcaption><span>Live service</span><strong>Executive SUV · DC core</strong><small>Chauffeur verified · vehicle inspected</small></figcaption>
      </figure>
    </section>

    <section className="owner-metric-grid" aria-label="Business overview">
      <Metric index="01" label="Assignments today" value="12" note="6 active · 6 upcoming" />
      <Metric index="02" label="On-time pickups" value="97.2%" note="Trailing 30 days" />
      <Metric index="03" label="Contribution margin" value="31.4%" note="Month to date" />
      <Metric index="04" label="Projected monthly GMV" value="$78.4K" note="Up 18.6%" dark />
    </section>

    <section className="owner-visual-pulse" aria-label="Fleet and driver overview">
      <div className="owner-pulse-head"><div><p className="owner-kicker">People and vehicles</p><h2>On duty now.</h2></div><Badge tone="ready">11 ready</Badge></div>
      <div className="owner-pulse-grid">
        <div className="owner-mini-fleet"><span className="owner-mini-label">Fleet classes</span>{fleetRoster.map((vehicle) => <button key={vehicle.name} onClick={() => navigate("network")}><Image src={vehicle.image} width={341} height={341} alt={`${vehicle.name} fleet thumbnail`} /><div><small>{vehicle.note}</small><strong>{vehicle.name}</strong><span>{vehicle.count}</span></div><b>↗</b></button>)}</div>
        <div className="owner-mini-drivers"><span className="owner-mini-label">Chauffeurs on duty</span>{driverRoster.map((driver) => <button key={driver.name} onClick={() => navigate("operations")}><span className="owner-driver-avatar"><Image src={driver.image} width={512} height={512} alt={`${driver.name} chauffeur portrait`} /><i /></span><div><strong>{driver.name}</strong><small>{driver.assignment} · {driver.status}</small></div><b>↗</b></button>)}</div>
      </div>
    </section>

    <section className="owner-command-grid">
      <article className="owner-exception">
        <div className="owner-card-head"><div><p className="owner-kicker">Decision required</p><h2>18:10 DCA departure needs SUV coverage.</h2></div><Badge tone="alert">4 min left</Badge></div>
        <div className="owner-exception-route"><span>AT-1058</span><strong>Georgetown → DCA</strong><p>Priya Shah · 2 passengers · Premium SUV</p></div>
        <div className="owner-cascade"><span className="is-declined">Monument</span><span className="is-waiting">Potomac</span><span>District</span><span>Capital</span></div>
        <div className="owner-actions"><button className="owner-button owner-button--dark" onClick={() => navigate("operations")}>Open dispatch</button><button className="owner-button owner-button--line" onClick={() => navigate("network")}>Check capacity</button></div>
      </article>

      <article className="owner-capacity">
        <div className="owner-card-head"><div><p className="owner-kicker">Today’s supply</p><h2>Coverage by service cell</h2></div><Badge>Healthy</Badge></div>
        <CoverageBars />
        <dl><div><dt>Sedans</dt><dd>14 available</dd></div><div><dt>SUVs</dt><dd>12 available</dd></div><div><dt>Sprinters</dt><dd>3 by request</dd></div></dl>
      </article>
    </section>

    <section className="owner-live-preview">
      <SectionTitle eyebrow="Live operations" title="Six movements in view." action={<button className="owner-text-button" onClick={() => navigate("operations")}>Open command board ↗</button>} />
      <div className="owner-rides-table owner-rides-table--preview">
        {rides.slice(0, 4).map((ride) => <button key={ride.id} onClick={() => navigate("operations")}><span>{ride.time}</span><div><strong>{ride.route}</strong><small>{ride.id} · {ride.rider}</small></div><span>{ride.vehicle}</span><span>{ride.partner}</span><Badge tone={ride.tone}>{ride.status}</Badge><b>↗</b></button>)}
      </div>
    </section>

    <section className="owner-bottom-grid">
      <article><SectionTitle eyebrow="Account growth" title="7 active corporate accounts" /><div className="owner-growth-number"><strong>61</strong><span>Paid rides this month<br /><b>+24%</b> vs. June</span></div><button className="owner-text-button" onClick={() => navigate("accounts")}>View account health ↗</button></article>
      <article><SectionTitle eyebrow="Compliance" title="Two items need review" /><div className="owner-compliance-brief"><div><span>COI</span><p><strong>Capital Transport</strong><small>Expires in 12 days</small></p></div><div><span>IAD</span><p><strong>District Chauffeur</strong><small>Credential renewal pending</small></p></div></div><button className="owner-text-button" onClick={() => navigate("compliance")}>Open compliance center ↗</button></article>
    </section>
  </div>;
}

function Operations() {
  const [filter, setFilter] = useState<RideFilter>("all");
  const [selected, setSelected] = useState(rides[4]);
  const [notice, setNotice] = useState("");
  const visible = rides.filter((ride) => filter === "all" || (filter === "attention" ? ["alert", "watch"].includes(ride.tone) : ride.type === "airport"));
  function assignBackup() {
    setSelected({ ...selected, partner: "Potomac", driver: "Lena R.", driverImage: "/images/owner/icons/driver-lena.jpg", status: "Partner notified", tone: "watch" });
    setNotice("Backup offer sent to Potomac Mobility. Escalation timer restarted at 4 minutes.");
  }
  return <div className="owner-view">
    <div className="owner-page-head"><div><p className="owner-kicker">Live operations</p><h1>Command every movement.</h1><p>Monday, July 20 · Washington, DCA, IAD and BWI</p></div><div className="owner-live-indicator"><i />Live desk</div></div>
    <div className="owner-filter-row"><div role="tablist" aria-label="Ride filters"><button role="tab" aria-selected={filter === "all"} onClick={() => setFilter("all")}>All 6</button><button role="tab" aria-selected={filter === "attention"} onClick={() => setFilter("attention")}>Needs attention 2</button><button role="tab" aria-selected={filter === "airport"} onClick={() => setFilter("airport")}>Airport 4</button></div><button className="owner-button owner-button--dark">New assignment</button></div>
    <div className="owner-ops-layout">
      <section className="owner-ops-list">
        <div className="owner-table-labels"><span>Time</span><span>Movement</span><span>Class</span><span>Partner</span><span>Status</span></div>
        {visible.map((ride) => <button key={ride.id} className={selected.id === ride.id ? "is-selected" : ""} onClick={() => { setSelected(ride); setNotice(""); }}><span className="owner-time">{ride.time}</span><div><strong>{ride.route}</strong><small>{ride.id} · {ride.rider}</small></div><span>{ride.vehicle}</span><span>{ride.partner}</span><Badge tone={ride.tone}>{ride.status}</Badge></button>)}
      </section>
      <aside className="owner-dispatch-panel">
        <div className="owner-card-head"><div><p className="owner-kicker">Selected assignment</p><h2>{selected.id}</h2></div><Badge tone={selected.tone}>{selected.status}</Badge></div>
        <div className="owner-route-detail"><span>Pickup · {selected.time}</span><strong>{selected.route.split(" → ")[0]}</strong><i /><span>Destination</span><strong>{selected.route.split(" → ")[1] ?? "Multi-stop itinerary"}</strong></div>
        <div className="owner-selected-driver">
          {selected.driverImage ? <Image src={selected.driverImage} width={512} height={512} alt={`${selected.driver} chauffeur portrait`} /> : <span>—</span>}
          <div><small>Assigned chauffeur</small><strong>{selected.driver}</strong><em>{selected.driverImage ? "Identity and documents verified" : "Pending partner acceptance"}</em></div>
        </div>
        <dl className="owner-detail-list"><div><dt>Rider</dt><dd>{selected.rider}</dd></div><div><dt>Vehicle</dt><dd>{selected.vehicle}</dd></div><div><dt>Assigned partner</dt><dd>{selected.partner}</dd></div><div><dt>Desk owner</dt><dd>Maya C.</dd></div></dl>
        {notice && <p className="owner-notice" role="status">{notice}</p>}
        <div className="owner-actions"><button className="owner-button owner-button--dark" onClick={assignBackup}>Assign backup</button><button className="owner-button owner-button--line">Open ride record</button></div>
        <p className="owner-panel-note">Partner cascade: Monument → Potomac → District → Capital. Manual approval remains required during the pilot.</p>
      </aside>
    </div>
  </div>;
}

function Network() {
  return <div className="owner-view">
    <div className="owner-page-head"><div><p className="owner-kicker">Partner network</p><h1>Capacity before promises.</h1><p>Four active operators · 26 chauffeurs · 24 vehicles</p></div><button className="owner-button owner-button--dark">Invite operator</button></div>
    <section className="owner-network-summary"><Metric index="01" label="Core coverage" value="100%" note="DC + three airports" /><Metric index="02" label="Available now" value="19" note="Vehicles across network" /><Metric index="03" label="Network quality" value="96.3" note="Weighted partner score" /></section>
    <section className="owner-fleet-showcase">
      <div className="owner-fleet-heading"><p className="owner-kicker owner-kicker--light">Vehicle classes</p><h2>Black fleet.<br />Verified standards.</h2><p>Specific models remain subject to partner availability and written confirmation.</p></div>
      <figure>
        <Image src="/images/chauffeurs/fahad-hamid-fleet.webp" width={1536} height={1024} alt="Fahad Hamid beside Altaie illustrative black sedan and SUV service classes" />
        <figcaption><div><span>Core SUV</span><strong>Cadillac Escalade ESV</strong></div><dl><div><dt>Network</dt><dd>8 vetted</dd></div><div><dt>Use</dt><dd>Airport · events</dd></div></dl></figcaption>
      </figure>
      <figure>
        <Image src="/images/owner/maybach-arrival.jpg" width={1536} height={1024} alt="Black Maybach-class flagship sedan with a professional chauffeur at a limestone-column arrival" />
        <figcaption><div><span>Flagship sedan</span><strong>Mercedes-Maybach S-Class</strong></div><dl><div><dt>Network</dt><dd>2 by request</dd></div><div><dt>Use</dt><dd>VIP itineraries</dd></div></dl></figcaption>
      </figure>
    </section>
    <section className="owner-network-card"><SectionTitle eyebrow="Operating partners" title="Qualified supply, ranked by performance." /><div className="owner-partner-table"><div className="owner-table-labels"><span>Partner</span><span>Coverage</span><span>Capacity</span><span>On time</span><span>Score</span><span>Status</span></div>{partners.map((partner) => <button key={partner.code}><div className="owner-partner-name"><span>{partner.code}</span><strong>{partner.name}</strong></div><span>{partner.zones}</span><span>{partner.sedans} S · {partner.suvs} SUV · {partner.sprinters} SP</span><strong>{partner.onTime}</strong><strong>{partner.score}</strong><Badge tone={partner.status === "Preferred" ? "dark" : "stone"}>{partner.status}</Badge></button>)}</div></section>
    <div className="owner-network-bottom"><section><SectionTitle eyebrow="Service-cell readiness" title="Today’s usable capacity" /><CoverageBars /></section><section><SectionTitle eyebrow="Redundancy rules" title="Minimum launch standard" /><ul className="owner-rule-list"><li><span>01</span>Primary and backup coverage per airport</li><li><span>02</span>Two qualified partners per core class</li><li><span>03</span>Four-minute response before cascade</li><li><span>04</span>Manual desk approval for exceptions</li></ul></section></div>
  </div>;
}

function Accounts() {
  const [mode, setMode] = useState<"active" | "pipeline">("active");
  return <div className="owner-view">
    <div className="owner-page-head"><div><p className="owner-kicker">Corporate accounts</p><h1>Build recurring demand.</h1><p>Founding-account pilot · 61 paid rides this month</p></div><button className="owner-button owner-button--dark">Add account</button></div>
    <section className="owner-account-kpis"><Metric index="01" label="Active accounts" value="7" note="5 recurring" /><Metric index="02" label="Monthly retention" value="94%" note="Pilot cohort" /><Metric index="03" label="Average ride value" value="$243" note="Up $18 from June" /><Metric index="04" label="Pipeline value" value="$42K" note="Estimated monthly GMV" /></section>
    <div className="owner-filter-row"><div role="tablist" aria-label="Account filters"><button role="tab" aria-selected={mode === "active"} onClick={() => setMode("active")}>Active accounts</button><button role="tab" aria-selected={mode === "pipeline"} onClick={() => setMode("pipeline")}>Pipeline</button></div></div>
    {mode === "active" ? <section className="owner-accounts-table"><div className="owner-table-labels"><span>Account</span><span>Month to date</span><span>Rides</span><span>Growth</span><span>Status</span></div>{accounts.map((account) => <button key={account.name}><div><strong>{account.name}</strong><small>{account.sector}</small></div><strong>{account.value}</strong><span>{account.rides}</span><span className="owner-positive">{account.growth}</span><Badge>{account.status}</Badge></button>)}</section> : <section className="owner-pipeline"><div><span>Proposal</span><strong>Westbridge Public Affairs</strong><p>Est. $9.8K monthly · decision Jul 24</p><Badge tone="watch">Follow up</Badge></div><div><span>Discovery</span><strong>Atlantic Trade Council</strong><p>Est. $6.4K monthly · 22 travelers</p><Badge>Meeting set</Badge></div><div><span>Qualified</span><strong>Helix Legal Group</strong><p>Est. $12.2K monthly · airport-heavy</p><Badge>Pricing review</Badge></div></section>}
  </div>;
}

function Financials() {
  const [range, setRange] = useState("MTD");
  const bars = [38, 44, 41, 58, 53, 67, 72, 65, 78, 84, 88, 94];
  return <div className="owner-view">
    <div className="owner-page-head"><div><p className="owner-kicker">Financials</p><h1>Margin, not vanity volume.</h1><p>All figures shown before tax · pilot management view</p></div><div className="owner-range" aria-label="Financial period">{["7D", "MTD", "QTD"].map((item) => <button key={item} aria-pressed={range === item} onClick={() => setRange(item)}>{item}</button>)}</div></div>
    <section className="owner-financial-grid"><Metric index="01" label="Gross ride value" value={range === "7D" ? "$18.2K" : range === "QTD" ? "$164.8K" : "$62.7K"} note="Confirmed + completed" dark /><Metric index="02" label="Partner payouts" value={range === "7D" ? "$11.9K" : range === "QTD" ? "$111.4K" : "$42.1K"} note="67.1% of GMV" /><Metric index="03" label="Contribution profit" value={range === "7D" ? "$5.7K" : range === "QTD" ? "$48.9K" : "$19.7K"} note="After payment fees" /><Metric index="04" label="Contribution margin" value="31.4%" note="Target ≥ 30%" /></section>
    <section className="owner-chart-card"><div className="owner-card-head"><div><p className="owner-kicker">Gross ride value</p><h2>Demand is compounding.</h2></div><strong>$62,740</strong></div><div className="owner-chart" aria-label="Twelve-week gross ride value trend">{bars.map((height, index) => <div key={index}><i style={{ height: `${height}%` }} /><span>{index % 2 === 0 ? `W${index + 1}` : ""}</span></div>)}</div></section>
    <section className="owner-finance-bottom"><article><SectionTitle eyebrow="Unit economics" title="Per completed ride" /><dl className="owner-economics"><div><dt>Average customer price</dt><dd>$243.00</dd></div><div><dt>Partner payout</dt><dd>−$162.80</dd></div><div><dt>Payment and service costs</dt><dd>−$3.90</dd></div><div><dt>Contribution profit</dt><dd>$76.30</dd></div><div><dt>Margin</dt><dd>31.4%</dd></div></dl></article><article><SectionTitle eyebrow="Receivables" title="Corporate billing" /><div className="owner-ar"><strong>$12,480</strong><p>Open invoices</p><span>82% current</span><span>14% 1–15 days</span><span>4% 16–30 days</span></div></article></section>
  </div>;
}

function Compliance() {
  return <div className="owner-view">
    <div className="owner-page-head"><div><p className="owner-kicker">Compliance center</p><h1>Nothing expires quietly.</h1><p>Operator, vehicle, chauffeur and airport records</p></div><button className="owner-button owner-button--dark">Upload document</button></div>
    <section className="owner-compliance-score"><div><span>Network readiness</span><strong>92%</strong><p>47 of 51 required records are current.</p></div><div className="owner-score-ring"><span>92</span></div></section>
    <section className="owner-compliance-grid"><article><SectionTitle eyebrow="Action required" title="Two deadlines approaching" /><div className="owner-compliance-items"><button><span className="owner-doc-icon">COI</span><div><strong>Capital Transport insurance</strong><small>Expires Aug 1 · 12 days</small></div><Badge tone="alert">Urgent</Badge><b>↗</b></button><button><span className="owner-doc-icon">IAD</span><div><strong>District Chauffeur airport credential</strong><small>Renewal pending · 21 days</small></div><Badge tone="watch">Pending</Badge><b>↗</b></button></div></article><article><SectionTitle eyebrow="Coverage" title="Required records" /><div className="owner-document-bars"><div><span>Commercial insurance</span><i><b style={{ width: "100%" }} /></i><strong>4/4</strong></div><div><span>Operating authority</span><i><b style={{ width: "100%" }} /></i><strong>4/4</strong></div><div><span>Chauffeur screening</span><i><b style={{ width: "92%" }} /></i><strong>24/26</strong></div><div><span>Vehicle inspections</span><i><b style={{ width: "96%" }} /></i><strong>23/24</strong></div><div><span>Airport access</span><i><b style={{ width: "88%" }} /></i><strong>14/16</strong></div></div></article></section>
    <section className="owner-checkpoints"><SectionTitle eyebrow="Launch checkpoints" title="Authority and operational readiness" /><div><article><span>01</span><strong>DC licensing</strong><p>Professional review of DLCP and DFHV operating model.</p><Badge tone="ready">Reviewed</Badge></article><article><span>02</span><strong>WMATC authority</strong><p>Interstate DMV transportation checkpoint by partner.</p><Badge tone="ready">Verified</Badge></article><article><span>03</span><strong>Airport credentials</strong><p>DCA, IAD and BWI permissions tracked per operator.</p><Badge tone="watch">1 pending</Badge></article><article><span>04</span><strong>Test rides</strong><p>Operational scenarios completed before public launch.</p><Badge>7 of 10</Badge></article></div></section>
  </div>;
}

export function OwnerDashboard() {
  const [view, setView] = useState<View>("overview");
  function navigate(next: View) {
    setView(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return <div className="owner-root">
    <aside className="owner-sidebar">
      <div className="owner-logo"><AltaieMark /><div><strong>Altaie</strong><span>Owner command</span></div></div>
      <nav aria-label="Owner dashboard navigation">{navigation.map((item) => <button key={item.id} className={view === item.id ? "is-active" : ""} aria-current={view === item.id ? "page" : undefined} onClick={() => navigate(item.id)}><span>{item.cue}</span>{item.label}</button>)}</nav>
      <div className="owner-sidebar-foot"><div className="owner-profile">FA</div><p><strong>Fahad</strong><span>Founder · Owner</span></p><button aria-label="Open owner settings">···</button></div>
    </aside>
    <div className="owner-main">
      <header className="owner-topbar"><div><span className="owner-mobile-mark"><AltaieMark /></span><p>Washington operations</p><Badge tone="ready">Private pilot</Badge></div><div><button className="owner-alert" aria-label="Two operational notifications">2</button><button className="owner-profile owner-profile--top" aria-label="Owner profile">FA</button></div></header>
      <main className="owner-content">
        {view === "overview" && <Overview navigate={navigate} />}
        {view === "operations" && <Operations />}
        {view === "network" && <Network />}
        {view === "accounts" && <Accounts />}
        {view === "financials" && <Financials />}
        {view === "compliance" && <Compliance />}
      </main>
      <footer className="owner-product-note">Owner-dashboard concept · Sample pilot data · Reservations, dispatch, payments and driver workflows connect through Moovs in production.</footer>
    </div>
    <nav className="owner-mobile-nav" aria-label="Mobile owner navigation">{navigation.map((item) => <button key={item.id} className={view === item.id ? "is-active" : ""} onClick={() => navigate(item.id)}><span>{item.cue}</span>{item.label.replace("Corporate ", "").replace("Partner ", "").replace("Live ", "")}</button>)}</nav>
  </div>;
}
