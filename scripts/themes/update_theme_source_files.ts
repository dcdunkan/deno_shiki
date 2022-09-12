import { fromFileUrl } from "https://deno.land/std@0.155.0/path/mod.ts";

const themeDir = fromFileUrl(
  import.meta.resolve("../../themes"),
);
const themePath = fromFileUrl(
  import.meta.resolve("../../shiki/themes.ts"),
);
const themeIds: string[] = [];
for await (const { name } of Deno.readDir(themeDir)) {
  themeIds.push(name.replace(".json", ""));
}

const themeContent = `export type Theme =
${themeIds.map((id) => `  | '${id}'`).join("\n")}

export const themes: Theme[] = [
${themeIds.map((id) => `  '${id}'`).join(",\n")}
]
`;

await Deno.writeTextFile(themePath, themeContent);
