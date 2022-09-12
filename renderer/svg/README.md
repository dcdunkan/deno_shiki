<div align="center">

# Shiki: renderer_svg

A SVG renderer for Shiki.

</div>

```ts
import { getHighlighter } from "https://deno.land/x/shiki/shiki/mod.ts";
import { getSVGRenderer } from "https://deno.land/x/shiki/renderer/svg/mod.ts";

const highlighter = await getHighlighter({ theme: "nord" });
const svgRenderer = await getSVGRenderer({
  bg: "#2E3440",
  fontFamily: "IBM Plex Mono",
  fontSize: 14,
});

const code = await Deno.readTextFile("example_code.js");
const tokens = highlighter.codeToThemedTokens(code, "js");
const out = svgRenderer.renderToSVG(tokens);

await Deno.writeTextFile("output.svg", out);
```
