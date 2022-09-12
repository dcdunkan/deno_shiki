import { getHighlighter } from "../mod.ts";
import { assertEquals } from "./deps.ts";

Deno.test("applies class to a single line", async () => {
  const highlighter = await getHighlighter({
    theme: "css-variables",
    langs: ["js"],
  });

  const code = `
console.log('line 1');
console.log('line 2');
`.trim();

  const html = highlighter.codeToHtml(code, {
    lang: "js",
    lineOptions: [{ line: 1, classes: ["highlighted"] }],
  });
  assertEquals(
    html,
    `<pre class="shiki" style="background-color: var(--shiki-color-background)"><code><span class="line highlighted"><span style="color: var(--shiki-token-constant)">console</span><span style="color: var(--shiki-token-function)">.log</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">&#39;line 1&#39;</span><span style="color: var(--shiki-color-text)">);</span></span>
<span class="line"><span style="color: var(--shiki-token-constant)">console</span><span style="color: var(--shiki-token-function)">.log</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">&#39;line 2&#39;</span><span style="color: var(--shiki-color-text)">);</span></span></code></pre>`,
  );
});

Deno.test("splits plaintext into lines", async () => {
  const highlighter = await getHighlighter({
    theme: "css-variables",
  });

  const code = `
lorem ipsum
dolor sit amet
`.trim();

  const html = highlighter.codeToHtml(code, {
    lang: "txt",
    lineOptions: [{ line: 1, classes: ["highlighted"] }],
  });
  assertEquals(
    html,
    `<pre class="shiki" style="background-color: var(--shiki-color-background)"><code><span class="line highlighted"><span style="color: var(--shiki-color-text)">lorem ipsum</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">dolor sit amet</span></span></code></pre>`,
  );
});

Deno.test("applies different classes to different lines", async () => {
  const highlighter = await getHighlighter({
    theme: "css-variables",
    langs: ["js"],
  });

  const code = `
console.log('line 1');
console.log('line 2');
console.log('line 3');
console.log('line 4');
console.log('line 5');
`.trim();

  const html = highlighter.codeToHtml(code, {
    lang: "js",
    lineOptions: [
      { line: 1, classes: ["class-foo"] },
      { line: 3, classes: ["class-bar"] },
      { line: 4, classes: ["class-baz"] },
    ],
  });
  assertEquals(
    html,
    `<pre class="shiki" style="background-color: var(--shiki-color-background)"><code><span class="line class-foo"><span style="color: var(--shiki-token-constant)">console</span><span style="color: var(--shiki-token-function)">.log</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">&#39;line 1&#39;</span><span style="color: var(--shiki-color-text)">);</span></span>
<span class="line"><span style="color: var(--shiki-token-constant)">console</span><span style="color: var(--shiki-token-function)">.log</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">&#39;line 2&#39;</span><span style="color: var(--shiki-color-text)">);</span></span>
<span class="line class-bar"><span style="color: var(--shiki-token-constant)">console</span><span style="color: var(--shiki-token-function)">.log</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">&#39;line 3&#39;</span><span style="color: var(--shiki-color-text)">);</span></span>
<span class="line class-baz"><span style="color: var(--shiki-token-constant)">console</span><span style="color: var(--shiki-token-function)">.log</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">&#39;line 4&#39;</span><span style="color: var(--shiki-color-text)">);</span></span>
<span class="line"><span style="color: var(--shiki-token-constant)">console</span><span style="color: var(--shiki-token-function)">.log</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">&#39;line 5&#39;</span><span style="color: var(--shiki-color-text)">);</span></span></code></pre>`,
  );
});

Deno.test("deduplicates classes per line", async () => {
  const highlighter = await getHighlighter({
    theme: "css-variables",
    langs: ["js"],
  });

  const code = `
console.log('line 1');
console.log('line 2');
`.trim();

  const html = highlighter.codeToHtml(code, {
    lang: "js",
    lineOptions: [
      { line: 1, classes: ["highlighted"] },
      { line: 1, classes: ["highlighted"] },
    ],
  });
  assertEquals(
    html,
    `<pre class="shiki" style="background-color: var(--shiki-color-background)"><code><span class="line highlighted"><span style="color: var(--shiki-token-constant)">console</span><span style="color: var(--shiki-token-function)">.log</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">&#39;line 1&#39;</span><span style="color: var(--shiki-color-text)">);</span></span>
<span class="line"><span style="color: var(--shiki-token-constant)">console</span><span style="color: var(--shiki-token-function)">.log</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">&#39;line 2&#39;</span><span style="color: var(--shiki-color-text)">);</span></span></code></pre>`,
  );
});

Deno.test("ignores line numbers out of range", async () => {
  const highlighter = await getHighlighter({
    theme: "css-variables",
    langs: ["js"],
  });

  const code = `
console.log('line 1');
console.log('line 2');
console.log('line 3');
`.trim();

  const html = highlighter.codeToHtml(code, {
    lang: "js",
    lineOptions: [
      { line: -1, classes: ["highlighted"] },
      { line: 0, classes: ["highlighted"] },
      { line: 2, classes: ["highlighted"] },
      { line: 4, classes: ["highlighted"] },
      { line: 5, classes: ["highlighted"] },
    ],
  });
  assertEquals(
    html,
    `<pre class="shiki" style="background-color: var(--shiki-color-background)"><code><span class="line"><span style="color: var(--shiki-token-constant)">console</span><span style="color: var(--shiki-token-function)">.log</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">&#39;line 1&#39;</span><span style="color: var(--shiki-color-text)">);</span></span>
<span class="line highlighted"><span style="color: var(--shiki-token-constant)">console</span><span style="color: var(--shiki-token-function)">.log</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">&#39;line 2&#39;</span><span style="color: var(--shiki-color-text)">);</span></span>
<span class="line"><span style="color: var(--shiki-token-constant)">console</span><span style="color: var(--shiki-token-function)">.log</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">&#39;line 3&#39;</span><span style="color: var(--shiki-color-text)">);</span></span></code></pre>`,
  );
});
