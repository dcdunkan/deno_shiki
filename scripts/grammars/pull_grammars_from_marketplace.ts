import { marketplaceGrammarSources } from "../grammar_sources.ts";
import { downloadFromMarketplace } from "../utilities/download_marketplace.ts";

for (const [extFullId, fPaths] of Object.entries(marketplaceGrammarSources)) {
  await downloadFromMarketplace(extFullId, fPaths, "grammar");
}
