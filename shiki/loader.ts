// deno-lint-ignore-file no-explicit-any
import { dirpathparts, join } from "./utils.ts";
import {
  createOnigScanner,
  createOnigString,
  IOnigLib,
  IRawGrammar,
  IRawTheme,
  loadWASM,
  parse,
  ParseError,
} from "./deps.ts";
import type { IShikiTheme } from "./types.ts";

let WASM: ArrayBuffer;
let onigurumaPromise: Promise<IOnigLib>;

export async function setWasm(value: string | Uint8Array) {
  if (typeof value === "string") {
    if (value.startsWith("https://") || value.startsWith("http://")) {
      const res = await fetch(value);
      WASM = await res.arrayBuffer();
    } else {
      WASM = await Deno.readFile(value);
    }
  } else {
    WASM = value;
  }
}

export async function getOniguruma(): Promise<IOnigLib> {
  if (WASM === undefined) {
    await setWasm(import.meta.resolve("../assets/onig.wasm"));
  }
  return onigurumaPromise !== undefined
    ? onigurumaPromise
    : loadWASM(WASM).then(() => {
      return {
        createOnigScanner(patterns: string[]) {
          return createOnigScanner(patterns);
        },
        createOnigString(s: string) {
          return createOnigString(s);
        },
      };
    });
}

async function _fetchJSONAssets(filepath: string) {
  const errors: ParseError[] = [];
  const rawTheme = parse(
    await Deno.readTextFile(filepath),
    errors,
    { allowTrailingComma: true },
  );
  if (errors.length) throw errors[0];
  return rawTheme;
}

/**
 * @param themePath related path to theme.json
 */
export async function fetchTheme(themePath: string): Promise<IShikiTheme> {
  const theme: IRawTheme = await _fetchJSONAssets(themePath);
  const shikiTheme = toShikiTheme(theme);
  if (shikiTheme.include) {
    const includedTheme = await fetchTheme(
      join(...dirpathparts(themePath), shikiTheme.include),
    );
    if (includedTheme.settings) {
      shikiTheme.settings = includedTheme.settings.concat(shikiTheme.settings);
    }
    if (includedTheme.bg && !shikiTheme.bg) {
      shikiTheme.bg = includedTheme.bg;
    }
    if (includedTheme.colors) {
      shikiTheme.colors = { ...includedTheme.colors, ...shikiTheme.colors };
    }
    delete shikiTheme.include;
  }
  return shikiTheme;
}

export function fetchGrammar(filepath: string): Promise<IRawGrammar> {
  return _fetchJSONAssets(filepath);
}

export function repairTheme(theme: IShikiTheme) {
  // Has the default no-scope setting with fallback colors
  if (!theme.settings) theme.settings = [];

  if (
    theme.settings[0] && theme.settings[0].settings && !theme.settings[0].scope
  ) {
    return;
  }

  // Push a no-scope setting with fallback colors
  theme.settings.unshift({
    settings: {
      foreground: theme.fg,
      background: theme.bg,
    },
  });
}

export function toShikiTheme(rawTheme: IRawTheme): IShikiTheme {
  const type = (<any> rawTheme).type || "dark";

  const shikiTheme: IShikiTheme = {
    name: rawTheme.name!,
    type,
    ...rawTheme,
    ...getThemeDefaultColors(rawTheme),
  };

  if ((<any> rawTheme).include) {
    shikiTheme.include = (<any> rawTheme).include;
  }
  if ((<any> rawTheme).tokenColors) {
    shikiTheme.settings = (<any> rawTheme).tokenColors;
    delete (<any> shikiTheme).tokenColors;
  }

  repairTheme(shikiTheme);

  return shikiTheme;
}

/**
 * https://github.com/microsoft/vscode/blob/f7f05dee53fb33fe023db2e06e30a89d3094488f/src/vs/platform/theme/common/colorRegistry.ts#L258-L268
 */
const VSCODE_FALLBACK_EDITOR_FG = { light: "#333333", dark: "#bbbbbb" };
const VSCODE_FALLBACK_EDITOR_BG = { light: "#fffffe", dark: "#1e1e1e" };

function getThemeDefaultColors(
  theme: IRawTheme & { type?: string },
): { fg: string; bg: string } {
  let fg, bg;

  /**
   * First try:
   * Theme might contain a global `tokenColor` without `name` or `scope`
   * Used as default value for foreground/background
   */
  const settings = theme.settings ? theme.settings : (<any> theme).tokenColors;
  const globalSetting = settings
    ? settings.find((s: any) => {
      return !s.name && !s.scope;
    })
    : undefined;

  if (globalSetting?.settings?.foreground) {
    fg = globalSetting.settings.foreground;
  }
  if (globalSetting?.settings?.background) {
    bg = globalSetting.settings.background;
  }

  /**
   * Second try:
   * If there's no global `tokenColor` without `name` or `scope`
   * Use `editor.foreground` and `editor.background`
   */
  if (!fg && (<any> theme)?.colors?.["editor.foreground"]) {
    fg = (<any> theme).colors["editor.foreground"];
  }
  if (!bg && (<any> theme)?.colors?.["editor.background"]) {
    bg = (<any> theme).colors["editor.background"];
  }

  /**
   * Last try:
   * If there's no fg/bg color specified in theme, use default
   */
  if (!fg) {
    fg = theme.type === "light"
      ? VSCODE_FALLBACK_EDITOR_FG.light
      : VSCODE_FALLBACK_EDITOR_FG.dark;
  }
  if (!bg) {
    bg = theme.type === "light"
      ? VSCODE_FALLBACK_EDITOR_BG.light
      : VSCODE_FALLBACK_EDITOR_BG.dark;
  }

  return { fg, bg };
}
