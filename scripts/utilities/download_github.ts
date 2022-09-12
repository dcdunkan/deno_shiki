import { convertGHURLToDownloadURL, get } from "./download.ts";

export async function downloadFromGH(
  url: string,
  type: "grammar" | "theme",
  processor: (content: string) => string,
  outPath: string,
) {
  const targetUrl = convertGHURLToDownloadURL(url);
  let content: string;
  try {
    content = await get(targetUrl);
  } catch (e) {
    throw new Error(`Failed to download ${type} from ${url}: ${e}`);
  }
  const contentObject = processor(content);
  await Deno.writeTextFile(outPath, JSON.stringify(contentObject, null, 2));
  console.log(`Downloaded ${type}: %c${outPath}`, "color: blue");
}
