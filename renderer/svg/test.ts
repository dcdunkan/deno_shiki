import { getSVGRenderer } from "./mod.ts";
import { assertStringIncludes } from "https://deno.land/std@0.155.0/testing/asserts.ts";

Deno.test("SVG renderer should generate SVG with correct style attributes", async () => {
  const r = await getSVGRenderer({
    fontFamily: "IBM Plex Mono",
  });

  const out = r.renderToSVG([[{ content: "foo", color: "#aabbccff" }]]);
  // 0x40 = 64, 0xff = 256. 64/256 = 0.25

  assertStringIncludes(out, 'opacity="1"');
  assertStringIncludes(out, 'font-family="IBM Plex Mono"');
});

Deno.test("SVG can have 0 corner radius", async () => {
  const r = await getSVGRenderer({
    fontFamily: "IBM Plex Mono",
    bgCornerRadius: 0,
  });

  const out = r.renderToSVG([[{ content: "foo", color: "#aabbccff" }]]);
  assertStringIncludes(out, 'rx="0"');
});

Deno.test(`SVG renderer should default to minimal background width correctly`, async () => {
  const r = await getSVGRenderer({
    fontFamily: "IBM Plex Mono",
    bgMinWidth: 180,
  });

  const out = r.renderToSVG([[{ content: "foo", color: "#aabbccff" }]]);
  assertStringIncludes(out, `<svg viewBox="0 0 180 `);
});

Deno.test(`SVG renderer should ignore minimal background width when it's own boundaries are above that`, async () => {
  const r = await getSVGRenderer({
    fontFamily: "IBM Plex Mono",
    bgMinWidth: 150,
  });

  const out = r.renderToSVG([[{ content: "foo", color: "#aabbccff" }]]);
  assertStringIncludes(out, `<svg viewBox="0 0 156.4921875 `);
});
