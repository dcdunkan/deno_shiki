import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

function measureFont([fontName, fontSize]: [string, number]) {
  // Measure `M` for width
  // @ts-ignore This function is executed inside puppeteer.
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;
  ctx.font = `${fontSize}px "${fontName}"`;

  const capMMeasurement = ctx.measureText("M");

  /**
   * Measure A-Z, a-z for height
   * A - 65
   * Z - 90
   * a - 97
   * z - 122
   */
  const characters = [];
  for (let i = 65; i <= 90; i += 1) {
    characters.push(String.fromCharCode(i));
  }
  for (let i = 97; i <= 122; i += 1) {
    characters.push(String.fromCharCode(i));
  }

  let highestAscent = 0;
  let lowestDescent = 0;
  characters.forEach((char) => {
    const m = ctx.measureText(char);
    if (m.actualBoundingBoxAscent > highestAscent) {
      highestAscent = m.actualBoundingBoxAscent;
    }
    if (m.actualBoundingBoxDescent > lowestDescent) {
      lowestDescent = m.actualBoundingBoxDescent;
    }
  });

  return {
    width: capMMeasurement.width,
    height: highestAscent + lowestDescent,
  };
}

const getDocument = (fontName: string, url: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    @import url(${url});
    body { font-family: '${fontName}'; }
  </style>
</head>
<body>
<p>Test</p>
</body>
</html>
`;
};

export async function measureMonospaceTypeface(
  fontNameStr: string,
  fontSize: number,
  remoteFontCSSURL?: string,
): Promise<{ width: number; height: number }> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  if (remoteFontCSSURL) {
    await page.goto(
      `data:text/html,${getDocument(fontNameStr, remoteFontCSSURL)}`,
      {
        waitUntil: "networkidle2",
      },
    );

    const measurement = await page.evaluate(measureFont, [
      fontNameStr,
      fontSize,
    ] as [string, number]);
    await browser.close();
    return measurement as { width: number; height: number };
  }
  const measurement = await page.evaluate(measureFont, [
    fontNameStr,
    fontSize,
  ] as [string, number]);

  await browser.close();

  return measurement as { width: number; height: number };
}
