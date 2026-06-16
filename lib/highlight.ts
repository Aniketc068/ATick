import { codeToHtml } from "shiki";

// VS Code "Dark+" theme — exactly the colors VS Code shows.
const THEME = "dark-plus";

const LANG_MAP: Record<string, string> = {
  python: "python",
  java: "java",
  dotnet: "csharp",
  node: "javascript",
  php: "php",
  bash: "bash",
  json: "json",
};

export async function highlight(code: string, lang: string): Promise<string> {
  const shikiLang = LANG_MAP[lang] ?? lang;
  return codeToHtml(code, {
    lang: shikiLang,
    theme: THEME,
    transformers: [
      {
        // strip Shiki's inline bg so our wrapper controls it
        pre(node) {
          node.properties.style = (node.properties.style as string)?.replace(/background-color:[^;]+;?/, "");
        },
      },
    ],
  });
}
