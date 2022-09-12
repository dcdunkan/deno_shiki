import { getHighlighter } from "../../mod.ts";
import { assertEquals, fromFileUrl } from "../deps.ts";

function currentDirPath(p: string) {
  return fromFileUrl(import.meta.resolve(p));
}

Deno.test("Highlights custom language - Rockstar", async () => {
  const highlighter = await getHighlighter({
    theme: "nord",
    langs: [
      {
        id: "rockstar",
        scopeName: "source.rockstar",
        path: currentDirPath("./rockstar.tmLanguage.json"),
        aliases: [],
      },
    ],
  });

  const code = await Deno.readTextFile(currentDirPath("./rockstar.rock"));
  const out = highlighter.codeToHtml(code, { lang: "rockstar" });
  assertEquals(
    out,
    `<pre class="shiki" style="background-color: #2e3440ff"><code><span class="line"><span style="color: #81A1C1">Shiki</span><span style="color: #D8DEE9FF"> </span><span style="color: #81A1C1">is</span><span style="color: #D8DEE9FF"> </span><span style="color: #A3BE8C">&quot;a beautiful Syntax Highlighter&quot;</span></span></code></pre>`,
  );
});

Deno.test("Multiple custom language registrations should use last one", async () => {
  const highlighter = await getHighlighter({
    theme: "nord",
    langs: [
      {
        id: "rockstar",
        scopeName: "source.rockstar",
        path: currentDirPath("./rockstar.tmLanguage.json"),
        aliases: [],
      },
      {
        id: "rockstar",
        scopeName: "source.rockstar",
        path: currentDirPath("./rockstar-override.tmLanguage.json"),
        aliases: [],
      },
    ],
  });

  const code = await Deno.readTextFile(currentDirPath("./rockstar.rock"));
  const out = highlighter.codeToHtml(code, { lang: "rockstar" });
  assertEquals(
    out,
    `<pre class="shiki" style="background-color: #2e3440ff"><code><span class="line"><span style="color: #81A1C1">Shiki</span><span style="color: #D8DEE9FF"> </span><span style="color: #81A1C1">is</span><span style="color: #D8DEE9FF"> </span><span style="color: #B48EAD">&quot;a beautiful Syntax Highlighter&quot;</span></span></code></pre>`,
  );
});

Deno.test("Custom language registration can override builtin language", async () => {
  const highlighter = await getHighlighter({
    theme: "nord",
    langs: [
      {
        id: "html",
        scopeName: "text.html.basic",
        path: currentDirPath("./rockstar-html.tmLanguage.json"),
        aliases: [],
      },
    ],
  });

  const code = await Deno.readTextFile(currentDirPath("./rockstar.rock"));
  const out = highlighter.codeToHtml(code, { lang: "html" });
  assertEquals(
    out,
    `<pre class="shiki" style="background-color: #2e3440ff"><code><span class="line"><span style="color: #81A1C1">Shiki</span><span style="color: #D8DEE9FF"> </span><span style="color: #81A1C1">is</span><span style="color: #D8DEE9FF"> </span><span style="color: #B48EAD">&quot;a beautiful Syntax Highlighter&quot;</span></span></code></pre>`,
  );
});
