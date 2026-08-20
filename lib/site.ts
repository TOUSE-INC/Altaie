export const SITE_URL = "https://www.altaiedc.com";
export const organizationId = `${SITE_URL}/#organization`;
export const authorPath = "/journal/fahad-hamid";
export const authorUrl = `${SITE_URL}${authorPath}`;
export const PILOT_AIRPORTS = ["DCA", "IAD"] as const;
export const PILOT_AIRPORT_LABEL = PILOT_AIRPORTS.join(" · ");

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
