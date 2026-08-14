import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { access, readFile } from "node:fs/promises";
import net from "node:net";
import { fileURLToPath } from "node:url";
import { after, before, test } from "node:test";

const root = new URL("../", import.meta.url);
const rootPath = fileURLToPath(root);
const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const dashboardUsername = "release-test";
const dashboardPassword = "a-long-preview-password";

function reservePort() {
  return new Promise((resolve, reject) => {
    const socket = net.createServer();
    socket.unref();
    socket.once("error", reject);
    socket.listen(0, "127.0.0.1", () => {
      const address = socket.address();
      socket.close(() => resolve(address.port));
    });
  });
}

async function startProductionServer({ withDashboardCredentials = true } = {}) {
  const port = await reservePort();
  const env = {
    ...process.env,
    NODE_ENV: "production",
  };

  if (withDashboardCredentials) {
    env.ALTAIE_DASHBOARD_USERNAME = dashboardUsername;
    env.ALTAIE_DASHBOARD_PASSWORD = dashboardPassword;
  } else {
    delete env.ALTAIE_DASHBOARD_USERNAME;
    delete env.ALTAIE_DASHBOARD_PASSWORD;
  }

  const child = spawn(
    process.execPath,
    [nextBin, "start", "-H", "127.0.0.1", "-p", String(port)],
    { cwd: rootPath, env, stdio: ["ignore", "pipe", "pipe"] },
  );
  let output = "";
  child.stdout.on("data", (chunk) => { output += chunk; });
  child.stderr.on("data", (chunk) => { output += chunk; });

  const baseUrl = `http://127.0.0.1:${port}`;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error(`Next.js exited before becoming ready.\n${output}`);
    }

    try {
      const response = await fetch(baseUrl);
      if (response.ok) {
        return {
          baseUrl,
          async stop() {
            if (child.exitCode !== null) return;
            child.kill("SIGTERM");
            await Promise.race([
              once(child, "exit"),
              new Promise((resolve) => setTimeout(resolve, 5_000)),
            ]);
            if (child.exitCode === null) child.kill("SIGKILL");
          },
        };
      }
    } catch {
      // The server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  child.kill("SIGKILL");
  throw new Error(`Next.js did not become ready.\n${output}`);
}

let server;

