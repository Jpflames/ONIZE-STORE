import { getAllCategories, getAllProducts } from "@/sanity/helpers";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://onize.reactbd.com";

  // Fetch all products and categories from Sanity
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  // Generate product URLs
  const productUrls = products.map((product: any) => ({
    url: `${baseUrl}/product/${product.slug.current}`,
    lastModified: new Date(product._updatedAt || new Date()),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Generate category URLs
  const categoryUrls = categories.map((category: any) => ({
    url: `${baseUrl}/category/${category.slug.current}`,
    lastModified: new Date(category._updatedAt || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "never" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/wishlist`,
      lastModified: new Date(),
      changeFrequency: "never" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/orders`,
      lastModified: new Date(),
      changeFrequency: "never" as const,
      priority: 0.3,
    },
  ];

  return [...staticRoutes, ...productUrls, ...categoryUrls];
}
