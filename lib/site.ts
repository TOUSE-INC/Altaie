export const SITE_URL = "https://www.altaiedc.com";
export const organizationId = `${SITE_URL}/#organization`;
export const authorPath = "/journal/fahad-hamid";
export const authorUrl = `${SITE_URL}${authorPath}`;

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
