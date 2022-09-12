export function convertGHURLToDownloadURL(url: string) {
  const { pathname } = new URL(url);
  return `https://raw.githubusercontent.com${pathname.replace("/blob/", "/")}`;
}

export async function get(url: string) {
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error("Request Failed");
  }
  return await response.text();
}
