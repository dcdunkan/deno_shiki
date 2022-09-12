export * from "https://deno.land/std@0.155.0/testing/asserts.ts";
export { fromFileUrl } from "https://deno.land/std@0.155.0/path/mod.ts";
import { AssertionError } from "https://deno.land/std@0.155.0/testing/asserts.ts";
// Custom assertion functions that does not exist in std/testing.
export function assertStringNotIncludes(
  actual: string,
  expected: string,
  msg?: string,
) {
  if (actual.includes(expected)) {
    if (!msg) {
      msg = `actual: "${actual}" expected not to contain: "${expected}"`;
    }
    throw new AssertionError(msg);
  }
}
