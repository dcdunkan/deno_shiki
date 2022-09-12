import { parse, ParseError } from "https://esm.sh/jsonc-parser@3.0.0";

export function parseJson(jsonc: string) {
  const errors: ParseError[] = [];
  const result = parse(jsonc, errors, { allowTrailingComma: true });
  if (errors.length) throw errors[0];
  return result;
}
