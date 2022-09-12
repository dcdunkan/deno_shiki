# clean up
rm -rf tmp/themes
mkdir -p tmp/themes

echo "> Getting VS Code themes"
if [ ! -d tmp/vscode ]; then
  git clone https://github.com/microsoft/vscode.git tmp/vscode --depth=1
else
  (cd tmp/vscode && git checkout . && git pull)
fi
cp tmp/vscode/extensions/theme-*/themes/*.json tmp/themes
deno run -A scripts/themes/process_vsc_themes.ts
echo "> Done getting VS Code themes"

echo "> Getting themes from GitHub"
deno run -A scripts/themes/pull_themes_from_github.ts
echo "> Done getting themes from GitHub"

echo "> Getting themes from VS Code marketplace"
deno run -A scripts/themes/pull_themes_from_marketplace.ts
echo "> Done getting themes from VS Code marketplace"

echo "> Normalizing themes"
deno run -A scripts/themes/normalize_theme_paths.ts
echo "> Done normalizing themes"

echo "> Copying themes"
cp tmp/themes/*.json themes
echo "> Done copying themes"

echo "> Updating source files"
deno run -A scripts/themes/update_theme_source_files.ts
echo "> Done updating source files"

echo "> Formatting theme files"
deno fmt themes --no-config
echo "> Done formatting theme files"

echo "> All done"
