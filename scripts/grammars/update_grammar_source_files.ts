import { exists } from "../utilities/files.ts";
import {
  fromFileUrl,
  resolve,
} from "https://deno.land/std@0.155.0/path/mod.ts";
import {
  embeddedLanguagesToExclude,
  languageAliases,
} from "../grammar_sources.ts";
import { parseJson } from "../utilities/parse.ts";

const langDir = fromFileUrl(import.meta.resolve("../../languages"));
const sampleDir = fromFileUrl(import.meta.resolve("../../samples"));
const langPath = fromFileUrl(import.meta.resolve("../../shiki/languages.ts"));

// Regex to quickly see if a grammar uses `include` keys to embed other languages
const INCLUDE_REGEX = /"include": "([^#$].+)"/g;

const langIds: string[] = [];
for await (const { name } of Deno.readDir(langDir)) {
  langIds.push(name.replace(".tmLanguage.json", ""));
}
const scopeToIdMap: Record<string, string> = {};
langIds
  .filter((id) => !embeddedLanguagesToExclude.includes(id))
  .map(async (id) => {
    const grammarPath = resolve(langDir, `${id}.tmLanguage.json`);
    const grammarSrc = await Deno.readTextFile(grammarPath);
    const grammar = parseJson(grammarSrc);
    scopeToIdMap[grammar.scopeName] = id;
  });

const langRegistrationContent = langIds
  .filter((id) => !embeddedLanguagesToExclude.includes(id))
  .map(async (id) => {
    const grammarPath = resolve(langDir, `${id}.tmLanguage.json`);
    const grammarSrc = await Deno.readTextFile(grammarPath);
    const grammar = parseJson(grammarSrc);

    let regContent = `  {
    id: '${id}',
    scopeName: '${grammar.scopeName}',
    path: '${id}.tmLanguage.json'`;

    if (await exists(resolve(sampleDir, `${id}.sample`))) {
      regContent += `,
    samplePath: '${id}.sample'`;
    }

    if (languageAliases[id]) {
      const aliasStr = languageAliases[id].map((a) => `'` + a + `'`).join(", ");
      regContent += `,\n    aliases: [${aliasStr}]`;
    }

    const embeddedLangs = new Set();
    [...grammarSrc.matchAll(INCLUDE_REGEX)].forEach(([_, captured]) => {
      const scope = captured.split("#")[0];
      if (
        !grammar.scopeName ||
        (grammar.scopeName && scope !== grammar.scopeName)
      ) {
        if (scopeToIdMap[scope]) {
          embeddedLangs.add(scopeToIdMap[scope]);
        }
      }
    });
    if (embeddedLangs.size > 0) {
      regContent += `,
    embeddedLangs: [${
        [...embeddedLangs].map((id) => `'` + id + `'`).join(", ")
      }]`;
    }

    regContent += `
  }`;

    return regContent;
  })
  .join(",\n");

const langContent = `import { ILanguageRegistration } from "./types.ts;"

export type Lang =
${
  langIds
    .filter((id) => !embeddedLanguagesToExclude.includes(id))
    .map((id) => {
      if (!languageAliases[id]) {
        return `  | '${id}'`;
      }

      const baseContent = `  | '${id}'`;
      const aliasesContent = languageAliases[id].map((l) => `'` + l + `'`).join(
        " | ",
      );
      return `${baseContent} | ${aliasesContent}`;
    })
    .join("\n")
}

export const languages: ILanguageRegistration[] = [
${langRegistrationContent}
]
`;

await Deno.writeTextFile(langPath, langContent);
