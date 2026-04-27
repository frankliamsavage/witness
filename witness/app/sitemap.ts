import type { MetadataRoute } from "next";

const SITE_URL = "https://witnessproject.net";

const routes = [
  "",
  "/products",
  "/how-it-works",
  "/about",
  "/contact",
  "/cart",
  "/checkout",
  "/privacy",
  "/terms",
  "/login",
  "/signup",
  "/submit-design",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
