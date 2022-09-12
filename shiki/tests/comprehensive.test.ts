import { themes } from "../themes.ts";
import { getHighlighter } from "../mod.ts";
import { languages } from "../languages.ts";

Deno.test("validates all themes run some JS", async (t) => {
  const highlighter = await getHighlighter({ langs: ["js"] });
  for (const theme of themes) {
    await t.step(theme, async () => {
      await highlighter.loadTheme(theme);
      highlighter.codeToHtml(`console.log('shiki');`, { lang: "js" });
    });
  }
});

Deno.test("validates all languages can show a hello-world", async (t) => {
  const highlighter = await getHighlighter({ theme: "nord" });
  for (const language of languages) {
    await t.step(language.id, () => {
      highlighter.codeToHtml(`console.log('shiki');`, { lang: language.id });
    });
  }
});
