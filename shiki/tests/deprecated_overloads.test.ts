import { getHighlighter } from "../mod.ts";
import { assertEquals } from "./deps.ts";

Deno.test("Nord highlighter highlights simple JavaScript using deprecated codeToHtml(code, lang?, theme?) overload", async () => {
  const highlighter = await getHighlighter({
    theme: "nord",
    langs: ["js"],
  });
  const out = highlighter.codeToHtml(`console.log('shiki');`, "js");
  const snapshot =
    `<pre class="shiki" style="background-color: #2e3440ff"><code><span class="line"><span style="color: #D8DEE9">console</span><span style="color: #ECEFF4">.</span><span style="color: #88C0D0">log</span><span style="color: #D8DEE9FF">(</span><span style="color: #ECEFF4">&#39;</span><span style="color: #A3BE8C">shiki</span><span style="color: #ECEFF4">&#39;</span><span style="color: #D8DEE9FF">)</span><span style="color: #81A1C1">;</span></span></code></pre>`;
  assertEquals(out, snapshot);
});
