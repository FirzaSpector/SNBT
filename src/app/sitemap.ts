import { MetadataRoute } from "next";

/**
 * Sitemap dinamis untuk SoalSNBT.id.
 * Google Search Console akan membaca file ini untuk mengindeks halaman.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://soalsnbt.id";
  const now = new Date();

  // Halaman statis
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tryout`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  return staticPages;
}
