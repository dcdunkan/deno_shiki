/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { IOnigLib, IRawGrammar, RegistryOptions } from "./deps.ts";
import { languages } from "./languages.ts";
import { fetchGrammar, resolvePath } from "./loader.ts";
import { ILanguageRegistration } from "./types.ts";

const LANGUAGES_PATH = resolvePath("languages/");
export class Resolver implements RegistryOptions {
  public languagesPath = LANGUAGES_PATH;

  private readonly languageMap: {
    [langIdOrAlias: string]: ILanguageRegistration;
  } = {};
  private readonly scopeToLangMap: {
    [scope: string]: ILanguageRegistration;
  } = {};

  private readonly _onigLibPromise: Promise<IOnigLib>;
  private readonly _onigLibName: string;

  constructor(onigLibPromise: Promise<IOnigLib>, onigLibName: string) {
    this._onigLibPromise = onigLibPromise;
    this._onigLibName = onigLibName;
  }

  public get onigLib(): Promise<IOnigLib> {
    return this._onigLibPromise;
  }

  public getOnigLibName(): string {
    return this._onigLibName;
  }

  public getLangRegistration(langIdOrAlias: string): ILanguageRegistration {
    return this.languageMap[langIdOrAlias];
  }

  public async loadGrammar(scopeName: string): Promise<IRawGrammar | null> {
    const lang = this.scopeToLangMap[scopeName];

    if (!lang) {
      return null;
    }

    if (lang.grammar) {
      return lang.grammar;
    }

    const g = await fetchGrammar(
      languages.includes(lang)
        ? `${this.languagesPath}/${lang.path}`
        : lang.path!,
    );
    lang.grammar = g;
    return g;
  }

  public addLanguage(l: ILanguageRegistration) {
    this.languageMap[l.id] = l;
    if (l.aliases) {
      l.aliases.forEach((a) => {
        this.languageMap[a] = l;
      });
    }
    this.scopeToLangMap[l.scopeName] = l;
  }
}
