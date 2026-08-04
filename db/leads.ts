import { lt, sql } from "drizzle-orm";
import { getDb } from ".";
import { leads, rateLimits } from "./schema";

export type LeadType = "ride" | "corporate" | "partner";

export type LeadRecord = {
  kind: LeadType;
  contactName: string;
  email: string;
  phone: string;
  company?: string;
  monthlyRideBand?: string;
  serviceNeeds?: string[];
  jurisdictions?: string[];
  authorityNumbers?: string;
  vehicleCategories?: string[];
  serviceAreas?: string;
  tripType?: string;
  pickupAt?: string;
  pickup?: string;
  dropoff?: string;
  passengers?: string;
  flightNumber?: string;
  notes?: string;
  consent: boolean;
};

export class RateLimitError extends Error {}

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function enforceRateLimit(ipAddress: string) {
  const db = getDb();
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const salt = process.env.RATE_LIMIT_SALT || "altaie-staging";
  const key = await digest(`${salt}:${ipAddress}:${windowStart}`);

  const [row] = await db
    .insert(rateLimits)
    .values({ key, count: 1, windowStart })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: { count: sql`${rateLimits.count} + 1` },
    })
    .returning({ count: rateLimits.count });

  if ((row?.count || 0) > 5) {
    throw new RateLimitError(
      "Too many requests. Please wait a few minutes and try again.",
    );
  }

  await db
    .delete(rateLimits)
    .where(lt(rateLimits.windowStart, now - 24 * 60 * 60 * 1000));
}

export async function storeLead(lead: LeadRecord, ipAddress: string) {
  const db = getDb();
  await enforceRateLimit(ipAddress);

  const createdAt = Date.now();
  const day = new Date(createdAt).toISOString().slice(0, 10);
  const stableIdentity = JSON.stringify({
    day,
    kind: lead.kind,
    email: lead.email.toLowerCase(),
    company: lead.company?.toLowerCase() || "",
    pickupAt: lead.pickupAt || "",
    pickup: lead.pickup?.toLowerCase() || "",
  });
  const fingerprint = await digest(stableIdentity);
  const id = crypto.randomUUID();

  const inserted = await db
    .insert(leads)
    .values({
      id,
      leadType: lead.kind,
      contactName: lead.contactName,
      email: lead.email.toLowerCase(),
      phone: lead.phone,
      company: lead.company || null,
      monthlyRideBand: lead.monthlyRideBand || null,
      serviceNeeds: lead.serviceNeeds
        ? JSON.stringify(lead.serviceNeeds)
        : null,
      jurisdictions: lead.jurisdictions
        ? JSON.stringify(lead.jurisdictions)
        : null,
      authorityNumbers: lead.authorityNumbers || null,
      vehicleCategories: lead.vehicleCategories
        ? JSON.stringify(lead.vehicleCategories)
        : null,
      serviceAreas: lead.serviceAreas || null,
      tripType: lead.tripType || null,
      pickupAt: lead.pickupAt || null,
      pickup: lead.pickup || null,
      dropoff: lead.dropoff || null,
      passengers: lead.passengers || null,
      flightNumber: lead.flightNumber || null,
      notes: lead.notes || null,
      consent: lead.consent,
      status: "new",
      fingerprint,
      createdAt,
    })
    .onConflictDoNothing({ target: leads.fingerprint })
    .returning({ id: leads.id });

  await db
    .delete(leads)
    .where(lt(leads.createdAt, createdAt - 365 * 24 * 60 * 60 * 1000));

  return { id, duplicate: inserted.length === 0 };
}
