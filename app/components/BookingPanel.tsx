import { LeadForm } from "./LeadForm";

export function BookingPanel() {
  const portalUrl = process.env.NEXT_PUBLIC_MOOVS_PORTAL_URL;
  if (!portalUrl) return <LeadForm kind="ride" />;

  return (
    <section className="booking-embed" aria-labelledby="booking-title">
      <div className="form-heading">
        <p className="eyebrow">Trip request</p>
        <h2 id="booking-title">Plan the assignment.</h2>
        <p>Choose one-way, round trip, or hourly service. Same-day requests remain pending until dispatch confirms coverage.</p>
      </div>
      <iframe src={portalUrl} title="Altaie booking portal" loading="lazy" />
    </section>
  );
}