function parseJsonLd(html) {
  return [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

function flattenJsonLdTypes(documents) {
  return documents.flatMap((document) => {
    if (Array.isArray(document)) return document;
    if (Array.isArray(document?.["@graph"])) return document["@graph"];
    return [document];
  });
}

before(async () => {
  await access(new URL(".next/BUILD_ID", root));
  server = await startProductionServer();
});

after(async () => {
  await server?.stop();
});

test("the public launch surface renders the truthful private-beta journey", async () => {
  const [homeResponse, bookResponse, servicesResponse, contactResponse, termsResponse] = await Promise.all([
    fetch(server.baseUrl),
    fetch(`${server.baseUrl}/book`),
    fetch(`${server.baseUrl}/services`),
    fetch(`${server.baseUrl}/contact`),
    fetch(`${server.baseUrl}/terms`),
  ]);

  assert.equal(homeResponse.status, 200);
  const homeHtml = await homeResponse.text();
  assert.match(homeHtml, /Washington/);
  assert.doesNotMatch(homeHtml, /available inventory is shown upfront|direct booking/i);

  assert.equal(bookResponse.status, 200);
  const bookingHtml = await bookResponse.text();
  const bookingText = bookingHtml.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  assert.match(bookingHtml, /Private beta/i);
  assert.match(bookingHtml, /Demo itinerary/i);
  assert.match(bookingText, /Your chauffeur is assigned\./i);
  assert.match(bookingText, /Fahad Hamid/);
  assert.doesNotMatch(bookingText, /Marcus Reed/);
  assert.match(bookingHtml, /View live trip/i);
  assert.match(bookingHtml, /Simulated live data/i);
  assert.match(bookingHtml, /Illustrative route map of Washington, DC/i);
  assert.match(bookingHtml, /Request a ride/i);
  assert.doesNotMatch(bookingHtml, /real-time dispatch|live vehicle location/i);
  assert.doesNotMatch(bookingHtml, /fixed-price Altaie|Live DC inventory|You(?:&apos;|')re booked/);

  assert.equal(servicesResponse.status, 200);
  const servicesHtml = await servicesResponse.text();
  assert.match(servicesHtml, /request/i);
  assert.doesNotMatch(servicesHtml, /Available means bookable|choose from available vehicles|directly confirmed/i);

  assert.equal(contactResponse.status, 200);
  assert.doesNotMatch(await contactResponse.text(), /Open direct booking/i);

  assert.equal(termsResponse.status, 200);
  const termsHtml = await termsResponse.text();
  assert.match(termsHtml, /Submitting a request does not confirm a ride/i);
  assert.doesNotMatch(termsHtml, /prototype demonstrates confirmation/i);
});

test("Fahad Hamid Field Notes are crawlable, attributable, and internally discoverable", async () => {
  const articlePaths = [
    "/journal/dca-iad-bwi-ground-risk",
    "/journal/fbo-to-boardroom-chauffeur-brief",
    "/journal/hourly-chauffeur-washington-board-day",
  ];
  const articleTitles = [
    "DCA, IAD, or BWI? Choose the Washington airport by ground risk",
    "FBO to boardroom: the chauffeur brief that prevents a missed handoff",
    "The six-stop Washington day: when hourly service beats separate rides",
  ];
  const [homeResponse, hubResponse, authorResponse, sitemapResponse, robotsResponse, ...articleResponses] = await Promise.all([
    fetch(server.baseUrl),
    fetch(`${server.baseUrl}/journal`),
    fetch(`${server.baseUrl}/journal/fahad-hamid`),
    fetch(`${server.baseUrl}/sitemap.xml`),
    fetch(`${server.baseUrl}/robots.txt`),
    ...articlePaths.map((path) => fetch(`${server.baseUrl}${path}`)),
  ]);

  assert.equal(homeResponse.status, 200);
  assert.match(await homeResponse.text(), /href="\/journal"/);

  assert.equal(hubResponse.status, 200);
  const hubHtml = await hubResponse.text();
  assert.match(hubHtml, /Field Notes/);
  assert.match(hubHtml, /href="\/journal\/fahad-hamid"/);
  for (const path of articlePaths) assert.match(hubHtml, new RegExp(`href="${path}"`));

  assert.equal(authorResponse.status, 200);
  const authorHtml = await authorResponse.text();
  const authorTypes = flattenJsonLdTypes(parseJsonLd(authorHtml)).map((entry) => entry?.["@type"]);
  assert.match(authorHtml, /Fahad Hamid/);
  assert.match(authorHtml, /AI-assisted research and copyediting/i);
  assert.ok(authorTypes.includes("ProfilePage"));
  for (const path of articlePaths) assert.match(authorHtml, new RegExp(`href="${path}"`));

  for (const [index, response] of articleResponses.entries()) {
    assert.equal(response.status, 200, articlePaths[index]);
    const html = await response.text();
    const jsonLd = flattenJsonLdTypes(parseJsonLd(html));
    const types = jsonLd.map((entry) => entry?.["@type"]);
    const posting = jsonLd.find((entry) => entry?.["@type"] === "BlogPosting");

    assert.match(html, /href="\/journal\/fahad-hamid"[^>]*>Fahad Hamid<\/a>/);
    assert.match(html, /Sources and current guidance/);
    assert.match(html, /href="\/book"/);
    assert.match(
      html,
      new RegExp(`<link rel="canonical" href="https://www\\.altaiedc\\.com${articlePaths[index]}"`),
    );
    assert.ok(types.includes("BlogPosting"));
    assert.ok(types.includes("BreadcrumbList"));
    assert.equal(posting?.author?.name, "Fahad Hamid");
    assert.equal(posting?.author?.url, "https://www.altaiedc.com/journal/fahad-hamid");
    assert.equal(posting?.publisher?.name, "Altaie");
    assert.match(posting?.datePublished ?? "", /^2026-08-14T\d{2}:\d{2}:\d{2}-04:00$/);
    assert.ok(Date.parse(posting?.datePublished ?? "") <= Date.now(), "publication timestamps cannot be in the future");
    assert.ok(html.includes(`<li aria-current="page">${articleTitles[index]}</li>`));
    assert.match(html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " "), /Updated August 14, 2026/);
    assert.match(html, /class="field-note__table-wrap"[^>]*role="region"[^>]*tabindex="0"/);
    assert.match(html, /Illustrative Altaie campaign image/);
    assert.doesNotMatch(html, /at a Washington airport|prepared for a private aviation arrival|for a multi-stop Washington assignment/);
    if (index === 0) assert.match(html, /App-Based Ride Services/);
    if (index === 1) assert.match(html, /Fahad(?:&apos;|’)s operating framework/);
    assert.doesNotMatch(html, /FAQPage/);
  }

  assert.equal(sitemapResponse.status, 200);
  const sitemapXml = await sitemapResponse.text();
  assert.match(sitemapXml, /https:\/\/www\.altaiedc\.com\/journal<\/loc>/);
  assert.match(sitemapXml, /https:\/\/www\.altaiedc\.com\/journal\/fahad-hamid<\/loc>/);
  for (const path of articlePaths) {
    assert.match(sitemapXml, new RegExp(`https://www\\.altaiedc\\.com${path}</loc>`));
  }
  assert.match(sitemapXml, /<lastmod>2026-08-14T/);

  assert.equal(robotsResponse.status, 200);
  assert.match(await robotsResponse.text(), /Sitemap: https:\/\/www\.altaiedc\.com\/sitemap\.xml/);

  const [siteSource, layoutSource, journalCss, readme] = await Promise.all([
    readFile(new URL("../lib/site.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/journal/journal.css", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);
  assert.doesNotMatch(siteSource, /NEXT_PUBLIC_SITE_URL|altaie\.app/);
  assert.match(siteSource, /https:\/\/www\.altaiedc\.com/);
  assert.doesNotMatch(layoutSource, /next\/headers|headers\(\)/);
  assert.match(layoutSource, /metadataBase:\s*new URL\(SITE_URL\)/);
  assert.match(journalCss, /\.field-note__decision[^}]*:focus-visible|\.field-note__decision\s+:focus-visible/);
  assert.doesNotMatch(readme, /NEXT_PUBLIC_SITE_URL=https:\/\/altaie\.app|attach `altaie\.app`/);
});

test("dashboard routes challenge anonymous visitors and accept configured credentials", async () => {
  for (const path of ["/owner", "/portal"]) {
    const anonymousResponse = await fetch(`${server.baseUrl}${path}`, { redirect: "manual" });
    assert.equal(anonymousResponse.status, 401);
    assert.match(anonymousResponse.headers.get("www-authenticate") ?? "", /^Basic /);
    assert.match(anonymousResponse.headers.get("cache-control") ?? "", /no-store/);
    assert.match(anonymousResponse.headers.get("x-robots-tag") ?? "", /noindex/);

    const wrongAuthorization = Buffer.from(`${dashboardUsername}:incorrect`).toString("base64");
    const wrongCredentialsResponse = await fetch(`${server.baseUrl}${path}`, {
      headers: { authorization: `Basic ${wrongAuthorization}` },
      redirect: "manual",
    });
    assert.equal(wrongCredentialsResponse.status, 401);

    const authorization = Buffer.from(`${dashboardUsername}:${dashboardPassword}`).toString("base64");
    const authenticatedResponse = await fetch(`${server.baseUrl}${path}`, {
      headers: { authorization: `Basic ${authorization}` },
    });
    assert.equal(authenticatedResponse.status, 200);
    const dashboardHtml = await authenticatedResponse.text();
    assert.match(dashboardHtml, /Fahad Hamid/);
    assert.doesNotMatch(dashboardHtml, /Marcus T\./);
    if (path === "/portal") {
      assert.match(dashboardHtml, /<dt>Flight<\/dt><dd>UA 1842<\/dd>/);
      assert.match(dashboardHtml, /<dt>Chauffeur<\/dt><dd>Fahad Hamid<\/dd>/);
    }
  }
});

test("the chauffeur replacement preserves unrelated demo identities", async () => {
  const ownerSource = await readFile(new URL("../app/owner/OwnerDashboard.tsx", import.meta.url), "utf8");
  assert.match(ownerSource, /Marcus Bell/);
  assert.match(ownerSource, /Lena R\./);
  assert.match(ownerSource, /Omar K\./);
});

test("dashboard routes fail closed when credentials are not configured", async () => {
  const closedServer = await startProductionServer({ withDashboardCredentials: false });
  try {
    for (const path of ["/owner", "/portal"]) {
      const response = await fetch(`${closedServer.baseUrl}${path}`, { redirect: "manual" });
      assert.equal(response.status, 404);
      assert.match(response.headers.get("cache-control") ?? "", /no-store/);
      assert.match(response.headers.get("x-robots-tag") ?? "", /noindex/);
    }
  } finally {
    await closedServer.stop();
  }
});

test("the lead endpoint rejects malformed requests before touching integrations", async () => {
  const response = await fetch(`${server.baseUrl}/api/leads`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({}),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Choose a valid request type." });
});
