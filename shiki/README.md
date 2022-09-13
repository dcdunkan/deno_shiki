<div align="center">

![](../assets/readme_image.png)

# Shiki

Shiki is a beautiful Syntax Highlighter. [Demo](http://shiki.matsu.io).

</div>

Deno port of [Shiki main repository](https://github.com/shikijs/shiki) and the
packages (except the Vuepress plugin). Give the original repository a star! All
credits goes to the actual authors and maintainers.

```ts
import { getHighlighter } from "https://deno.land/x/shiki/shiki/mod.ts";

const highlighter = await getHighlighter({ theme: "nord" });

const code = `console.log("A beautiful Syntax Highlighter.");`;
const highlighted = highlighter.codeToHtml(code, { lang: "js" });
console.log(highlighted);
```

It is recommended to set a local or remote oniguruma WASM file by yourself. By
default it is set to the [onig.wasm](../assets/onig.wasm) file from this
repository. You can find the origin file
[here](https://github.com/microsoft/vscode-oniguruma/blob/v1.6.2/out/onig.wasm).

To configure one by yourself:

```ts
import { setWasm } from "https://deno.land/x/shiki/shiki/mod.ts";

// Local file
await setWasm("./local_onig_wasm_file.wasm");
// Remote file (fetched before continuing)
await setWasm(
  "https://raw.githubusercontent.com/microsoft/vscode-oniguruma/v1.6.2/out/onig.wasm",
);

// ... Rest of your code
```

### Modules

This repository contains the following ported packages.

- [Shiki](#readme)
- [SVG Renderer](../renderer/svg)
- [Path Renderer](../renderer/path)

Modules are confirmed as working as far as I've tested.

Go to the [examples](../examples/) directory to play with Shiki, or try it out on
[a Deno Deploy playground](https://dash.deno.com/playground/shiki-pg).
