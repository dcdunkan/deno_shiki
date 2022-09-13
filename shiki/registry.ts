import { IGrammar, Registry as TextMateRegistry } from "./deps.ts";
import {
  ILanguageRegistration,
  IShikiTheme,
  IThemeRegistration,
} from "./types.ts";
import { fetchTheme, toShikiTheme } from "./loader.ts";
import { Theme } from "./themes.ts";
import { Resolver } from "./resolver.ts";
import { Lang } from "./languages.ts";

const THEMES_PATH = import.meta.resolve("../themes/");
export class Registry extends TextMateRegistry {
  public themesPath = THEMES_PATH;

  private _resolvedThemes: Record<string, IShikiTheme> = {};
  private _resolvedGrammars: Record<string, IGrammar> = {};

  constructor(private _resolver: Resolver) {
    super(_resolver);
  }

  public getTheme(theme: Theme | IShikiTheme | string) {
    if (typeof theme === "string") {
      return this._resolvedThemes[theme];
    } else {
      return theme;
    }
  }

  public async loadTheme(theme: Theme | IShikiTheme | string) {
    if (typeof theme === "string") {
      if (!this._resolvedThemes[theme]) {
        this._resolvedThemes[theme] = await fetchTheme(
          `${this.themesPath}${theme}.json`,
        );
      }
      return this._resolvedThemes[theme];
    } else {
      theme = toShikiTheme(theme);
      if (theme.name) {
        this._resolvedThemes[theme.name] = theme;
      }
      return theme;
    }
  }

  public async loadThemes(themes: IThemeRegistration[]) {
    return await Promise.all(themes.map((theme) => this.loadTheme(theme)));
  }

  public getLoadedThemes() {
    return Object.keys(this._resolvedThemes) as Theme[];
  }

  public getGrammar(name: string) {
    return this._resolvedGrammars[name];
  }

  public async loadLanguage(lang: ILanguageRegistration) {
    const g = await this.loadGrammar(lang.scopeName);
    this._resolvedGrammars[lang.id] = g!;
    if (lang.aliases) {
      lang.aliases.forEach((la) => {
        this._resolvedGrammars[la] = g!;
      });
    }
  }

  public async loadLanguages(langs: ILanguageRegistration[]) {
    for (const lang of langs) {
      this._resolver.addLanguage(lang);
    }
    for (const lang of langs) {
      await this.loadLanguage(lang);
    }
  }

  public getLoadedLanguages() {
    return Object.keys(this._resolvedGrammars) as Lang[];
  }
}
