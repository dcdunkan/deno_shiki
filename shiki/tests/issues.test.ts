import { getHighlighter } from "../mod.ts";
import { assertEquals } from "./deps.ts";

// https://github.com/shikijs/shiki/issues/152
Deno.test("Correctly highlights LaTeX (#152)", async () => {
  const highlighter = await getHighlighter({
    theme: "nord",
    langs: ["tex", "latex"],
  });

  const out = highlighter.codeToThemedTokens(
    `%\\usepackage{pkg}`,
    "latex",
    "nord",
    {
      includeExplanation: true,
    },
  );
  assertEquals(out, [
    [
      {
        "color": "#616E88",
        "content": "%\\usepackage{pkg}",
        "explanation": [
          {
            "content": "%",
            "scopes": [
              {
                "scopeName": "text.tex.latex",
                "themeMatches": [],
              },
              {
                "scopeName": "comment.line.percentage.tex",
                "themeMatches": [
                  {
                    "name": "Comment",
                    "scope": "comment",
                    "settings": {
                      "foreground": "#616E88",
                    },
                  },
                ],
              },
              {
                "scopeName": "punctuation.definition.comment.tex",
                "themeMatches": [
                  {
                    "name": "Punctuation",
                    "scope": "punctuation",
                    "settings": {
                      "foreground": "#ECEFF4",
                    },
                  },
                  {
                    "name": "Punctuation Definition Comment",
                    "scope": [
                      "punctuation.definition.comment",
                      "punctuation.end.definition.comment",
                      "punctuation.start.definition.comment",
                    ],
                    "settings": {
                      "foreground": "#616E88",
                    },
                  },
                ],
              },
            ],
          },
          {
            "content": "\\usepackage{pkg}",
            "scopes": [
              {
                "scopeName": "text.tex.latex",
                "themeMatches": [],
              },
              {
                "scopeName": "comment.line.percentage.tex",
                "themeMatches": [
                  {
                    "name": "Comment",
                    "scope": "comment",
                    "settings": {
                      "foreground": "#616E88",
                    },
                  },
                ],
              },
            ],
          },
        ],
        "fontStyle": 0,
      },
    ],
  ]);
});

// https://github.com/shikijs/shiki/issues/264
Deno.test("Correctly handles variable length lookbehind (#264)", async () => {
  const highlighter = await getHighlighter({
    theme: "light-plus",
    langs: ["svelte"],
  });

  const out = highlighter.codeToThemedTokens(
    `<div let:x={a} />`,
    "svelte",
    "light-plus",
    {
      includeExplanation: true,
    },
  );
  assertEquals(out, [
    [
      {
        "color": "#800000",
        "content": "<div",
        "explanation": [
          {
            "content": "<",
            "scopes": [
              {
                "scopeName": "source.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.scope.tag.div.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.tag.start.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "punctuation.definition.tag.begin.svelte",
                "themeMatches": [
                  {
                    "name": "brackets of XML/HTML tags",
                    "scope": "punctuation.definition.tag",
                    "settings": {
                      "foreground": "#800000",
                    },
                  },
                ],
              },
            ],
          },
          {
            "content": "div",
            "scopes": [
              {
                "scopeName": "source.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.scope.tag.div.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.tag.start.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "entity.name.tag.svelte",
                "themeMatches": [
                  {
                    "name": "css tags in selectors, xml tags",
                    "scope": "entity.name.tag",
                    "settings": {
                      "foreground": "#800000",
                    },
                  },
                ],
              },
            ],
          },
        ],
        "fontStyle": 0,
      },
      {
        "color": "#000000",
        "content": " ",
        "explanation": [
          {
            "content": " ",
            "scopes": [
              {
                "scopeName": "source.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.scope.tag.div.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.tag.start.svelte",
                "themeMatches": [],
              },
            ],
          },
        ],
        "fontStyle": 0,
      },
      {
        "color": "#0000FF",
        "content": "let",
        "explanation": [
          {
            "content": "let",
            "scopes": [
              {
                "scopeName": "source.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.scope.tag.div.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.tag.start.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.directive.let.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "storage.type.svelte",
                "themeMatches": [
                  {
                    "scope": "storage",
                    "settings": {
                      "foreground": "#0000ff",
                    },
                  },
                  {
                    "scope": "storage.type",
                    "settings": {
                      "foreground": "#0000ff",
                    },
                  },
                ],
              },
            ],
          },
        ],
        "fontStyle": 0,
      },
      {
        "color": "#000000",
        "content": ":",
        "explanation": [
          {
            "content": ":",
            "scopes": [
              {
                "scopeName": "source.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.scope.tag.div.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.tag.start.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.directive.let.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "punctuation.definition.keyword.svelte",
                "themeMatches": [],
              },
            ],
          },
        ],
        "fontStyle": 0,
      },
      {
        "color": "#001080",
        "content": "x",
        "explanation": [
          {
            "content": "x",
            "scopes": [
              {
                "scopeName": "source.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.scope.tag.div.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.tag.start.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.directive.let.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "variable.parameter.svelte",
                "themeMatches": [
                  {
                    "name": "Variable and parameter name",
                    "scope": [
                      "variable",
                      "meta.definition.variable.name",
                      "support.variable",
                      "entity.name.variable",
                      "constant.other.placeholder",
                    ],
                    "settings": {
                      "foreground": "#001080",
                    },
                  },
                ],
              },
            ],
          },
        ],
        "fontStyle": 0,
      },
      {
        "color": "#000000",
        "content": "=",
        "explanation": [
          {
            "content": "=",
            "scopes": [
              {
                "scopeName": "source.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.scope.tag.div.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.tag.start.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.directive.let.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "punctuation.separator.key-value.svelte",
                "themeMatches": [],
              },
            ],
          },
        ],
        "fontStyle": 0,
      },
      {
        "color": "#A31515",
        "content": "{a}",
        "explanation": [
          {
            "content": "{a}",
            "scopes": [
              {
                "scopeName": "source.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.scope.tag.div.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.tag.start.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.directive.let.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "string.unquoted.svelte",
                "themeMatches": [
                  {
                    "scope": [
                      "string",
                      "meta.embedded.assembly",
                    ],
                    "settings": {
                      "foreground": "#a31515",
                    },
                  },
                ],
              },
            ],
          },
        ],
        "fontStyle": 0,
      },
      {
        "color": "#000000",
        "content": " ",
        "explanation": [
          {
            "content": " ",
            "scopes": [
              {
                "scopeName": "source.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.scope.tag.div.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.tag.start.svelte",
                "themeMatches": [],
              },
            ],
          },
        ],
        "fontStyle": 0,
      },
      {
        "color": "#800000",
        "content": "/>",
        "explanation": [
          {
            "content": "/>",
            "scopes": [
              {
                "scopeName": "source.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.scope.tag.div.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "meta.tag.start.svelte",
                "themeMatches": [],
              },
              {
                "scopeName": "punctuation.definition.tag.end.svelte",
                "themeMatches": [
                  {
                    "name": "brackets of XML/HTML tags",
                    "scope": "punctuation.definition.tag",
                    "settings": {
                      "foreground": "#800000",
                    },
                  },
                ],
              },
            ],
          },
        ],
        "fontStyle": 0,
      },
    ],
  ]);
});

// https://github.com/shikijs/shiki/issues/326
Deno.test(`Don't preload any language if lang is set to an empty array (#326)`, async () => {
  const highlighter = await getHighlighter({
    theme: "nord",
    langs: [],
  });
  assertEquals(highlighter.getLoadedLanguages().length, 0);
});
