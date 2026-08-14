import Link from "next/link";

export function PageHero({
  eyebrow,
  title,
  body,
  action,
}: {
  eyebrow: string;
  title: string;
  body: string;
  action?: { label: string; href: string };
}) {
  return (
    <section className="page-hero">
      <div className="page-shell page-hero__inner">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-hero__body">{body}</p>
        {action && <Link className="button button--brass" href={action.href}>{action.label}</Link>}
      </div>
    </section>
  );
}

export function CTA({
  eyebrow = "Next assignment",
  title = "Put Washington in capable hands.",
  body = "Share the itinerary and vehicle preference. The Altaie desk will review coverage and confirm the final service details in writing.",
}: {
  eyebrow?: string;
  title?: string;
  body?: string;
}) {
  return (
    <section className="cta-band">
      <div>
        <p className="eyebrow eyebrow--light">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <Link className="button button--ivory" href="/book">Request a ride</Link>
    </section>
  );
}

export function NumberedList({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="numbered-list">
      {items.map((item, index) => (
        <article key={item.title}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <div><h3>{item.title}</h3><p>{item.body}</p></div>
        </article>
      ))}
    </div>
  );
}
