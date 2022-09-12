import { getHighlighter } from "../mod.ts";
import { assertStringNotIncludes } from "./deps.ts";

Deno.test(`Token with no color shouldn't generate color: undefined`, async () => {
  const highlighter = await getHighlighter({
    theme: "monokai",
    langs: ["js"],
  });
  const out = highlighter.codeToHtml(`whatever`, { lang: "txt" });
  assertStringNotIncludes(out, "undefined");
});
