export { type Theme, themes as BUNDLED_THEMES } from "./themes.ts";
export { type Lang, languages as BUNDLED_LANGUAGES } from "./languages.ts";
export { FontStyle } from "./stack_element_metadata.ts";
export { getHighlighter } from "./highlighter.ts";
export { renderToHtml } from "./renderer.ts";
export type { IThemedToken } from "./themed_tokenizer.ts";
export { fetchTheme as loadTheme, setWasm, toShikiTheme } from "./loader.ts";
export type {
  Highlighter,
  HighlighterOptions,
  HtmlRendererOptions,
  ILanguageRegistration,
  IShikiTheme,
  IThemeRegistration,
} from "./types.ts";
