import { marketplaceThemeSources } from "../themes_sources.ts";
import { downloadFromMarketplace } from "../utilities/download_marketplace.ts";

for (const [extFullId, fPaths] of Object.entries(marketplaceThemeSources)) {
  await downloadFromMarketplace(extFullId, fPaths, "theme");
}
