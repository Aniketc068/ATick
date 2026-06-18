import type { MetadataRoute } from "next";

const SITE = "https://atick.readthedocs.io";

export const dynamic = "force-static";

const LANGS = ["python", "java", "dotnet", "node", "php"];
const SECTIONS = ["", "quickstart", "install", "signing", "pades", "appearance", "certification", "esign", "api"];

export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/about/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/compare/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/license/`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/license/agpl/`, changeFrequency: "yearly", priority: 0.4 },
  ];
  for (const lang of LANGS) {
    for (const sec of SECTIONS) {
      urls.push({
        url: `${SITE}/docs/${lang}/${sec ? sec + "/" : ""}`,
        changeFrequency: "weekly",
        priority: sec === "" ? 0.9 : 0.7,
      });
    }
  }
  return urls;
}
