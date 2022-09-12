# clean up
rm -rf tmp/grammars
mkdir -p tmp/grammars

echo "> Getting VS Code grammars"
if [ ! -d tmp/vscode ]; then
  git clone https://github.com/microsoft/vscode.git tmp/vscode --depth=1
else
  (cd tmp/vscode && git checkout . && git pull)
fi
# Two html file will cause `cp` to fail
mv tmp/vscode/extensions/php/syntaxes/html.tmLanguage.json tmp/vscode/extensions/php/syntaxes/php-html.tmLanguage.json
cp tmp/vscode/extensions/**/syntaxes/*.json tmp/grammars
echo "> Done getting VS Code grammars"

echo "> Getting grammars from GitHub"
deno run -A scripts/grammars/pull_grammars_from_github.ts
echo "> Done getting grammars from GitHub"

echo "> Getting grammars from VS Code marketplace"
deno run -A scripts/grammars/pull_grammars_from_marketplace.ts
echo "> Done getting grammars from VS Code marketplace"

echo "> Normalizing grammars"
deno run -A scripts/grammars/normalize_grammar_paths.ts
echo "> Done normalizing grammars"

echo "> Copying grammars"
cp tmp/grammars/*.json languages
echo "> Done copying grammars"

echo "> Updating source files"
deno run -A scripts/grammars/update_grammar_source_files.ts
echo "> Done updating source files"

echo "> Formatting grammar files"
deno fmt languages --no-config
echo "> Done formatting grammar files"

echo "> All done"
