export {
  createOnigScanner,
  createOnigString,
  loadWASM,
} from "https://esm.sh/vscode-oniguruma@1.6.2";
export { parse, type ParseError } from "https://esm.sh/jsonc-parser@3.0.0";
export {
  type IGrammar,
  INITIAL,
  type IOnigLib,
  type IRawGrammar,
  type IRawTheme,
  type IRawThemeSetting,
  Registry,
  type RegistryOptions,
} from "https://ghc.deno.dev/dcdunkan/deno_textmate@6.0.0/mod.ts";
export {
  fromFileUrl,
  isAbsolute,
  resolve,
} from "https://deno.land/std@0.155.0/path/mod.ts";

export const isRemoteImport = ["http:", "https:"]
  .includes(new URL(import.meta.url).protocol);
