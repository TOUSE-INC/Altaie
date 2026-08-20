"use client";

import { useState } from "react";
import styles from "./AdvancedMobileOwner.module.css";

type Tab = "overview" | "dispatch" | "network" | "money";
type Coverage = { name: string; value: number; tone: "live" | "electric" | "champagne" };

const coverage: Coverage[] = [
  { name: "DCA", value: 92, tone: "live" },
  { name: "IAD", value: 84, tone: "electric" },
];

const movements = [
  { id: "AT-1054", time: "6:45 PM", route: "Chevy Chase → DCA", account: "World Bank Group", status: "Confirmed", tone: "ready" },
  { id: "AT-1055", time: "7:00 PM", route: "The Ritz-Carlton → Capitol Hill", account: "Goldman Sachs", status: "En route", tone: "live" },
  { id: "AT-1058", time: "7:15 PM", route: "IAD → JW Marriott", account: "Private", status: "Needs coverage", tone: "alert" },
  { id: "AT-1059", time: "8:00 PM", route: "National Gallery → Embassy Row", account: "McKinsey & Co.", status: "Confirmed", tone: "ready" },
];

function Dot({ tone = "live" }: { tone?: "live" | "alert" | "ready" }) {
  return <i className={`${styles.dot} ${styles[`dot_${tone}`]}`} />;
}

function NavTab({ active, icon, label, onClick }: { active: boolean; icon: string; label: string; onClick: () => void }) {
  return <button className={`${styles.navTab} ${active ? styles.navTabActive : ""}`} onClick={onClick}><span>{icon}</span><small>{label}</small></button>;
}

function Pulse() {
  return <div className={styles.pulse}><span className={styles.pulseLive}><Dot />12 live</span><span className={styles.pulseAlert}>1 decision</span><span className={styles.pulseReady}>96.8% ready</span></div>;
}

function Overview({ openDispatch }: { openDispatch: () => void }) {
  const [assigned, setAssigned] = useState(false);
  return <div className={styles.screen}>
    <p className={styles.brand}>ALTAIE COMMAND</p>
    <h1>Good evening, Fahad.</h1>
    <Pulse />

    <section className={`${styles.decisionCard} ${assigned ? styles.decisionResolved : ""}`}>
      <div className={styles.decisionTop}><span>{assigned ? "COVERAGE SECURED" : "DECISION REQUIRED"}</span><strong>{assigned ? "00:00" : "03:42"}</strong></div>
      <h2>{assigned ? "Potomac accepted the DCA movement." : "DCA departure needs SUV coverage."}</h2>
      <p>18:10 · Georgetown → DCA · Priya Shah</p>
      <div className={styles.partnerCascade}><button>Monument</button><button className={styles.partnerActive} onClick={() => setAssigned(true)}>Potomac</button><button>District</button></div>
      <button className={styles.dispatchCta} onClick={openDispatch}>{assigned ? "Open assignment" : "Open dispatch"}<span>→</span></button>
    </section>

    <div className={styles.kpiGrid}>
      <article><span>Today GMV</span><b className={styles.champagne}>$12.8K</b><small>+18.7%</small></article>
      <article><span>On time</span><b className={styles.live}>98.6%</b><small>30 days</small></article>
      <article><span>Margin</span><b className={styles.electric}>31.4%</b><small>MTD</small></article>
    </div>

    <section className={styles.coverageCard}>
      <div><h3>Network coverage</h3><p>18 vehicles ready now</p></div>
      {coverage.map((cell) => <div className={styles.coverageRow} key={cell.name}><span>{cell.name}</span><i><b className={styles[`bar_${cell.tone}`]} style={{width:`${cell.value}%`}} /></i><strong>{cell.value}%</strong></div>)}
    </section>

    <div className={styles.miniGrid}><article><span>Compliance</span><b className={styles.alert}>2</b><small>due soon</small></article><article><span>Accounts</span><b className={styles.champagne}>7</b><small>active</small></article></div>
  </div>;
}

