export const permissions = ["admin", "user"] as const;

export type Permission = (typeof permissions)[number];
