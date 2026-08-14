"use client";

import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CalendarBlank,
  ChatCircle,
  CheckCircle,
  Circle,
  Clock,
  List,
  MapPin,
  Phone,
  AirplaneTilt,
  SteeringWheel,
  Users,
  X,
} from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DirectBooking } from "./DirectBooking";
import { TripMap } from "./TripMap";
import {
  advanceTripStage,
  getTripSnapshot,
  TRIP_STAGES,
} from "./trip-simulator.mjs";

type ExperienceView = "itinerary" | "live" | "request";

const fleet = [
  {
    name: "Executive Sedan",
    note: "Up to 3 passengers",
    image: "/brand/principal-movement.png",
    width: 1812,
    height: 868,
  },
  {
    name: "Cadillac Escalade ESV",
    note: "Up to 6 passengers",
    image: "/images/chauffeurs/fahad-hamid-airport.webp",
    width: 1536,
    height: 1024,
  },
  {
    name: "Mercedes-Maybach S-Class",
    note: "Up to 2 passengers",
    image: "/images/owner/maybach-arrival.jpg",
    width: 1920,
    height: 1280,
  },
];

function ExperienceHeader({
  menuOpen,
  onMenuToggle,
  onShowItinerary,
  onShowLive,
  onShowRequest,
}: {
  menuOpen: boolean;
  onMenuToggle: () => void;
  onShowItinerary: () => void;
  onShowLive: () => void;
  onShowRequest: () => void;
}) {
  return (
    <header className="trip-app-header">
      <Link className="trip-app-brand" href="/" aria-label="Altaie home">
        <span className="brand-mark" aria-hidden="true" />
        <span>Altaie</span>
      </Link>
      <button
        type="button"
        className="trip-icon-button"
        aria-expanded={menuOpen}
        aria-controls="trip-app-menu"
        aria-label={menuOpen ? "Close trip menu" : "Open trip menu"}
        onClick={onMenuToggle}
      >
        {menuOpen ? <X size={25} weight="regular" /> : <List size={28} weight="regular" />}
      </button>
      <nav id="trip-app-menu" className="trip-app-menu" hidden={!menuOpen} aria-label="Trip experience">
        <button type="button" onClick={onShowItinerary}>Demo itinerary</button>
        <button type="button" onClick={onShowLive}>View live trip</button>
        <a href="#fleet-availability">Fleet availability</a>
        <button type="button" onClick={onShowRequest}>Request a ride</button>
      </nav>
    </header>
  );
}

