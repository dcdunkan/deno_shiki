import { resolve } from "https://deno.land/std@0.155.0/path/mod.ts";

let transformed = 0;
const SNAPSHOT_DIR_PATH = Deno.args[0];

console.log("Transforming...");
for await (const entry of Deno.readDir(SNAPSHOT_DIR_PATH)) {
  if (entry.isFile) {
    const path = resolve(SNAPSHOT_DIR_PATH, entry.name);
    const content = await Deno.readTextFile(path);
    const modified = content.split("\n").slice(2).join("\n")
      .replace(/exports\[`(.+?)`\] = `(.+?)`;/gs, '"$1": `$2`,');
    const toWrite = `export const snapshots = {${modified}};`;
    const filename = entry.name.split(".").slice(0, 2).join(".") + ".snap.ts";
    const writePath = resolve(SNAPSHOT_DIR_PATH, filename);
    await Deno.writeTextFile(writePath, toWrite);
    await Deno.remove(path);
    transformed++;
  }
}
console.log("Formatting...");
const fmt = Deno.run({ cmd: ["deno", "fmt"], cwd: SNAPSHOT_DIR_PATH });
const { success } = await fmt.status();
console.log(success ? "Formatted files" : "Failed to format files.");
console.log("Transformed", transformed, "snapshots");
