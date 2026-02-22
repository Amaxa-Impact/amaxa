/// <reference types="vite/client" />

/** Glob excludes *.test.ts to avoid bundling tests into Convex */
export const modules = import.meta.glob("../**/!(*.*.*)*.*s");
