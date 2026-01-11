export function getStableUserId(): string {
  if (typeof window === "undefined") {
    return "ssr";
  }

  const storageKey = "presence-user-id";
  let storedId = sessionStorage.getItem(storageKey);

  if (!storedId) {
    storedId = crypto.randomUUID();
    sessionStorage.setItem(storageKey, storedId);
  }

  return storedId;
}

export function getUserColor(userId: string): string {
  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#f97316",
  ];
  const hash = userId
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
