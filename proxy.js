import { NextResponse } from "next/server";

const dashboardRealm = "Altaie private beta";

function privateResponse(status, body, headers = {}) {
  return new NextResponse(body, {
    status,
    headers: {
      "cache-control": "private, no-store",
      "x-robots-tag": "noindex, nofollow, noarchive",
      ...headers,
    },
  });
}

function readBasicCredentials(authorization) {
  if (!authorization?.startsWith("Basic ")) return null;

  try {
    const decoded = atob(authorization.slice("Basic ".length));
    const separator = decoded.indexOf(":");
    if (separator < 0) return null;

    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

export function proxy(request) {
  const expectedUsername = process.env.ALTAIE_DASHBOARD_USERNAME;
  const expectedPassword = process.env.ALTAIE_DASHBOARD_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return privateResponse(404, "Not found.");
  }

  const credentials = readBasicCredentials(request.headers.get("authorization"));
  if (
    !credentials
    || credentials.username !== expectedUsername
    || credentials.password !== expectedPassword
  ) {
    return privateResponse(401, "Authentication required.", {
      "www-authenticate": `Basic realm="${dashboardRealm}", charset="UTF-8"`,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/owner/:path*", "/portal/:path*"],
};
