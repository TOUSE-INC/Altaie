import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { access } from "node:fs/promises";
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
  assert.match(bookingHtml, /Altaie private beta/);
  assert.match(bookingHtml, /Service request/);
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
  }
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
