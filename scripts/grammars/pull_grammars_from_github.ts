import { githubGrammarSources } from "../grammar_sources.ts";
import { parseJson } from "../utilities/parse.ts";
import { downloadFromGH } from "../utilities/download_github.ts";
import { load } from "https://esm.sh/js-yaml@4.1.0";
import { parse as plistParse } from "https://esm.sh/fast-plist@0.1.2";
import {
  fromFileUrl,
  resolve,
} from "https://deno.land/std@0.155.0/path/mod.ts";

const GRAMMAR_FOLDER_PATH = fromFileUrl(
  import.meta.resolve("../../tmp/grammars"),
);

for (const [name, url] of githubGrammarSources) {
  const outPath = resolve(
    GRAMMAR_FOLDER_PATH,
    name + ".tmLanguage.json",
  );
  await downloadFromGH(
    url,
    "grammar",
    (content) => {
      let contentObj;
      if (url.endsWith(".json")) {
        contentObj = parseJson(content);
      } else if (url.endsWith(".plist")) {
        contentObj = plistParse(content);
      } else if (url.endsWith(".yml") || url.endsWith(".yaml")) {
        contentObj = load(content);
      } else {
        if (content[0] === "{") {
          contentObj = parseJson(content);
        } else if (content[0] === "<") {
          contentObj = plistParse(content);
        } else {
          contentObj = load(content);
        }
      }

      contentObj["name"] = name;
      return contentObj;
    },
    outPath,
  );
}
