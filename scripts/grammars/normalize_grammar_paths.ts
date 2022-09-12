import {
  vscodeGrammarsToRemove,
  vscodeGrammarsToRename,
} from "../grammar_sources.ts";
import { parseJson } from "../utilities/parse.ts";
import { exists } from "../utilities/files.ts";
import {
  fromFileUrl,
  resolve,
} from "https://deno.land/std@0.155.0/path/mod.ts";

const GRAMMAR_FOLDER_PATH = fromFileUrl(
  import.meta.resolve("../../tmp/grammars"),
);

// Remove unneeded grammars
for await (const { name } of Deno.readDir(GRAMMAR_FOLDER_PATH)) {
  const fName = name.replace(/\.tmLanguage.json$/i, "");
  if (vscodeGrammarsToRemove.includes(fName)) {
    const fPath = resolve(GRAMMAR_FOLDER_PATH, name);
    await Deno.remove(fPath);
    console.log(`%cRemoved %c${fPath}`, "color: red", "color: blue");
  }
}

// Rename some grammars
for await (const { name } of Deno.readDir(GRAMMAR_FOLDER_PATH)) {
  const fPath = resolve(GRAMMAR_FOLDER_PATH, name);
  const fName = name.replace(/\.tmLanguage.json$/i, "");
  if (vscodeGrammarsToRename[fName]) {
    const fNewPath = resolve(
      GRAMMAR_FOLDER_PATH,
      vscodeGrammarsToRename[fName] + ".tmLanguage.json",
    );
    await Deno.rename(fPath, fNewPath);
    console.log(
      `%cRenamed %c${name}%c to %c${
        vscodeGrammarsToRename[fName] + ".tmLanguage.json"
      }`,
      "color: red",
      "color: blue",
      "color: none",
      "color: blue",
    );
  }
}

// Make sure each grammar's file name matches its `name` key
for await (const { name } of Deno.readDir(GRAMMAR_FOLDER_PATH)) {
  await normalizeGrammarFile(name);
}

export async function normalizeGrammarFile(f: string) {
  const fPath = resolve(GRAMMAR_FOLDER_PATH, f);
  const fNameWithoutSuffix = f.replace(/\.tmLanguage.json$/i, "");
  const fName = fNameWithoutSuffix.toLowerCase();

  if (await exists(fPath)) {
    const parsedContent = parseJson(await Deno.readTextFile(fPath));

    if (parsedContent.name !== fName) {
      parsedContent.name = fName;
      await Deno.writeTextFile(fPath, JSON.stringify(parsedContent, null, 2));
      console.log(
        `%cNormalized%c ${f}'s \`name\` to %c${fName}`,
        "color: green",
        "color: none",
        "color: yellow",
      );
    }
    if (fNameWithoutSuffix !== fNameWithoutSuffix.toLowerCase()) {
      const fNewPath = resolve(
        GRAMMAR_FOLDER_PATH,
        fNameWithoutSuffix.toLowerCase() + ".tmLanguage.json",
      );
      await Deno.rename(fPath, fNewPath);
      console.log(
        `%cRenamed %c${f}%c to %c${f.toLowerCase()}`,
        "color: red",
        "color: blue",
        "color: none",
        "color: blue",
      );
    }
  }
}
