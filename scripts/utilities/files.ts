export async function exists(path: string) {
  try {
    await Deno.lstat(path);
    return true;
  } catch (_e) {
    return false;
  }
}
