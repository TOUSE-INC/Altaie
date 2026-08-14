import Link from "next/link";
import Image from "next/image";
import { CTA, NumberedList } from "./components/Content";
import { articles } from "./journal/articles";
import { absoluteUrl, organizationId, SITE_URL } from "@/lib/site";

const services = [
  { index: "01", title: "Airport arrivals", body: "Flight-aware coordination for DCA, IAD, and BWI, including a documented 60-minute arrival grace period.", href: "/airports" },
  { index: "02", title: "Hourly assignments", body: "One chauffeur, one vehicle, and one accountable desk across a day of meetings, changes, and waits.", href: "/services#hourly" },
  { index: "03", title: "Corporate movement", body: "Assistant-friendly requests, centralized preferences, and consistent confirmations for recurring travelers.", href: "/corporate" },
];

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": organizationId,
    name: "Altaie",
    url: SITE_URL,
    logo: absoluteUrl("/brand/altaie-mark.svg"),
    image: absoluteUrl("/images/chauffeurs/fahad-hamid-arrival.webp"),
    areaServed: ["Washington, DC", "DCA", "IAD", "BWI"],
    description: "A Washington, DC executive mobility desk for advance-reserved chauffeur coordination.",
    serviceType: ["Airport transfer", "Hourly chauffeur service", "Corporate transportation", "Event transportation"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      <section className="home-hero">
        <div className="home-hero__image" role="img" aria-label="Executive arrival in Washington, DC" />
        <div className="home-hero__shade" />
        <div className="home-hero__content">
          <p className="eyebrow eyebrow--light">Washington&apos;s executive mobility desk</p>
          <h1>Washington,<br /><em>handled.</em></h1>
          <p>Discreet chauffeur coordination for the people who manage demanding schedules—and the principals who depend on them.</p>
          <div className="hero-actions">
            <Link className="button button--brass" href="/book">Request a ride</Link>
            <Link className="button button--ghost" href="/corporate">Open a corporate account</Link>
          </div>
        </div>
        <div className="hero-proof" aria-label="Service highlights">
          <span>Advance requests</span><span>DCA · IAD · BWI</span><span>Desk confirmation</span>
        </div>
      </section>

      <section className="statement-section page-shell">
        <p className="eyebrow">A better operating model</p>
        <div className="statement-grid">
          <h2>Not another black-car directory. One accountable Washington desk.</h2>
          <div><p>Global platforms optimize for reach. Altaie combines a clear service request with local follow-through: the desk reviews operating coverage, confirms the assignment in writing, and coordinates the movement.</p><Link className="text-link" href="/standards">See the Altaie standard <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>

      <section className="services-section">
        <div className="page-shell">
          <div className="section-heading"><div><p className="eyebrow">Core assignments</p><h2>Built around the workday.</h2></div><p>From a single airport arrival to a full day of principal movement, each request begins with the itinerary and a desk review of real coverage.</p></div>
          <div className="service-cards">
            {services.map((service) => <Link key={service.index} className="service-card" href={service.href}><span>{service.index}</span><h3>{service.title}</h3><p>{service.body}</p><b aria-hidden="true">↗</b></Link>)}
          </div>
        </div>
      </section>

      <section className="split-feature page-shell">
        <div className="split-feature__image image-assistant" role="img" aria-label="Executive assistant coordinating a travel itinerary" />
        <div className="split-feature__content">
          <p className="eyebrow">Designed for assistants</p>
          <h2>The request is only the beginning.</h2>
          <p>The person coordinating the day needs clean confirmations, quick answers, and confidence that changes will be absorbed without drama.</p>
          <NumberedList items={[
            { title: "Review", body: "We check the route, timing, luggage, passenger preferences, and service class before confirmation." },
            { title: "Brief", body: "The operating partner receives one clear assignment brief, including stops and arrival instructions." },
            { title: "Coordinate", body: "Ride-day changes route through one accountable desk instead of a chain of unfamiliar contacts." },
          ]} />
        </div>
      </section>

      <section className="airport-strip">
        <div className="page-shell airport-strip__inner">
          <div><p className="eyebrow eyebrow--light">Three airports. One standard.</p><h2>DCA <span>·</span> IAD <span>·</span> BWI</h2></div>
          <p>Flight tracking, clear meet instructions, and a 60-minute grace period for airport arrivals.</p>
          <Link className="button button--ivory" href="/airports">Airport details</Link>
        </div>
      </section>

      <section className="metrics page-shell" aria-label="Pilot targets">
        <div><strong>15 min</strong><span>Early chauffeur arrival target</span></div>
        <div><strong>30%</strong><span>Target contribution margin</span></div>
        <div><strong>95%+</strong><span>Pilot on-time target</span></div>
        <div><strong>1 desk</strong><span>For request through completion</span></div>
      </section>

      <section className="home-notes">
        <div className="page-shell">
          <div className="section-heading">
            <div><p className="eyebrow">Field Notes by Fahad Hamid</p><h2>Know the movement before the door closes.</h2></div>
            <div><p>Specific operating guidance for airport decisions, private aviation handoffs, and multi-stop Washington days.</p><Link className="text-link" href="/journal">Read all Field Notes <span aria-hidden="true">↗</span></Link></div>
          </div>
          <div className="home-notes__grid">
            <Link className="home-notes__image" href={`/journal/${articles[0].slug}`} aria-label={`Read ${articles[0].title}`}>
              <Image src={articles[0].image} alt={articles[0].imageAlt} width={articles[0].imageWidth} height={articles[0].imageHeight} sizes="(max-width: 760px) calc(100vw - 36px), 44vw" />
            </Link>
            <div className="home-notes__list">
              {articles.map((article, index) => (
                <article key={article.slug}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><p className="eyebrow">{article.category}</p><h3><Link href={`/journal/${article.slug}`}>{article.title}</Link></h3><p>{article.description}</p></div>
                  <Link aria-label={`Read ${article.title}`} href={`/journal/${article.slug}`}>↗</Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
