import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("production build and Altaie homepage sources are present", async () => {
  await access(new URL("dist/server/index.js", root));
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
  assert.match(chrome, /Request a ride/);
  assert.doesNotMatch(`${layout}${home}${chrome}`, /Sable Mile|react-loading-skeleton|Your site is taking shape/i);
});

test("all required public routes and lead endpoint exist", async () => {
  for (const path of [
    "app/services/page.tsx",
    "app/corporate/page.tsx",
    "app/airports/page.tsx",
    "app/standards/page.tsx",
    "app/book/page.tsx",
    "app/contact/page.tsx",
    "app/partner-network/page.tsx",
    "app/privacy/page.tsx",
    "app/terms/page.tsx",
    "app/portal/page.tsx",
    "app/api/leads/route.ts",
  ]) {
    await access(new URL(path, root));
  }

  const leadRoute = await source("app/api/leads/route.ts");
  assert.match(leadRoute, /"ride", "corporate", "partner"/);
  assert.match(leadRoute, /RateLimitError/);
  assert.match(leadRoute, /Altaie launch desk/);

  const portal = await source("app/portal/PortalPrototype.tsx");
  assert.match(portal, /Request a ride/);
  assert.match(portal, /Coordination desk/);
  assert.match(portal, /Production reservations, accounts, payments, and ride history remain connected through Moovs/);
});
