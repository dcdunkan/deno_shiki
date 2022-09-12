import type { IThemedToken } from "../../shiki/mod.ts";
import { getPathRenderer } from "./mod.ts";
import { assertEquals } from "https://deno.land/std@0.155.0/testing/asserts.ts";

Deno.test("Path Renderer", async (t) => {
  const tokens: IThemedToken[][] = [
    [
      {
        content: "const",
        color: "#81A1C1",
        fontStyle: 0,
      },
      {
        content: " ",
        color: "#D8DEE9FF",
        fontStyle: 0,
      },
      {
        content: "fs",
        color: "#D8DEE9",
        fontStyle: 0,
      },
      {
        content: " ",
        color: "#D8DEE9FF",
        fontStyle: 0,
      },
      {
        content: "=",
        color: "#81A1C1",
        fontStyle: 0,
      },
      {
        content: " ",
        color: "#D8DEE9FF",
        fontStyle: 0,
      },
      {
        content: "require",
        color: "#88C0D0",
        fontStyle: 0,
      },
      {
        content: "(",
        color: "#D8DEE9FF",
        fontStyle: 0,
      },
      {
        content: "'",
        color: "#ECEFF4",
        fontStyle: 0,
      },
      {
        content: "fs",
        color: "#A3BE8C",
        fontStyle: 0,
      },
      {
        content: "'",
        color: "#ECEFF4",
        fontStyle: 0,
      },
      {
        content: ")",
        color: "#D8DEE9FF",
        fontStyle: 0,
      },
    ],
    [
      {
        content: "const",
        color: "#81A1C1",
        fontStyle: 0,
      },
      {
        content: " ",
        color: "#D8DEE9FF",
        fontStyle: 0,
      },
      {
        content: "shiki",
        color: "#D8DEE9",
        fontStyle: 0,
      },
      {
        content: " ",
        color: "#D8DEE9FF",
        fontStyle: 0,
      },
      {
        content: "=",
        color: "#81A1C1",
        fontStyle: 0,
      },
      {
        content: " ",
        color: "#D8DEE9FF",
        fontStyle: 0,
      },
      {
        content: "require",
        color: "#88C0D0",
        fontStyle: 0,
      },
      {
        content: "(",
        color: "#D8DEE9FF",
        fontStyle: 0,
      },
      {
        content: "'",
        color: "#ECEFF4",
        fontStyle: 0,
      },
      {
        content: "shiki",
        color: "#A3BE8C",
        fontStyle: 0,
      },
      {
        content: "'",
        color: "#ECEFF4",
        fontStyle: 0,
      },
      {
        content: ")",
        color: "#D8DEE9FF",
        fontStyle: 0,
      },
    ],
  ];

  const renderer = await getPathRenderer({
    fontFile: import.meta.resolve("./Fira Code.woff"),
    fontSize: 14,
    bg: "#000",
  });
  const out = renderer.renderToSVG(tokens);
  const tempSVGFile = await Deno.makeTempFile();
  await Deno.writeTextFile(tempSVGFile, out);

  await t.step(
    "should generate same SVG with different loading font ways",
    async () => {
      const renderer = await getPathRenderer({
        fontFile: import.meta.resolve("./Fira Code.woff"),
        fontSize: 14,
        bg: "#000",
      });

      const fontFile = await fetch(import.meta.resolve("./Fira Code.woff"));

      const rendererByBuffer = await getPathRenderer({
        fontFile: await fontFile.arrayBuffer(),
        fontSize: 14,
        bg: "#000",
      });
      const out = renderer.renderToSVG(tokens);
      const out2 = rendererByBuffer.renderToSVG(tokens);
      assertEquals(out, out2);
    },
  );

  await t.step("should generate tokens to paths", async () => {
    const renderer = await getPathRenderer({
      fontFile: import.meta.resolve("./Fira Code.woff"),
      fontSize: 14,
      bg: "#000",
    });
    const out = renderer.renderToSVG(tokens);
    const tokensCount = tokens.flat().length;
    assertEquals(out.match(/<path/g)?.length, tokensCount);
  });

  await Deno.remove(tempSVGFile);
});
