import { parseJson } from "../utilities/parse.ts";
import { exists } from "../utilities/files.ts";
import {
  fromFileUrl,
  resolve,
} from "https://deno.land/std@0.155.0/path/mod.ts";
const THEME_FOLDER_PATH = fromFileUrl(import.meta.resolve("../../tmp/themes"));

async function readJsonC(f: string) {
  const p = resolve(THEME_FOLDER_PATH, f);
  if (!await exists(p)) {
    return undefined;
  }
  return parseJson(await Deno.readTextFile(p));
}

/**
 * Handle dark/light plus
 *
 * - Merge dark_vs into dark_plus
 * - Merge light_vs into light_plus
 * - Unshift `editor.foreground` and `editor.background` to beginning of `tokenColors`.
 * - Remove dark_vs and light_vs
 */
const darkVSContent = await readJsonC("dark_vs.json");
const darkPlusContent = await readJsonC("dark_plus.json");

if (darkVSContent && darkPlusContent) {
  delete darkPlusContent["include"];
  const darkDefaultFgBgTokenColor = {
    settings: {
      foreground: darkVSContent["colors"]["editor.foreground"],
    },
  };
  darkPlusContent.name = "dark-plus";
  darkPlusContent.colors = { ...darkVSContent.colors };
  darkPlusContent.tokenColors = [
    darkDefaultFgBgTokenColor,
    ...darkVSContent.tokenColors,
    ...darkPlusContent.tokenColors,
  ];
  darkPlusContent.semanticTokenColors = {
    ...darkVSContent.semanticTokenColors,
    ...darkPlusContent.semanticTokenColors,
  };

  await Deno.writeTextFile(
    resolve(THEME_FOLDER_PATH, "dark_plus.json"),
    JSON.stringify(darkPlusContent, null, 2),
  );
}

const lightVSContent = await readJsonC("light_vs.json");
const lightPlusContent = await readJsonC("light_plus.json");

if (lightVSContent && lightPlusContent) {
  delete lightPlusContent["include"];
  const lightDefaultFgBgTokenColor = {
    settings: {
      foreground: lightVSContent["colors"]["editor.foreground"],
    },
  };
  lightPlusContent.name = "light-plus";
  lightPlusContent.colors = { ...lightVSContent.colors };
  lightPlusContent.tokenColors = [
    lightDefaultFgBgTokenColor,
    ...lightVSContent.tokenColors,
    ...lightPlusContent.tokenColors,
  ];
  lightPlusContent.semanticTokenColors = {
    ...lightVSContent.semanticTokenColors,
    ...lightPlusContent.semanticTokenColors,
  };

  await Deno.writeTextFile(
    resolve(THEME_FOLDER_PATH, "light_plus.json"),
    JSON.stringify(lightPlusContent, null, 2),
  );
}
