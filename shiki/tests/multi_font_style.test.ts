import { getHighlighter } from "../mod.ts";
import { assertEquals } from "./deps.ts";

Deno.test("Handle multiple font styles", async () => {
  const highlighter = await getHighlighter({
    theme: "material-default",
    langs: ["md"],
  });
  const out = highlighter.codeToHtml(`***bold italic***`, { lang: "md" });
  assertEquals(
    out,
    `<pre class="shiki" style="background-color: #263238"><code><span class="line"><span style="color: #89DDFF; font-style: italic">**</span><span style="color: #89DDFF; font-style: italic">*</span><span style="color: #F07178; font-style: italic">bold italic</span><span style="color: #89DDFF; font-style: italic">*</span><span style="color: #89DDFF; font-style: italic">**</span></span></code></pre>`,
  );
});
