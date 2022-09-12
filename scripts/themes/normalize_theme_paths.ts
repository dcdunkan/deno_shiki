import {
  fromFileUrl,
  resolve,
} from "https://deno.land/std@0.155.0/path/mod.ts";
import {
  vscodeThemesToRemove,
  vscodeThemesToRename,
} from "../themes_sources.ts";
import { exists } from "../utilities/files.ts";
import { parseJson } from "../utilities/parse.ts";

const THEME_FOLDER_PATH = fromFileUrl(import.meta.resolve("../../tmp/themes"));

// Remove unneeded themes
for await (const { name } of Deno.readDir(THEME_FOLDER_PATH)) {
  const fName = name.replace(/\.json$/i, "");
  if (vscodeThemesToRemove.includes(fName)) {
    const fPath = resolve(THEME_FOLDER_PATH, name);
    await Deno.remove(fPath);
    console.log(`%cRemoved %c${fPath}`, "color: red", "color: blue");
  }
}

// Rename some themes
for await (const { name } of Deno.readDir(THEME_FOLDER_PATH)) {
  const fPath = resolve(THEME_FOLDER_PATH, name);
  const fName = name.replace(/\.json$/i, "");
  if (vscodeThemesToRename[fName]) {
    const fNewPath = resolve(
      THEME_FOLDER_PATH,
      vscodeThemesToRename[fName] + ".json",
    );
    await Deno.rename(fPath, fNewPath);
    console.log(
      `%cRenamed %c${name}%c to %c${vscodeThemesToRename[fName] + ".json"}`,
      "color: red",
      "color: blue",
      "color: none",
      "color: blue",
    );
  }
}

/**
 * - Make sure each theme's file name matches its `name` key
 */
for await (const { name } of Deno.readDir(THEME_FOLDER_PATH)) {
  await normalizeThemeFile(name);
}

/**
 * - Make sure each theme's file name matches its `name` key
 */
export async function normalizeThemeFile(f: string) {
  const fPath = resolve(THEME_FOLDER_PATH, f);
  const fNameWithoutSuffix = f.replace(/\.json$/i, "");
  const fName = fNameWithoutSuffix.toLowerCase();
  if (await exists(fPath)) {
    const parsedContent = parseJson(await Deno.readTextFile(fPath));
    if (!parsedContent.name || parsedContent.name !== fName) {
      parsedContent.name = fName;
      await Deno.writeTextFile(fPath, JSON.stringify(parsedContent, null, 2));
      console.log(
        `%cRenamed %c${f}%c to %c${fName}`,
        "color: red",
        "color: blue",
        "color: none",
        "color: blue",
      );
    }
  }
}
