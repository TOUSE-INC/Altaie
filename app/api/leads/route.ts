import { LeadRecord, LeadType, RateLimitError, storeLead } from "../../../db/leads";
import { sendLeadNotification } from "../../../lib/notifications";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedKinds = new Set<LeadType>(["ride", "corporate", "partner"]);

function text(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function list(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean).slice(0, 12) : [];
}

function parseLead(payload: Record<string, unknown>): LeadRecord {
  const kind = text(payload.kind) as LeadType;
  if (!allowedKinds.has(kind)) throw new Error("Choose a valid request type.");
  if (text(payload.website)) throw new Error("Unable to process this request.");

  const contactName = text(payload.contactName, 100);
  const email = text(payload.email, 160).toLowerCase();
  const phone = text(payload.phone, 40);
  const consent = payload.consent === true;
  if (!contactName || !emailPattern.test(email) || !phone) throw new Error("Add a valid name, email, and phone number.");
  if (!consent) throw new Error("Consent is required before we can respond.");

  const lead: LeadRecord = {
    kind,
    contactName,
    email,
    phone,
    company: text(payload.company, 140) || undefined,
    monthlyRideBand: text(payload.monthlyRideBand, 40) || undefined,
    serviceNeeds: list(payload.serviceNeeds),
    jurisdictions: list(payload.jurisdictions),
    authorityNumbers: text(payload.authorityNumbers, 240) || undefined,
    vehicleCategories: list(payload.vehicleCategories),
    serviceAreas: text(payload.serviceAreas, 240) || undefined,
    tripType: text(payload.tripType, 80) || undefined,
    pickupAt: text(payload.pickupAt, 40) || undefined,
    pickup: text(payload.pickup, 180) || undefined,
    dropoff: text(payload.dropoff, 180) || undefined,
    passengers: text(payload.passengers, 20) || undefined,
    flightNumber: text(payload.flightNumber, 24) || undefined,
    notes: text(payload.notes, 1500) || undefined,
    consent,
  };

  if (kind !== "ride" && !lead.company) throw new Error("Company is required.");
  if (kind === "ride" && (!lead.tripType || !lead.pickupAt || !lead.pickup)) throw new Error("Add the service type, pickup time, and pickup location.");
  if (kind === "corporate" && !lead.monthlyRideBand) throw new Error("Choose an expected monthly ride range.");
  if (kind === "partner" && !lead.serviceAreas) throw new Error("Add your primary service areas.");
  return lead;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as Record<string, unknown>;
    const lead = parseLead(payload);
    const ipAddress = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "local";
    const stored = await storeLead(lead, ipAddress);
    if (!stored.duplicate) await sendLeadNotification(lead).catch(() => false);

    return Response.json({
      message: stored.duplicate
        ? "We already have this request and will follow up from the first submission."
        : lead.kind === "ride"
          ? "Request received. A coordinator will review coverage before confirming the ride."
          : "Thanks. Your inquiry is now with the Altaie launch desk.",
    }, { status: stored.duplicate ? 200 : 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "We couldn’t process this request.";
    const status = error instanceof RateLimitError ? 429 : message.includes("unavailable") ? 503 : 400;
    return Response.json({ error: message }, { status });
  }
}
