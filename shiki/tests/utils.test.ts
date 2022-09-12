import { dirname, dirpathparts, join, trimEndSlash } from "../utils.ts";
import { assertEquals } from "./deps.ts";

Deno.test("trimEndSlash", () => {
  assertEquals(trimEndSlash("/abc"), "/abc");
  assertEquals(trimEndSlash("/abc/"), "/abc");
  assertEquals(trimEndSlash("/abc//"), "/abc/");

  assertEquals(trimEndSlash("\\abc\\"), "\\abc");
  assertEquals(trimEndSlash("\\abc\\\\"), "\\abc\\");
});

Deno.test("join", () => {
  assertEquals(join("abc", "a", "b"), "abc/a/b");
  assertEquals(join(), "");
  assertEquals(join("a/", "b/"), "a/b");
  assertEquals(join("a", "./b"), "a/b");
});

Deno.test("dirname", () => {
  assertEquals(dirname("a/b/c"), "b");
  assertEquals(dirname("a/b/c/"), "c");
  assertEquals(dirname("a"), undefined);
  assertEquals(dirname(""), undefined);
});

Deno.test("dirpathparts", () => {
  assertEquals(dirpathparts("a/b/c"), ["a", "b"]);
  assertEquals(dirpathparts("a/b/c/"), ["a", "b", "c"]);
  assertEquals(dirpathparts("a/b/c/def.g"), ["a", "b", "c"]);
  assertEquals(dirpathparts("./a/b/c/"), [".", "a", "b", "c"]);
  assertEquals(dirpathparts("./a/b/c/def.g"), [".", "a", "b", "c"]);
  assertEquals(dirpathparts("/a/b/c/"), ["", "a", "b", "c"]);
  assertEquals(dirpathparts("/a/b/c/def.g"), ["", "a", "b", "c"]);
  assertEquals(dirpathparts("a\\b\\c"), ["a", "b"]);
  assertEquals(dirpathparts("a\\b\\c\\"), ["a", "b", "c"]);
  assertEquals(dirpathparts("a\\b\\c\\def.g"), ["a", "b", "c"]);
  assertEquals(dirpathparts(".\\a\\b\\c\\"), [".", "a", "b", "c"]);
  assertEquals(dirpathparts("\\a\\b\\c\\"), ["", "a", "b", "c"]);
  assertEquals(dirpathparts("a"), []);
  assertEquals(dirpathparts(""), []);
});

Deno.test("dir_join_with_new_file", () => {
  assertEquals(join(...dirpathparts("a/b/c"), "hij.k"), "a/b/hij.k");
  assertEquals(join(...dirpathparts("a/b/c/"), "hij.k"), "a/b/c/hij.k");
  assertEquals(join(...dirpathparts("a/b/c/def.g"), "hij.k"), "a/b/c/hij.k");
  assertEquals(join(...dirpathparts("./a/b/c"), "hij.k"), "./a/b/hij.k");
  assertEquals(join(...dirpathparts("./a/b/c/"), "hij.k"), "./a/b/c/hij.k");
  assertEquals(
    join(...dirpathparts("./a/b/c/def.g"), "hij.k"),
    "./a/b/c/hij.k",
  );
  assertEquals(join(...dirpathparts("/a/b/c"), "hij.k"), "/a/b/hij.k");
  assertEquals(join(...dirpathparts("/a/b/c/"), "hij.k"), "/a/b/c/hij.k");
  assertEquals(join(...dirpathparts("/a/b/c/def.g"), "hij.k"), "/a/b/c/hij.k");
  assertEquals(join(...dirpathparts("a\\b\\c"), "hij.k"), "a/b/hij.k");
  assertEquals(join(...dirpathparts("a\\b\\c\\"), "hij.k"), "a/b/c/hij.k");
  assertEquals(join(...dirpathparts("a\\b\\c\\def.g"), "hij.k"), "a/b/c/hij.k");
  assertEquals(join(...dirpathparts(".\\a\\b\\c"), "hij.k"), "./a/b/hij.k");
  assertEquals(join(...dirpathparts(".\\a\\b\\c\\"), "hij.k"), "./a/b/c/hij.k");
  assertEquals(
    join(...dirpathparts(".\\a\\b\\c\\def.g"), "hij.k"),
    "./a/b/c/hij.k",
  );
  assertEquals(join(...dirpathparts("\\a\\b\\c"), "hij.k"), "/a/b/hij.k");
  assertEquals(join(...dirpathparts("\\a\\b\\c\\"), "hij.k"), "/a/b/c/hij.k");
  assertEquals(
    join(...dirpathparts("\\a\\b\\c\\def.g"), "hij.k"),
    "/a/b/c/hij.k",
  );
});
