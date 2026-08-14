import type { MetadataRoute } from "next";
import { articles } from "./journal/articles";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const launchModified = "2026-08-14T09:00:00-04:00";
  const staticRoutes = ["", "/services", "/corporate", "/airports", "/standards", "/book", "/contact", "/partner-network", "/privacy", "/terms"];
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: launchModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/book" ? 0.9 : 0.7,
  }));
  const journalEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/journal`, lastModified: launchModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/journal/fahad-hamid`, lastModified: launchModified, changeFrequency: "monthly", priority: 0.7 },
    ...articles.map((article) => ({
      url: `${SITE_URL}/journal/${article.slug}`,
      lastModified: article.dateModified,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
  ];

  return [...staticEntries, ...journalEntries];
}
