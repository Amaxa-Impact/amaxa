/// <reference types="vite/client" />

/**
 * Test setup for convex-test
 *
 * This glob pattern matches all TypeScript files with a single extension
 * (like .ts or .js) but excludes test files (which have .test.ts).
 * This prevents convex-test from being bundled into Convex functions.
 *
 * The path is relative to this file's location (convex/tests/).
 */
export const modules = import.meta.glob("../**/!(*.*.*)*.*s");
