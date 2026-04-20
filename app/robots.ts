import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/studio/", "/api/", "/success/"],
    },
    sitemap: "https://onize.reactbd.com/sitemap.xml",
  };
}
