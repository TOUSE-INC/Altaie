CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_type` text NOT NULL,
	`contact_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`company` text,
	`monthly_ride_band` text,
	`service_needs` text,
	`jurisdictions` text,
	`authority_numbers` text,
	`vehicle_categories` text,
	`service_areas` text,
	`trip_type` text,
	`pickup_at` text,
	`pickup` text,
	`dropoff` text,
	`passengers` text,
	`flight_number` text,
	`notes` text,
	`consent` integer DEFAULT true NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`fingerprint` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `leads_fingerprint_idx` ON `leads` (`fingerprint`);--> statement-breakpoint
CREATE INDEX `leads_created_at_idx` ON `leads` (`created_at`);--> statement-breakpoint
CREATE INDEX `leads_type_status_idx` ON `leads` (`lead_type`,`status`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 1 NOT NULL,
	`window_start` integer NOT NULL
);
