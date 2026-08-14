import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { absoluteUrl, authorPath, authorUrl, organizationId, SITE_URL } from "@/lib/site";
import { articles } from "./articles";

export const metadata: Metadata = {
  title: "Field Notes",
  description: "Fahad Hamid's field notes on Washington airport strategy, private aviation handoffs, and multi-stop executive chauffeur assignments.",
  alternates: { canonical: absoluteUrl("/journal") },
  openGraph: {
    type: "website",
    title: "Field Notes — Washington movement, explained",
    description: "Decision-grade guidance for assistants and principals moving through Washington.",
    url: absoluteUrl("/journal"),
    images: [{
      url: absoluteUrl("/images/chauffeurs/fahad-hamid-arrival.webp"),
      width: 1672,
      height: 941,
      alt: "Fahad Hamid preparing an executive vehicle in Washington",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Altaie Field Notes",
    description: "Washington executive-mobility guidance by Fahad Hamid.",
    images: [absoluteUrl("/images/chauffeurs/fahad-hamid-arrival.webp")],
  },
};

export default function JournalPage() {
  const [featured, ...supporting] = articles;
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/journal#blog`,
    name: "Altaie Field Notes",
    description: metadata.description,
    url: absoluteUrl("/journal"),
    inLanguage: "en-US",
    author: {
      "@type": "Person",
      "@id": `${authorUrl}#person`,
      name: "Fahad Hamid",
      url: authorUrl,
    },
    publisher: {
      "@type": "Organization",
      "@id": organizationId,
      name: "Altaie",
      url: SITE_URL,
    },
    blogPost: articles.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      url: absoluteUrl(`/journal/${article.slug}`),
      datePublished: article.datePublished,
      author: { "@id": `${authorUrl}#person` },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema).replace(/</g, "\\u003c") }}
      />

      <section className="journal-index-hero">
        <div className="journal-shell journal-index-hero__inner">
          <div>
            <p className="eyebrow">Field Notes · Washington, DC</p>
            <h1>Movement,<br /><em>explained.</em></h1>
          </div>
          <div className="journal-index-hero__copy">
            <p>Decision-grade notes for the assistants, flight teams, and principals who need Washington ground plans to hold together.</p>
            <Link className="journal-author-link" href={authorPath}>
              <Image src="/images/chauffeurs/fahad-hamid-portrait.webp" alt="Fahad Hamid" width={60} height={60} sizes="60px" />
              <span><b>Written by Fahad Hamid</b><small>Altaie chauffeur · Field Notes author</small></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="journal-shell journal-feature-section" aria-labelledby="featured-note">
        <div className="journal-section-label"><span>01</span><p className="eyebrow">Featured note</p></div>
        <article className="journal-feature">
          <Link className="journal-feature__image" href={`/journal/${featured.slug}`} aria-label={`Read ${featured.title}`}>
            <Image
              src={featured.image}
              alt={featured.imageAlt}
              width={featured.imageWidth}
              height={featured.imageHeight}
              sizes="(max-width: 760px) calc(100vw - 36px), 58vw"
              priority
            />
          </Link>
          <div className="journal-feature__copy">
            <p className="eyebrow">{featured.category}</p>
            <h2 id="featured-note"><Link href={`/journal/${featured.slug}`}>{featured.title}</Link></h2>
            <p>{featured.deck}</p>
            <div className="journal-card__meta"><span>Fahad Hamid</span><span>{featured.displayDate}</span><span>{featured.readingTime}</span></div>
            <Link className="text-link" href={`/journal/${featured.slug}`}>Read the field note <span aria-hidden="true">↗</span></Link>
          </div>
        </article>
      </section>

      <section className="journal-supporting">
        <div className="journal-shell">
          <div className="journal-section-heading">
            <div className="journal-section-label"><span>02</span><p className="eyebrow">Operational briefings</p></div>
            <p>Built from the questions that change the operating plan—not from keyword variations.</p>
          </div>
          <div className="journal-card-grid">
            {supporting.map((article) => (
              <article className="journal-card" key={article.slug}>
                <Link className="journal-card__image" href={`/journal/${article.slug}`} aria-label={`Read ${article.title}`}>
                  <Image
                    src={article.image}
                    alt={article.imageAlt}
                    width={article.imageWidth}
                    height={article.imageHeight}
                    sizes="(max-width: 760px) calc(100vw - 36px), 43vw"
                  />
                </Link>
                <div className="journal-card__body">
                  <p className="eyebrow">{article.category}</p>
                  <h2><Link href={`/journal/${article.slug}`}>{article.title}</Link></h2>
                  <p>{article.decision}</p>
                  <div className="journal-card__meta"><span>{article.displayDate}</span><span>{article.readingTime}</span></div>
                  <Link className="text-link" href={`/journal/${article.slug}`}>Read note <span aria-hidden="true">↗</span></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="journal-author-band">
        <div className="journal-shell journal-author-band__inner">
          <Image src="/images/chauffeurs/fahad-hamid-portrait.webp" alt="Portrait of Fahad Hamid" width={1024} height={1024} sizes="(max-width: 760px) 40vw, 260px" />
          <div>
            <p className="eyebrow eyebrow--light">The author</p>
            <h2>Fahad Hamid</h2>
            <p>Fahad writes about the operational details behind airport arrivals, private aviation handoffs, and assistant-led Washington itineraries.</p>
            <Link className="button button--ivory" href={authorPath}>Meet Fahad</Link>
          </div>
        </div>
      </section>
    </>
  );
}
