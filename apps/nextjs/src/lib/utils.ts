export function captilize(item: string): string {
  return item.charAt(0).toUpperCase() + item.slice(1);
}

export function extractNotionId(url: string) {
  const match = /([a-f0-9]{32})/.exec(url);
  return match ? `a${match[1]}` : null;
}
