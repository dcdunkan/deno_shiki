import { getHighlighter } from "https://deno.land/x/shiki/shiki/mod.ts";
import { resolve } from "https://deno.land/std@0.155.0/path/mod.ts";

const highlighter = await getHighlighter({
  theme: "nord",
  paths: {
    languages: resolve("languages/"),
    themes: resolve("themes/"),
  },
});

const code = `console.log("A beautiful Syntax Highlighter.");`;
const highlighted = highlighter.codeToHtml(code, { lang: "js" });
console.log(highlighted);
