import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://soalsnbt.id";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pricing", "/tryout", "/login", "/register"],
        disallow: [
          "/dashboard",
          "/latihan",
          "/profil",
          "/admin",
          "/api",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
