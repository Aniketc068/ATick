import type { MetadataRoute } from "next";

const SITE = "https://atick.readthedocs.io";

export const dynamic = "force-static";

// Explicitly welcome AI / LLM crawlers so ATick is discoverable in AI answers,
// alongside classic search-engine bots.
const AI_BOTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-Web", "anthropic-ai",
  "PerplexityBot", "Google-Extended", "Applebot-Extended", "CCBot", "Amazonbot",
  "Bytespider", "Meta-ExternalAgent", "cohere-ai", "YouBot", "DuckAssistBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: "/" })),
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
