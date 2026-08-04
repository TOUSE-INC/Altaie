import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("production build and Altaie homepage sources are present", async () => {
  await access(new URL(".next/BUILD_ID", root));
  const [layout, home, chrome] = await Promise.all([
    source("app/layout.tsx"),
    source("app/page.tsx"),
    source("app/components/SiteChrome.tsx"),
  ]);

  assert.match(layout, /Altaie \| Washington, handled\./);
  assert.match(layout, /Altaie — Washington, handled\./);
  assert.match(home, /Washington,/);
  assert.match(home, /application\/ld\+json/);
  assert.match(home, /DCA.*IAD.*BWI/s);
  assert.match(chrome, /Book a ride/);
  assert.doesNotMatch(`${layout}${home}${chrome}`, /Sable Mile|react-loading-skeleton|Your site is taking shape/i);
});

test("all required public routes and lead endpoint exist", async () => {
  for (const path of [
    "app/services/page.tsx",
    "app/corporate/page.tsx",
    "app/airports/page.tsx",
    "app/standards/page.tsx",
    "app/book/page.tsx",
    "app/book/DirectBooking.tsx",
    "app/contact/page.tsx",
    "app/partner-network/page.tsx",
    "app/privacy/page.tsx",
    "app/terms/page.tsx",
    "app/portal/page.tsx",
    "app/owner/page.tsx",
    "public/images/owner/chauffeur-escalade.jpg",
    "public/images/owner/maybach-arrival.jpg",
    "public/images/owner/icons/escalade-fleet.jpg",
    "public/images/owner/icons/maybach-fleet.jpg",
    "public/images/owner/icons/driver-marcus.jpg",
    "public/images/owner/icons/driver-lena.jpg",
    "public/images/owner/icons/driver-omar.jpg",
    "app/api/leads/route.ts",
  ]) {
    await access(new URL(path, root));
  }

  const leadRoute = await source("app/api/leads/route.ts");
  assert.match(leadRoute, /"ride", "corporate", "partner"/);
  assert.match(leadRoute, /RateLimitError/);
  assert.match(leadRoute, /Altaie launch desk/);

  const portal = await source("app/portal/PortalPrototype.tsx");
  assert.match(portal, /Book a ride/);
  assert.match(portal, /Coordination desk/);
  assert.match(portal, /Production reservations, accounts, payments, and ride history remain connected through Moovs/);
  assert.doesNotMatch(portal, /sends the fixed quote|Send for review|Quote approval/);

  const booking = await source("app/book/DirectBooking.tsx");
  const bookingCss = await source("app/book/booking.css");
  assert.match(booking, /Direct booking/);
  assert.match(booking, /See available vehicles/);
  assert.match(booking, /Confirm booking/);
  assert.match(booking, /You&apos;re booked/);
  assert.doesNotMatch(booking, /request a quote|send for review/i);
  assert.match(bookingCss, /100svh/);
  assert.match(bookingCss, /-webkit-text-size-adjust/);
  assert.match(bookingCss, /@supports \(-webkit-touch-callout: none\)/);
  assert.match(bookingCss, /height: clamp\(168px, 52vw, 228px\)/);

  const owner = await source("app/owner/OwnerDashboard.tsx");
  assert.match(owner, /Good morning,/);
  assert.match(owner, /Live operations/);
  assert.match(owner, /Partner network/);
  assert.match(owner, /Contribution margin/);
  assert.match(owner, /Compliance center/);
  assert.match(owner, /Cadillac Escalade ESV/);
  assert.match(owner, /Mercedes-Maybach S-Class/);
  assert.match(owner, /People and vehicles/);
  assert.match(owner, /Chauffeurs on duty/);
});
