import {
  fromFileUrl,
  resolve,
} from "https://deno.land/std@0.155.0/path/mod.ts";
import { githubThemeSources } from "../themes_sources.ts";
import { parseJson } from "../utilities/parse.ts";
import { downloadFromGH } from "../utilities/download_github.ts";

const THEME_FOLDER_PATH = fromFileUrl(import.meta.resolve("../../tmp/themes"));

for (const [name, url] of githubThemeSources) {
  const outPath = resolve(THEME_FOLDER_PATH, name + ".json");
  await downloadFromGH(
    url,
    "theme",
    (content) => parseJson(content),
    outPath,
  );
}
