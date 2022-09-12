import { readZip } from "https://deno.land/x/jszip@0.11.0/mod.ts";
import {
  copy,
  readerFromStreamReader,
} from "https://deno.land/std@0.155.0/streams/mod.ts";

function getMarketplaceLink(publisherDotExtId: string) {
  const [publisher, extId] = publisherDotExtId.split(".");

  return (
    `https://${publisher}.gallery.vsassets.io` +
    `/_apis/public/gallery/publisher/${publisher}` +
    `/extension/${extId}/latest` +
    `/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage`
  );
}

export async function downloadFromMarketplace(
  extFullId: string,
  filepaths: [string, string][],
  type: "grammar" | "theme",
) {
  const { ok, body } = await fetch(getMarketplaceLink(extFullId));
  if (!ok || !body) throw new Error(`Failed to fetch ${extFullId}`);
  const reader = readerFromStreamReader(body.getReader());
  const tempFile = await Deno.makeTempFile({ suffix: ".zip" });
  const destination = await Deno.open(tempFile, { read: true, write: true });
  await copy(reader, destination);
  const zip = await readZip(tempFile);
  await Deno.mkdir(`tmp/${type}s`, { recursive: true });
  for (const file of zip) {
    const match = filepaths.filter(([_, filepath]) => file.name === filepath);
    if (match.length > 0) {
      const filename = typeof match[0] === "string"
        ? file.name.split("/").pop()
        : match[0][0];
      const content = await file.async("string");
      await Deno.writeTextFile(`tmp/${type}s/${filename}`, content);
      console.log(
        `%cExtracted %c${(filename)}%c from %c${extFullId}`,
        "color: green",
        "color: blue",
        "color: none",
        "color: yellow",
      );
    }
  }
  await Deno.remove(tempFile);
}
