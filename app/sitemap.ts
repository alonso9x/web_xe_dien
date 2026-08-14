import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

export const revalidate = 86400;

const baseUrl = "https://xedienminhanh.vn";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticLastModified = new Date("2026-08-14");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: staticLastModified, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/dimoon`, lastModified: staticLastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/dina`, lastModified: staticLastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/eiko`, lastModified: staticLastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/fancy`, lastModified: staticLastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/hazel`, lastModified: staticLastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/shine`, lastModified: staticLastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/sweetea`, lastModified: staticLastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/walkmen`, lastModified: staticLastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/wespan-pro`, lastModified: staticLastModified, changeFrequency: "weekly", priority: 0.9 },
  ];

  const newsIndexRoute: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/tin-tuc`,
      lastModified: staticLastModified,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  let newsRoutes: MetadataRoute.Sitemap = [];

  try {
    const filePath = path.join(process.cwd(), "public", "newsData.json");

    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(fileContents);
      const rawItems = Array.isArray(data) ? data : [data];

      newsRoutes = rawItems
        .filter((article: any) => article?.id)
        .map((article: any) => ({
          url: `${baseUrl}/tin-tuc/${article.slug || article.id}`,
          lastModified: new Date(
            article.updatedAt ?? article.createdAt ?? staticLastModified
          ),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }));
    }
  } catch (error) {
    console.error("Lỗi đồng bộ Sitemap từ newsData.json:", error);
  }

  return [...staticRoutes, ...newsIndexRoute, ...newsRoutes];
}