function TripTimeline({ stageIndex, onStageChange }: { stageIndex: number; onStageChange: (index: number) => void }) {
  return (
    <ol className="trip-timeline" aria-label="Demo trip progress">
      {TRIP_STAGES.map((stage, index) => {
        const isComplete = index < stageIndex;
        const isCurrent = index === stageIndex;
        return (
          <li key={stage.id} className={isCurrent ? "is-current" : isComplete ? "is-complete" : ""}>
            <button
              type="button"
              aria-label={`Show ${stage.label} demo state`}
              aria-current={isCurrent ? "step" : undefined}
              onClick={() => onStageChange(index)}
            >
              {isComplete ? (
                <CheckCircle size={24} weight="fill" />
              ) : (
                <Circle size={24} weight={isCurrent ? "fill" : "regular"} />
              )}
              <span>{stage.label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function RouteMap({ stageIndex, live = false }: { stageIndex: number; live?: boolean }) {
  return (
    <section className={`trip-map ${live ? "trip-map--live" : ""}`} aria-label="Demo route map">
      <TripMap stageIndex={stageIndex} live={live} />
      <div className="trip-map__label trip-map__label--pickup">
        <MapPin size={16} weight="fill" />
        <span><strong>The Hay-Adams</strong><small>800 16th St NW</small></span>
      </div>
      <div className="trip-map__label trip-map__label--destination">
        <AirplaneTilt size={17} weight="fill" />
        <span><strong>DCA</strong><small>Reagan National Airport</small></span>
      </div>
      <p className="trip-map__disclosure">Simulated route map · illustrative data</p>
    </section>
  );
}

function ItineraryManifest() {
  return (
    <section className="trip-manifest" aria-labelledby="trip-manifest-title">
      <h2 id="trip-manifest-title" className="sr-only">Demo itinerary details</h2>
      <dl>
        <div><dt>Date</dt><dd>Fri, Aug 14, 2026</dd></div>
        <div><dt>Trip type</dt><dd>One-way</dd></div>
        <div className="trip-manifest__route">
          <dt>Route</dt>
          <dd><span>The Hay-Adams</span><ArrowRight size={19} /><span>DCA</span></dd>
        </div>
        <div><dt>Passengers</dt><dd>2</dd></div>
        <div><dt>Flight</dt><dd>AA 2147</dd></div>
      </dl>
    </section>
  );
}

function ChauffeurAssignment({ onDesk }: { onDesk: () => void }) {
  return (
    <section className="trip-assignment" aria-label="Demo chauffeur and vehicle assignment">
      <article className="trip-chauffeur">
        <p className="trip-label">Chauffeur</p>
        <div className="trip-chauffeur__identity">
          <Image
            src="/images/chauffeurs/fahad-hamid-portrait.webp"
            width={1024}
            height={1024}
            alt="Demo chauffeur Fahad Hamid"
          />
          <div>
            <h3>Fahad Hamid</h3>
            <p>Senior chauffeur<br />Since 2016</p>
          </div>
        </div>
        <div className="trip-chauffeur__contact">
          <button type="button" onClick={onDesk}><Phone size={19} />Demo contact</button>
          <span><ChatCircle size={19} />English</span>
        </div>
      </article>

      <article className="trip-vehicle">
        <div>
          <p className="trip-label">Vehicle</p>
          <h3>Cadillac Escalade ESV</h3>
          <dl>
            <div><dt>Fleet</dt><dd>A-014</dd></div>
            <div><dt>Color</dt><dd>Black</dd></div>
            <div><dt>Plate</dt><dd>Demo 4827</dd></div>
          </dl>
        </div>
        <Image
          src="/images/trip/escalade-esv-studio.webp"
          width={1774}
          height={887}
          alt="Black Cadillac Escalade ESV illustrative demo vehicle"
        />
      </article>
    </section>
  );
}

function FleetAvailability({ onRequest }: { onRequest: () => void }) {
  return (
    <section id="fleet-availability" className="trip-fleet" aria-labelledby="fleet-title">
      <div className="trip-section-heading">
        <div>
          <p className="trip-label">Private beta · illustrative classes</p>
          <h2 id="fleet-title">Fleet availability.</h2>
        </div>
        <p>These vehicle classes are mock inventory for the product demonstration. The Altaie desk confirms the actual operator and vehicle before service.</p>
      </div>
      <div className="trip-fleet__grid">
        {fleet.map((vehicle) => (
          <article key={vehicle.name}>
            <Image
              src={vehicle.image}
              width={vehicle.width}
              height={vehicle.height}
              alt={`${vehicle.name} illustrative service class`}
            />
            <div><h3>{vehicle.name}</h3><p>{vehicle.note}</p></div>
          </article>
        ))}
      </div>
      <button type="button" className="trip-button trip-button--line" onClick={onRequest}>
        Request a ride <ArrowRight size={18} />
      </button>
    </section>
  );
}

function DeskPanel({ onClose }: { onClose: () => void }) {
  return (
    <aside className="trip-desk-panel" aria-labelledby="desk-panel-title">
      <button type="button" className="trip-icon-button" onClick={onClose} aria-label="Close desk panel"><X size={22} /></button>
      <p className="trip-label">Altaie coordination desk</p>
      <h2 id="desk-panel-title">A person owns the movement.</h2>
      <p>This is a product demonstration, so Fahad and the displayed number are mock data. For a real request, use the Altaie contact desk.</p>
      <Link href="/contact" className="trip-button trip-button--dark">Open contact desk <ArrowRight size={18} /></Link>
    </aside>
  );
}

function LiveTrip({
  stageIndex,
  elapsedSeconds,
  onAdvance,
  onBack,
  onDesk,
}: {
  stageIndex: number;
  elapsedSeconds: number;
  onAdvance: () => void;
  onBack: () => void;
  onDesk: () => void;
}) {
  const snapshot = useMemo(
    () => getTripSnapshot(stageIndex, elapsedSeconds),
    [stageIndex, elapsedSeconds],
  );

  return (
    <main className="trip-live" data-testid="live-trip-view">
      <button className="trip-back-button" type="button" onClick={onBack}><ArrowLeft size={18} />Itinerary</button>
      <div className="trip-live__headline">
        <div>
          <p className="trip-label">Simulated live data · Demo trip</p>
          <h1 aria-live="polite">{snapshot.headline}</h1>
        </div>
        <div className="trip-live__eta">
          <span>{snapshot.nextEvent} in</span>
          <strong>{snapshot.etaMinutes}</strong>
          <small>min.</small>
        </div>
      </div>
      <RouteMap stageIndex={stageIndex} live />
      <section className="trip-live__summary" aria-label="Simulated live trip summary">
        <div><Clock size={21} /><span><small>Estimated pickup</small><strong>10:20 AM</strong></span></div>
        <div><SteeringWheel size={21} /><span><small>Chauffeur</small><strong>Fahad Hamid</strong></span></div>
        <div><MapPin size={21} /><span><small>Current state</small><strong>{TRIP_STAGES[stageIndex].label}</strong></span></div>
      </section>
      <section className="trip-live__events" aria-labelledby="live-events-title">
        <div><p className="trip-label">Movement log</p><h2 id="live-events-title">Every handoff, visible.</h2></div>
        <ol>
          {TRIP_STAGES.map((stage, index) => (
            <li key={stage.id} className={index <= stageIndex ? "is-active" : ""}>
              {index <= stageIndex ? <CheckCircle size={21} weight="fill" /> : <Circle size={21} />}
              <span>{stage.label}</span>
              <small>{index < stageIndex ? "Recorded" : index === stageIndex ? "Current" : "Pending"}</small>
            </li>
          ))}
        </ol>
      </section>
      <div className="trip-actions">
        <button type="button" className="trip-button trip-button--dark" onClick={onAdvance}>
          Advance demo <ArrowRight size={18} />
        </button>
        <button type="button" className="trip-button trip-button--line" onClick={onDesk}>
          Message the desk <ChatCircle size={18} />
        </button>
      </div>
      <p className="trip-fine-print">The map, ETA, chauffeur, vehicle, and movement events on this screen are simulated product data—not a real reservation or live vehicle position.</p>
    </main>
  );
}

export function AltaieTripExperience() {
  const [view, setView] = useState<ExperienceView>("itinerary");
  const [stageIndex, setStageIndex] = useState(3);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deskOpen, setDeskOpen] = useState(false);

  useEffect(() => {
    if (view !== "live") return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => current + 60);
    }, 60_000);
    return () => window.clearInterval(timer);
  }, [view]);

  function show(nextView: ExperienceView) {
    setView(nextView);
    setMenuOpen(false);
    setDeskOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function advanceDemo() {
    setStageIndex((current) => advanceTripStage(current));
    setElapsedSeconds(0);
  }

  if (view === "request") {
    return (
      <div className="trip-request-view">
        <button type="button" className="trip-back-button trip-request-view__back" onClick={() => show("itinerary")}>
          <ArrowLeft size={18} />Demo itinerary
        </button>
        <DirectBooking />
      </div>
    );
  }

  return (
    <div className="trip-experience">
      <ExperienceHeader
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((current) => !current)}
        onShowItinerary={() => show("itinerary")}
        onShowLive={() => show("live")}
        onShowRequest={() => show("request")}
      />

      {view === "live" ? (
        <LiveTrip
          stageIndex={stageIndex}
          elapsedSeconds={elapsedSeconds}
          onAdvance={advanceDemo}
          onBack={() => show("itinerary")}
          onDesk={() => setDeskOpen(true)}
        />
      ) : (
        <main className="trip-itinerary" data-testid="itinerary-view">
          <div className="trip-disclosure" role="status">
            <span>Private beta · Demo itinerary</span>
            <strong><Circle size={10} weight="fill" />Simulated live data</strong>
          </div>

          <section className="trip-hero" aria-labelledby="trip-headline">
            <div>
              <p className="trip-label">Next milestone</p>
              <h1 id="trip-headline" aria-live="polite">
                {stageIndex === 3 ? (
                  <><span>Your chauffeur</span><span>is assigned.</span></>
                ) : getTripSnapshot(stageIndex).headline}
              </h1>
            </div>
            <div className="trip-hero__eta">
              <span>Pickup in</span>
              <strong>{getTripSnapshot(stageIndex).etaMinutes}</strong>
              <small>min.</small>
            </div>
          </section>

          <TripTimeline stageIndex={stageIndex} onStageChange={(index) => {
            setStageIndex(index);
            setElapsedSeconds(0);
          }} />

          <RouteMap stageIndex={stageIndex} />

          <div className="trip-route-meta">
            <span><Clock size={20} /><strong>Est. travel time</strong>25 min</span>
            <span><Briefcase size={20} /><strong>Pickup</strong>10:20 AM</span>
          </div>

          <ItineraryManifest />
          <ChauffeurAssignment onDesk={() => setDeskOpen(true)} />

          <div className="trip-actions trip-actions--stacked">
            <button type="button" className="trip-button trip-button--dark" onClick={() => show("live")}>
              View live trip <ArrowRight size={18} />
            </button>
            <button type="button" className="trip-button trip-button--line" onClick={() => setDeskOpen(true)}>
              Message the desk <ChatCircle size={18} />
            </button>
            <button type="button" className="trip-button trip-button--quiet" onClick={() => show("request")}>
              Request a ride <CalendarBlank size={18} />
            </button>
          </div>

          <div className="trip-trust-note">
            <Users size={22} />
            <p><strong>Demo only.</strong> No reservation was created, no chauffeur was dispatched, and no payment was collected.</p>
          </div>

          <FleetAvailability onRequest={() => show("request")} />
        </main>
      )}

      {deskOpen && <DeskPanel onClose={() => setDeskOpen(false)} />}
    </div>
  );
}
