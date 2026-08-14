import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { absoluteUrl, authorPath, authorUrl, organizationId, SITE_URL } from "@/lib/site";
import { articles, getArticle, type ArticleLink } from "../articles";

type ArticlePageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Field Note not found" };

  const path = `/journal/${article.slug}`;
  const pageUrl = absoluteUrl(path);
  const imageUrl = absoluteUrl(article.image);

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: pageUrl },
    authors: [{ name: "Fahad Hamid", url: authorUrl }],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url: pageUrl,
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      authors: [authorUrl],
      section: article.category,
      images: [{ url: imageUrl, width: article.imageWidth, height: article.imageHeight, alt: article.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [imageUrl],
    },
  };
}

function EditorialLink({ link, className }: { link: ArticleLink; className?: string }) {
  if (link.href.startsWith("/")) return <Link className={className} href={link.href}>{link.label}</Link>;
  return <a className={className} href={link.href} target="_blank" rel="noreferrer">{link.label} <span aria-hidden="true">↗</span></a>;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const path = `/journal/${article.slug}`;
  const pageUrl = absoluteUrl(path);
  const relatedArticles = article.relatedSlugs.map((relatedSlug) => getArticle(relatedSlug)).filter((item) => item !== undefined);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${pageUrl}#article`,
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        headline: article.title,
        description: article.description,
        articleSection: article.category,
        inLanguage: "en-US",
        image: {
          "@type": "ImageObject",
          url: absoluteUrl(article.image),
          width: article.imageWidth,
          height: article.imageHeight,
        },
        datePublished: article.datePublished,
        dateModified: article.dateModified,
        author: {
          "@type": "Person",
          "@id": `${authorUrl}#person`,
          name: "Fahad Hamid",
          url: authorUrl,
          jobTitle: "Executive chauffeur and Field Notes author",
        },
        publisher: {
          "@type": "Organization",
          "@id": organizationId,
          name: "Altaie",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/brand/altaie-mark.svg"),
          },
        },
        isPartOf: {
          "@type": "Blog",
          "@id": `${SITE_URL}/journal#blog`,
          name: "Altaie Field Notes",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Field Notes", item: absoluteUrl("/journal") },
          { "@type": "ListItem", position: 3, name: article.title },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <article className="field-note">
        <nav className="journal-breadcrumb journal-shell" aria-label="Breadcrumb">
          <ol><li><Link href="/">Home</Link></li><li><Link href="/journal">Field Notes</Link></li><li aria-current="page">{article.category}</li></ol>
        </nav>

        <header className="field-note__header journal-shell">
          <p className="eyebrow">{article.category}</p>
          <h1>{article.title}</h1>
          <p className="field-note__deck">{article.deck}</p>
          <div className="field-note__meta">
            <span>By <Link href={authorPath}>Fahad Hamid</Link></span>
            <span>Published <time dateTime={article.datePublished}>{article.displayDate}</time></span>
            <span>{article.readingTime}</span>
          </div>
        </header>

        <figure className="field-note__hero journal-shell">
          <Image
            src={article.image}
            alt={article.imageAlt}
            width={article.imageWidth}
            height={article.imageHeight}
            sizes="(max-width: 760px) calc(100vw - 36px), calc(100vw - 64px)"
            priority
          />
          <figcaption>{article.imageAlt}. Altaie campaign image.</figcaption>
        </figure>

        <section className="field-note__decision journal-shell" aria-labelledby="decision-in-brief">
          <div><p className="eyebrow eyebrow--light">Decision in brief</p><h2 id="decision-in-brief">The operating answer</h2></div>
          <p>{article.decision}</p>
        </section>

        <div className="field-note__layout journal-shell">
          <aside className="field-note__rail">
            <nav aria-label="On this page">
              <p className="eyebrow">On this page</p>
              <ol>{article.sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a></li>)}</ol>
            </nav>
            <div className="field-note__rail-cta"><p>Planning a Washington movement?</p><Link className="text-link" href="/book">Request a ride <span aria-hidden="true">↗</span></Link></div>
          </aside>

          <div className="field-note__body">
            <section className="field-note__takeaways" aria-labelledby="key-takeaways">
              <p className="eyebrow">Key takeaways</p>
              <h2 id="key-takeaways">What matters most</h2>
              <ul>{article.takeaways.map((takeaway) => <li key={takeaway}>{takeaway}</li>)}</ul>
            </section>

            {article.sections.map((section, sectionIndex) => (
              <section className="field-note__section" id={section.id} key={section.id}>
                <span className="field-note__section-number">{String(sectionIndex + 1).padStart(2, "0")}</span>
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
                {section.table && (
                  <div className="field-note__table-wrap">
                    <table>
                      <caption>{section.table.caption}</caption>
                      <thead><tr>{section.table.headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr></thead>
                      <tbody>{section.table.rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                )}
                {section.brief && (
                  <div className="field-note__brief">
                    <p className="eyebrow">{section.brief.title}</p>
                    <p>{section.brief.intro}</p>
                    <dl>{section.brief.rows.map((row) => <div key={row.label}><dt>{row.label}</dt><dd>{row.value}</dd></div>)}</dl>
                  </div>
                )}
                {section.note && <aside className="field-note__note"><b>{section.note.title}</b><p>{section.note.body}</p></aside>}
              </section>
            ))}

            <section className="field-note__sources" aria-labelledby="sources-current-guidance">
              <p className="eyebrow">Verification trail</p>
              <h2 id="sources-current-guidance">Sources and current guidance</h2>
              <p>Public operating instructions can change. These links identify the source pages used for this note; reconfirm current instructions before travel.</p>
              <ul>{article.sources.map((source) => <li key={source.href}><EditorialLink link={source} /></li>)}</ul>
            </section>

            <section className="field-note__services" aria-label="Related Altaie services">
              {article.serviceLinks.map((link) => <EditorialLink className="button button--dark" link={link} key={link.href} />)}
            </section>
          </div>
        </div>

        <section className="field-note__author">
          <div className="journal-shell field-note__author-inner">
            <Image src="/images/chauffeurs/fahad-hamid-portrait.webp" alt="Portrait of Fahad Hamid" width={1024} height={1024} sizes="(max-width: 760px) 120px, 180px" />
            <div><p className="eyebrow eyebrow--light">Written by</p><h2><Link href={authorPath}>Fahad Hamid</Link></h2><p>Altaie chauffeur and Field Notes author covering Washington airport arrivals, private aviation handoffs, and assistant-led executive itineraries.</p><Link className="text-link text-link--light" href={authorPath}>Author profile <span aria-hidden="true">↗</span></Link></div>
          </div>
        </section>

        <section className="journal-shell field-note__related" aria-labelledby="related-notes">
          <p className="eyebrow">Continue reading</p>
          <h2 id="related-notes">Related Field Notes</h2>
          <div className="field-note__related-grid">
            {relatedArticles.map((related, index) => (
              <article key={related.slug}><span>{String(index + 1).padStart(2, "0")}</span><p className="eyebrow">{related.category}</p><h3><Link href={`/journal/${related.slug}`}>{related.title}</Link></h3><p>{related.description}</p><Link aria-label={`Read ${related.title}`} href={`/journal/${related.slug}`}>↗</Link></article>
            ))}
          </div>
        </section>
      </article>
    </>
  );
}

