export function captilize(item: string): string {
  return item.charAt(0).toUpperCase() + item.slice(1);
}

export function extractNotionId(url: string) {
  return extractPathAndId(url) ?? "https://amaxaimpact.org";
}

function extractPathAndId(url: string): string | null | undefined {
  const regex = /\/([^\/\?]+)\?/;
  const match = regex.exec(url);
  return match ? match[1] : null;
}
