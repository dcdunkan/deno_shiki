/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import { IGrammar, INITIAL, IRawTheme, IRawThemeSetting } from "./deps.ts";
import { FontStyle, StackElementMetadata } from "./stack_element_metadata.ts";

export interface IThemedTokenScopeExplanation {
  scopeName: string;
  themeMatches: IRawThemeSetting[];
}

export interface IThemedTokenExplanation {
  content: string;
  scopes: IThemedTokenScopeExplanation[];
}

/**
 * A single token with color, and optionally with explanation.
 *
 * For example:
 *
 * {
 *   "content": "shiki",
 *   "color": "#D8DEE9",
 *   "explanation": [
 *     {
 *       "content": "shiki",
 *       "scopes": [
 *         {
 *           "scopeName": "source.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.objectliteral.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.object.member.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "meta.array.literal.js",
 *           "themeMatches": []
 *         },
 *         {
 *           "scopeName": "variable.other.object.js",
 *           "themeMatches": [
 *             {
 *               "name": "Variable",
 *               "scope": "variable.other",
 *               "settings": {
 *                 "foreground": "#D8DEE9"
 *               }
 *             },
 *             {
 *               "name": "[JavaScript] Variable Other Object",
 *               "scope": "source.js variable.other.object",
 *               "settings": {
 *                 "foreground": "#D8DEE9"
 *               }
 *             }
 *           ]
 *         }
 *       ]
 *     }
 *   ]
 * }
 */
export interface IThemedToken {
  /**
   * The content of the token
   */
  content: string;
  /**
   * 6 or 8 digit hex code representation of the token's color
   */
  color?: string;
  /**
   * Font style of token. Can be None/Italic/Bold/Underline
   */
  fontStyle?: FontStyle;
  /**
   * Explanation of
   *
   * - token text's matching scopes
   * - reason that token text is given a color (one matching scope matches a rule (scope -> color) in the theme)
   */
  explanation?: IThemedTokenExplanation[];
}

export function tokenizeWithTheme(
  theme: IRawTheme,
  colorMap: string[],
  fileContents: string,
  grammar: IGrammar,
  options: { includeExplanation?: boolean },
): IThemedToken[][] {
  const lines = fileContents.split(/\r\n|\r|\n/);
  let ruleStack = INITIAL;
  let actual: IThemedToken[] = [];
  const final: IThemedToken[][] = [];

  for (let i = 0, len = lines.length; i < len; i++) {
    const line = lines[i];
    if (line === "") {
      actual = [];
      final.push([]);
      continue;
    }

    let resultWithScopes;
    let tokensWithScopes;
    let tokensWithScopesIndex;

    if (options.includeExplanation) {
      resultWithScopes = grammar.tokenizeLine(line, ruleStack);
      tokensWithScopes = resultWithScopes.tokens;
      tokensWithScopesIndex = 0;
    }

    const result = grammar.tokenizeLine2(line, ruleStack);
    const tokensLength = result.tokens.length / 2;

    for (let j = 0; j < tokensLength; j++) {
      const startIndex = result.tokens[2 * j];
      const nextStartIndex = j + 1 < tokensLength
        ? result.tokens[2 * j + 2]
        : line.length;
      if (startIndex === nextStartIndex) {
        continue;
      }
      const metadata = result.tokens[2 * j + 1];
      const foreground = StackElementMetadata.getForeground(metadata);
      const foregroundColor = colorMap[foreground];
      const fontStyle: FontStyle = StackElementMetadata.getFontStyle(metadata);

      const explanation: IThemedTokenExplanation[] = [];
      if (options.includeExplanation) {
        let offset = 0;
        while (startIndex + offset < nextStartIndex) {
          const tokenWithScopes = tokensWithScopes
            ?.[tokensWithScopesIndex as number]!;

          const tokenWithScopesText = line.substring(
            tokenWithScopes.startIndex,
            tokenWithScopes.endIndex,
          );
          offset += tokenWithScopesText.length;
          explanation.push({
            content: tokenWithScopesText,
            scopes: explainThemeScopes(theme, tokenWithScopes.scopes),
          });

          (tokensWithScopesIndex as number)++;
        }
      }

      actual.push({
        content: line.substring(startIndex, nextStartIndex),
        color: foregroundColor,
        fontStyle,
        explanation: explanation,
      });
    }
    final.push(actual);
    actual = [];
    ruleStack = result.ruleStack;
  }

  return final;
}

function explainThemeScopes(
  theme: IRawTheme,
  scopes: string[],
): IThemedTokenScopeExplanation[] {
  const result: IThemedTokenScopeExplanation[] = [];
  for (let i = 0, len = scopes.length; i < len; i++) {
    const parentScopes = scopes.slice(0, i);
    const scope = scopes[i];
    result[i] = {
      scopeName: scope,
      themeMatches: explainThemeScope(theme, scope, parentScopes),
    };
  }
  return result;
}

function matchesOne(selector: string, scope: string): boolean {
  const selectorPrefix = selector + ".";
  if (
    selector === scope ||
    scope.substring(0, selectorPrefix.length) === selectorPrefix
  ) {
    return true;
  }
  return false;
}

function matches(
  selector: string,
  selectorParentScopes: string[],
  scope: string,
  parentScopes: string[],
): boolean {
  if (!matchesOne(selector, scope)) {
    return false;
  }

  let selectorParentIndex = selectorParentScopes.length - 1;
  let parentIndex = parentScopes.length - 1;
  while (selectorParentIndex >= 0 && parentIndex >= 0) {
    if (
      matchesOne(
        selectorParentScopes[selectorParentIndex],
        parentScopes[parentIndex],
      )
    ) {
      selectorParentIndex--;
    }
    parentIndex--;
  }

  if (selectorParentIndex === -1) {
    return true;
  }
  return false;
}

function explainThemeScope(
  theme: IRawTheme,
  scope: string,
  parentScopes: string[],
): IRawThemeSetting[] {
  const result: IRawThemeSetting[] = [];
  let resultLen = 0;
  for (let i = 0, len = theme.settings.length; i < len; i++) {
    const setting = theme.settings[i];
    let selectors: string[];
    if (typeof setting.scope === "string") {
      selectors = setting.scope.split(/,/).map((scope) => scope.trim());
    } else if (Array.isArray(setting.scope)) {
      selectors = setting.scope;
    } else {
      continue;
    }
    for (let j = 0, lenJ = selectors.length; j < lenJ; j++) {
      const rawSelector = selectors[j];
      const rawSelectorPieces = rawSelector.split(/ /);
      const selector = rawSelectorPieces[rawSelectorPieces.length - 1];
      const selectorParentScopes = rawSelectorPieces.slice(
        0,
        rawSelectorPieces.length - 1,
      );

      if (matches(selector, selectorParentScopes, scope, parentScopes)) {
        // match!
        result[resultLen++] = setting;
        // break the loop
        j = lenJ;
      }
    }
  }
  return result;
}
