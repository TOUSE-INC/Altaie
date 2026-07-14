import { getD1 } from ".";

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

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY NOT NULL,
    lead_type TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT,
    monthly_ride_band TEXT,
    service_needs TEXT,
    jurisdictions TEXT,
    authority_numbers TEXT,
    vehicle_categories TEXT,
    service_areas TEXT,
    trip_type TEXT,
    pickup_at TEXT,
    pickup TEXT,
    dropoff TEXT,
    passengers TEXT,
    flight_number TEXT,
    notes TEXT,
    consent INTEGER DEFAULT 1 NOT NULL,
    status TEXT DEFAULT 'new' NOT NULL,
    fingerprint TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  "CREATE UNIQUE INDEX IF NOT EXISTS leads_fingerprint_idx ON leads (fingerprint)",
  "CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at)",
  "CREATE INDEX IF NOT EXISTS leads_type_status_idx ON leads (lead_type, status)",
  `CREATE TABLE IF NOT EXISTS rate_limits (
    key TEXT PRIMARY KEY NOT NULL,
    count INTEGER DEFAULT 1 NOT NULL,
    window_start INTEGER NOT NULL
  )`,
];

let initialized = false;

async function ensureSchema(db: D1Database) {
  if (initialized) return;
  await db.batch(schemaStatements.map((statement) => db.prepare(statement)));
  initialized = true;
}

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function enforceRateLimit(db: D1Database, ipAddress: string) {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const salt = process.env.RATE_LIMIT_SALT || "altaie-staging";
  const key = await digest(`${salt}:${ipAddress}:${windowStart}`);

  await db.prepare(
    "INSERT INTO rate_limits (key, count, window_start) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1"
  ).bind(key, windowStart).run();
  const row = await db.prepare("SELECT count FROM rate_limits WHERE key = ?").bind(key).first<{ count: number }>();
  if ((row?.count || 0) > 5) throw new RateLimitError("Too many requests. Please wait a few minutes and try again.");

  await db.prepare("DELETE FROM rate_limits WHERE window_start < ?").bind(now - 24 * 60 * 60 * 1000).run();
}

export async function storeLead(lead: LeadRecord, ipAddress: string) {
  const db = getD1();
  await ensureSchema(db);
  await enforceRateLimit(db, ipAddress);

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

  const result = await db.prepare(
    `INSERT OR IGNORE INTO leads (
      id, lead_type, contact_name, email, phone, company, monthly_ride_band,
      service_needs, jurisdictions, authority_numbers, vehicle_categories,
      service_areas, trip_type, pickup_at, pickup, dropoff, passengers,
      flight_number, notes, consent, status, fingerprint, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)`
  ).bind(
    id,
    lead.kind,
    lead.contactName,
    lead.email.toLowerCase(),
    lead.phone,
    lead.company || null,
    lead.monthlyRideBand || null,
    lead.serviceNeeds ? JSON.stringify(lead.serviceNeeds) : null,
    lead.jurisdictions ? JSON.stringify(lead.jurisdictions) : null,
    lead.authorityNumbers || null,
    lead.vehicleCategories ? JSON.stringify(lead.vehicleCategories) : null,
    lead.serviceAreas || null,
    lead.tripType || null,
    lead.pickupAt || null,
    lead.pickup || null,
    lead.dropoff || null,
    lead.passengers || null,
    lead.flightNumber || null,
    lead.notes || null,
    lead.consent ? 1 : 0,
    fingerprint,
    createdAt,
  ).run();

  await db.prepare("DELETE FROM leads WHERE created_at < ?").bind(createdAt - 365 * 24 * 60 * 60 * 1000).run();
  return { id, duplicate: result.meta.changes === 0 };
}
