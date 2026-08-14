import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { absoluteUrl, authorUrl, organizationId, SITE_URL } from "@/lib/site";
import { articles } from "../articles";

export const metadata: Metadata = {
  title: "Fahad Hamid — Field Notes author",
  description: "Meet Fahad Hamid, an Altaie chauffeur and Field Notes author covering Washington airport arrivals, private aviation handoffs, and multi-stop executive itineraries.",
  alternates: { canonical: authorUrl },
  openGraph: {
    type: "profile",
    title: "Fahad Hamid — Altaie Field Notes",
    description: "Washington executive-mobility field notes by Altaie chauffeur Fahad Hamid.",
    url: authorUrl,
    images: [{
      url: absoluteUrl("/images/chauffeurs/fahad-hamid-portrait.webp"),
      width: 1024,
      height: 1024,
      alt: "Portrait of Fahad Hamid",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fahad Hamid — Altaie Field Notes",
    description: "Washington executive-mobility guidance by Fahad Hamid.",
    images: [absoluteUrl("/images/chauffeurs/fahad-hamid-portrait.webp")],
  },
};

export default function FahadHamidProfilePage() {
  const profileSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${authorUrl}#profile`,
        url: authorUrl,
        dateCreated: "2026-08-14T09:00:00-04:00",
        dateModified: "2026-08-14T09:00:00-04:00",
        mainEntity: {
          "@type": "Person",
          "@id": `${authorUrl}#person`,
          name: "Fahad Hamid",
          url: authorUrl,
          image: absoluteUrl("/images/chauffeurs/fahad-hamid-portrait.webp"),
          jobTitle: "Executive chauffeur and Field Notes author",
          description: "Altaie chauffeur and author covering Washington airport arrivals, private aviation handoffs, and assistant-led executive itineraries.",
          worksFor: {
            "@type": "Organization",
            "@id": organizationId,
            name: "Altaie",
            url: SITE_URL,
          },
        },
        hasPart: articles.map((article) => ({
          "@type": "BlogPosting",
          headline: article.title,
          url: absoluteUrl(`/journal/${article.slug}`),
          datePublished: article.datePublished,
          author: { "@id": `${authorUrl}#person` },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Field Notes", item: absoluteUrl("/journal") },
          { "@type": "ListItem", position: 3, name: "Fahad Hamid" },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema).replace(/</g, "\\u003c") }}
      />
      <nav className="journal-breadcrumb journal-shell" aria-label="Breadcrumb">
        <ol><li><Link href="/">Home</Link></li><li><Link href="/journal">Field Notes</Link></li><li aria-current="page">Fahad Hamid</li></ol>
      </nav>

      <section className="author-profile journal-shell">
        <div className="author-profile__portrait">
          <Image src="/images/chauffeurs/fahad-hamid-portrait.webp" alt="Portrait of Fahad Hamid" width={1024} height={1024} sizes="(max-width: 760px) calc(100vw - 36px), 42vw" priority />
        </div>
        <div className="author-profile__copy">
          <p className="eyebrow">Chauffeur · Field Notes author</p>
          <h1>Fahad<br /><em>Hamid.</em></h1>
          <p className="author-profile__lead">Fahad covers the handoffs and decisions that shape executive ground movement in Washington: airport arrivals, private aviation coordination, and multi-stop days built around hard commitments.</p>
          <dl className="author-profile__scope">
            <div><dt>Focus</dt><dd>Washington, DC · DCA · IAD · BWI</dd></div>
            <div><dt>Assignments</dt><dd>Airport · Private aviation · Hourly</dd></div>
            <div><dt>Published</dt><dd>{articles.length} launch field notes</dd></div>
          </dl>
        </div>
      </section>

      <section className="author-method">
        <div className="journal-shell author-method__grid">
          <div><p className="eyebrow eyebrow--light">Editorial method</p><h2>Useful because it is specific.</h2></div>
          <div>
            <p>Field Notes are prepared with AI-assisted research and copyediting, the public sources linked in each article, and Altaie&apos;s published service standards. The byline identifies the editorial point of view; the source notes identify the current public guidance behind operational details.</p>
            <p>Airport, facility, roadway, and security instructions can change. Readers should reconfirm live operating guidance with the responsible airport, handler, property, or Altaie desk before travel.</p>
          </div>
        </div>
      </section>

      <section className="journal-shell author-articles" aria-labelledby="fahad-notes">
        <div className="journal-section-heading">
          <div><p className="eyebrow">All Field Notes</p><h2 id="fahad-notes">Written by Fahad</h2></div>
          <Link className="text-link" href="/journal">View journal <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="author-article-list">
          {articles.map((article, index) => (
            <article key={article.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><p className="eyebrow">{article.category}</p><h3><Link href={`/journal/${article.slug}`}>{article.title}</Link></h3><p>{article.description}</p></div>
              <Link aria-label={`Read ${article.title}`} href={`/journal/${article.slug}`}>↗</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div><p className="eyebrow eyebrow--light">Brief the next movement</p><h2>Turn the itinerary into an operating plan.</h2><p>Share the flight, stops, hard doors, passenger details, and service preference. Altaie will review coverage and confirm final details in writing.</p></div>
        <Link className="button button--ivory" href="/book">Request a ride</Link>
      </section>
    </>
  );
}
