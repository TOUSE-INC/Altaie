import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://altaie.app";
  const routes = ["", "/services", "/corporate", "/airports", "/standards", "/book", "/contact", "/partner-network", "/privacy", "/terms"];
  return routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: route === "" ? "weekly" : "monthly", priority: route === "" ? 1 : route === "/book" ? 0.9 : 0.7 }));
}
