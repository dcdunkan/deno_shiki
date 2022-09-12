import { getHighlighter, renderToHtml } from "../mod.ts";
import { assertEquals } from "./deps.ts";

Deno.test("Customize elements - pre", async () => {
  const highlighter = await getHighlighter({
    theme: "nord",
    langs: ["js"],
  });
  const tokens = highlighter.codeToThemedTokens(`console.log('shiki');`, "js");
  const out = renderToHtml(tokens, {
    fg: highlighter.getForegroundColor("nord"),
    bg: highlighter.getBackgroundColor("nord"),
    elements: {
      pre({ className, style, children }) {
        return `<pre tabindex="1" class="${className}" style="${style}">${children}</pre>`;
      },
    },
  });
  assertEquals(
    out,
    `<pre tabindex="1" class="shiki" style="background-color: #2e3440ff"><code><span class="line"><span style="color: #D8DEE9">console</span><span style="color: #ECEFF4">.</span><span style="color: #88C0D0">log</span><span style="color: #D8DEE9FF">(</span><span style="color: #ECEFF4">&#39;</span><span style="color: #A3BE8C">shiki</span><span style="color: #ECEFF4">&#39;</span><span style="color: #D8DEE9FF">)</span><span style="color: #81A1C1">;</span></span></code></pre>`,
  );
});

Deno.test("Customize elements - code", async () => {
  const highlighter = await getHighlighter({
    theme: "nord",
    langs: ["js"],
  });
  const tokens = highlighter.codeToThemedTokens(`console.log('shiki');`, "js");
  const out = renderToHtml(tokens, {
    fg: highlighter.getForegroundColor("nord"),
    bg: highlighter.getBackgroundColor("nord"),
    elements: {
      code({ children }) {
        return `<code data-copy-text="hello">${children}</code>`;
      },
    },
  });
  assertEquals(
    out,
    `<pre class="shiki" style="background-color: #2e3440ff"><code data-copy-text="hello"><span class="line"><span style="color: #D8DEE9">console</span><span style="color: #ECEFF4">.</span><span style="color: #88C0D0">log</span><span style="color: #D8DEE9FF">(</span><span style="color: #ECEFF4">&#39;</span><span style="color: #A3BE8C">shiki</span><span style="color: #ECEFF4">&#39;</span><span style="color: #D8DEE9FF">)</span><span style="color: #81A1C1">;</span></span></code></pre>`,
  );
});

Deno.test("Customize elements - line", async () => {
  const highlighter = await getHighlighter({
    theme: "nord",
    langs: ["js"],
  });
  const tokens = highlighter.codeToThemedTokens(`console.log('shiki');`, "js");
  const out = renderToHtml(tokens, {
    fg: highlighter.getForegroundColor("nord"),
    bg: highlighter.getBackgroundColor("nord"),
    elements: {
      line({ className, index, children }) {
        return `<span class="${className}"><span class="line-no">${index}</span>${children}</span>`;
      },
    },
  });
  assertEquals(
    out,
    `<pre class="shiki" style="background-color: #2e3440ff"><code><span class="line"><span class="line-no">0</span><span style="color: #D8DEE9">console</span><span style="color: #ECEFF4">.</span><span style="color: #88C0D0">log</span><span style="color: #D8DEE9FF">(</span><span style="color: #ECEFF4">&#39;</span><span style="color: #A3BE8C">shiki</span><span style="color: #ECEFF4">&#39;</span><span style="color: #D8DEE9FF">)</span><span style="color: #81A1C1">;</span></span></code></pre>`,
  );
});

Deno.test("Customize elements - token", async () => {
  const highlighter = await getHighlighter({
    theme: "nord",
    langs: ["js"],
  });
  const tokens = highlighter.codeToThemedTokens(`console.log('shiki');`, "js");
  const out = renderToHtml(tokens, {
    fg: highlighter.getForegroundColor("nord"),
    bg: highlighter.getBackgroundColor("nord"),
    elements: {
      token({ style, token, children }) {
        return `<span data-color="${
          token.color || ""
        }" style="${style}">${children}</span>`;
      },
    },
  });
  assertEquals(
    out,
    `<pre class="shiki" style="background-color: #2e3440ff"><code><span class="line"><span data-color="#D8DEE9" style="color: #D8DEE9">console</span><span data-color="#ECEFF4" style="color: #ECEFF4">.</span><span data-color="#88C0D0" style="color: #88C0D0">log</span><span data-color="#D8DEE9FF" style="color: #D8DEE9FF">(</span><span data-color="#ECEFF4" style="color: #ECEFF4">&#39;</span><span data-color="#A3BE8C" style="color: #A3BE8C">shiki</span><span data-color="#ECEFF4" style="color: #ECEFF4">&#39;</span><span data-color="#D8DEE9FF" style="color: #D8DEE9FF">)</span><span data-color="#81A1C1" style="color: #81A1C1">;</span></span></code></pre>`,
  );
});
