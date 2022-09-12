<div align="center">

# Shiki: renderer_path

A path renderer for Shiki.

</div>

```ts
import { getHighlighter } from "https://deno.land/x/shiki/shiki/mod.ts";
import { getPathRenderer } from "https://deno.land/x/shiki/renderer/path/mod.ts";

const highlighter = await getHighlighter({ theme: "nord" });
const pathRenderer = await getPathRenderer({
  fontSize: 14,
  fontFile: "/path/to/font.ttf",
  bg: "#2E3440",
});

const code = await Deno.readTextFile("example_code.js");
const tokens = highlighter.codeToThemedTokens(code, "js");
const out = pathRenderer.renderToSVG(tokens);

await Deno.writeTextFile("output.svg", out);
```
