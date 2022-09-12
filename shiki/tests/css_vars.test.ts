import { getHighlighter } from "../mod.ts";
import { assertEquals } from "./deps.ts";

Deno.test("The theme with css-variables renders correctly", async () => {
  const highlighter = await getHighlighter({
    theme: "css-variables",
    langs: ["js"],
  });

  const kindOfAQuine = `
import { getHighlighter } from '../index'

test('The theme with css-variables renders correctly', async () => {
  const highlighter = await getHighlighter({
    theme: 'css-variables'
  })
  const out = highlighter.codeToHtml("console.log('shiki');", 'js')
  expect(out).toMatchSnapshot()
})
`;

  const snapshot =
    `<pre class="shiki" style="background-color: var(--shiki-color-background)"><code><span class="line"></span>
<span class="line"><span style="color: var(--shiki-token-keyword)">import</span><span style="color: var(--shiki-color-text)"> { getHighlighter } </span><span style="color: var(--shiki-token-keyword)">from</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">&#39;../index&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color: var(--shiki-token-function)">test</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">&#39;The theme with css-variables renders correctly&#39;</span><span style="color: var(--shiki-token-punctuation)">,</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">async</span><span style="color: var(--shiki-color-text)"> () </span><span style="color: var(--shiki-token-keyword)">=&gt;</span><span style="color: var(--shiki-color-text)"> {</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">  </span><span style="color: var(--shiki-token-keyword)">const</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">highlighter</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">=</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">await</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-function)">getHighlighter</span><span style="color: var(--shiki-color-text)">({</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">    theme</span><span style="color: var(--shiki-token-keyword)">:</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">&#39;css-variables&#39;</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">  })</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">  </span><span style="color: var(--shiki-token-keyword)">const</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">out</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-keyword)">=</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-constant)">highlighter</span><span style="color: var(--shiki-token-function)">.codeToHtml</span><span style="color: var(--shiki-color-text)">(</span><span style="color: var(--shiki-token-string-expression)">&quot;console.log(&#39;shiki&#39;);&quot;</span><span style="color: var(--shiki-token-punctuation)">,</span><span style="color: var(--shiki-color-text)"> </span><span style="color: var(--shiki-token-string-expression)">&#39;js&#39;</span><span style="color: var(--shiki-color-text)">)</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">  </span><span style="color: var(--shiki-token-function)">expect</span><span style="color: var(--shiki-color-text)">(out)</span><span style="color: var(--shiki-token-function)">.toMatchSnapshot</span><span style="color: var(--shiki-color-text)">()</span></span>
<span class="line"><span style="color: var(--shiki-color-text)">})</span></span>
<span class="line"></span></code></pre>`;

  const out = highlighter.codeToHtml(kindOfAQuine, { lang: "js" });
  assertEquals(out, snapshot);
});
