import { MetadataRoute } from "next";

const BASE = "https://ultimatebuildingservices.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Core pages ──────────────────────────────────────────────────────────
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE}/about`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${BASE}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${BASE}/careers`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE}/book`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },

    // ── Services hub ────────────────────────────────────────────────────────
    {
      url: `${BASE}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.95,
    },

    // ── Individual service pages ─────────────────────────────────────────────
    {
      url: `${BASE}/services/commercial-janitorial`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/services/building-maintenance`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/services/pressure-washing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/services/floor-care`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/services/carpet-cleaning`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/services/electrostatic-disinfection`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE}/services/window-cleaning`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE}/services/post-construction-cleanup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },

    // ── Customer portal (noindex, but still in sitemap for soft discoverability) ─
    {
      url: `${BASE}/portal/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },

    // ── Thank you page ────────────────────────────────────────────────────────
    {
      url: `${BASE}/thank-you`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.1,
    },
  ];
}