function Dispatch() {
  const [selected, setSelected] = useState(movements[2]);
  return <div className={styles.screen}>
    <div className={styles.pageHead}><div><span>LIVE DISPATCH</span><h1>Command every movement.</h1></div><span className={styles.liveDesk}><Dot />Live desk</span></div>
    <div className={styles.dispatchMap}><div className={styles.mapGrid} /><span className={styles.mapLabel}>WASHINGTON</span><span className={styles.mapNode1}>12</span><span className={styles.mapNode2}>4</span><span className={styles.mapNode3}>9</span><span className={styles.mapCar}>SUV</span></div>
    <div className={styles.movementList}>{movements.map((move) => <button key={move.id} className={`${styles.movementCard} ${selected.id === move.id ? styles.movementSelected : ""}`} onClick={() => setSelected(move)}>
      <div><span>{move.time}</span><small>{move.id}</small></div><div><b>{move.route}</b><small>{move.account}</small></div><span className={`${styles.statusBadge} ${styles[`status_${move.tone}`]}`}>{move.status}</span>
    </button>)}</div>
    <section className={styles.selectedAssignment}><div><span>SELECTED ASSIGNMENT</span><b>{selected.id}</b></div><h2>{selected.route}</h2><p>{selected.account} · Premium SUV</p><button>{selected.tone === "alert" ? "Cascade to backup →" : "View movement →"}</button></section>
  </div>;
}

function Network() {
  return <div className={styles.screen}>
    <div className={styles.pageHead}><div><span>PARTNER NETWORK</span><h1>Supply you can trust.</h1></div><span className={styles.healthPill}>98% health</span></div>
    <section className={styles.coverageHero}><strong>18</strong><span>vehicles ready now</span><small>DC core · DCA · IAD</small></section>
    <section className={styles.coverageCard}>{coverage.map((cell) => <div className={styles.networkCell} key={cell.name}><div><b>{cell.name}</b><span>{cell.value}% ready</span></div><i><b className={styles[`bar_${cell.tone}`]} style={{width:`${cell.value}%`}} /></i><small>{cell.name === "DCA" ? "7 vehicles" : cell.name === "IAD" ? "6 vehicles" : "5 vehicles"}</small></div>)}</section>
    <div className={styles.partnerList}>{[["Monument Executive","Preferred","99.1%"],["Potomac Mobility","Active","97.5%"],["District Chauffeur","Active","96.8%"],["Capital Transport","Backup","95.4%"]].map(([name,status,onTime]) => <article key={name}><span className={styles.partnerCode}>{name.split(" ").map(v=>v[0]).join("")}</span><div><b>{name}</b><small>{status} · {onTime} on time</small></div><span>›</span></article>)}</div>
  </div>;
}

function Money() {
  return <div className={styles.screen}>
    <div className={styles.pageHead}><div><span>FINANCIALS</span><h1>Margin, not vanity volume.</h1></div><span className={styles.healthPill}>MTD</span></div>
    <section className={styles.moneyHero}><span>Gross ride value</span><strong>$62,740</strong><small>Confirmed + completed</small><div className={styles.sparkline}>{[38,44,41,58,53,67,72,65,78,84,88,94].map((h,i)=><i key={i} style={{height:`${h}%`}} />)}</div></section>
    <div className={styles.moneyGrid}><article><span>Partner payouts</span><b>$42.1K</b><small>67.1% of GMV</small></article><article><span>Contribution profit</span><b>$19.7K</b><small>After service costs</small></article><article><span>Margin</span><b className={styles.live}>31.4%</b><small>Target ≥ 30%</small></article><article><span>Receivables</span><b>$12.5K</b><small>82% current</small></article></div>
    <section className={styles.economics}><span>PER COMPLETED RIDE</span>{[["Customer price","$243.00"],["Partner payout","−$162.80"],["Service costs","−$3.90"],["Contribution profit","$76.30"]].map(([k,v]) => <div key={k}><span>{k}</span><b>{v}</b></div>)}</section>
  </div>;
}

export function AdvancedMobileOwner() {
  const [tab, setTab] = useState<Tab>("overview");
  return <div className={`${styles.root} altaie-owner-mobile-app`}>
    <main className={styles.viewport}>{tab === "overview" && <Overview openDispatch={() => setTab("dispatch")} />}{tab === "dispatch" && <Dispatch />}{tab === "network" && <Network />}{tab === "money" && <Money />}</main>
    <nav className={styles.floatingNav} aria-label="Owner command navigation">
      <NavTab active={tab === "overview"} icon="⌂" label="Overview" onClick={() => setTab("overview")} />
      <NavTab active={tab === "dispatch"} icon="↗" label="Dispatch" onClick={() => setTab("dispatch")} />
      <NavTab active={tab === "network"} icon="◇" label="Network" onClick={() => setTab("network")} />
      <NavTab active={tab === "money"} icon="$" label="Money" onClick={() => setTab("money")} />
    </nav>
  </div>;
}
