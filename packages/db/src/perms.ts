export const permissions = ["write:tasks", "write:permissions"] as const;

export type Permission = (typeof permissions)[number];
