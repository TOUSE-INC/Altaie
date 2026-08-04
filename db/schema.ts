import { bigint, boolean, index, integer, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  leadType: text("lead_type", { enum: ["ride", "corporate", "partner"] }).notNull(),
  contactName: text("contact_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  company: text("company"),
  monthlyRideBand: text("monthly_ride_band"),
  serviceNeeds: text("service_needs"),
  jurisdictions: text("jurisdictions"),
  authorityNumbers: text("authority_numbers"),
  vehicleCategories: text("vehicle_categories"),
  serviceAreas: text("service_areas"),
  tripType: text("trip_type"),
  pickupAt: text("pickup_at"),
  pickup: text("pickup"),
  dropoff: text("dropoff"),
  passengers: text("passengers"),
  flightNumber: text("flight_number"),
  notes: text("notes"),
  consent: boolean("consent").notNull().default(true),
  status: text("status").notNull().default("new"),
  fingerprint: text("fingerprint").notNull(),
  createdAt: bigint("created_at", { mode: "number" }).notNull(),
}, (table) => [
  uniqueIndex("leads_fingerprint_idx").on(table.fingerprint),
  index("leads_created_at_idx").on(table.createdAt),
  index("leads_type_status_idx").on(table.leadType, table.status),
]);

export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(1),
  windowStart: bigint("window_start", { mode: "number" }).notNull(),
});
