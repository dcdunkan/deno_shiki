import { getSVGRenderer } from "./mod.ts";
import { getHighlighter } from "../../shiki/mod.ts";

const highlighter = await getHighlighter({ theme: "nord" });
const svgRenderer = await getSVGRenderer({
  bg: "#2E3440",
  fontFamily: {
    name: "Inconsolata",
    cssURL: "https://fonts.googleapis.com/css2?family=Inconsolata&display=swap",
  },
  fontSize: 14,
});

const tokens = highlighter.codeToThemedTokens(`console.log("finally");`, "js");
const out = svgRenderer.renderToSVG(tokens);
Deno.writeTextFileSync("example.svg", out);
