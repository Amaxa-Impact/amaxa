/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as edges from "../edges.js";
import type * as graph from "../graph.js";
import type * as migrations from "../migrations.js";
import type * as permissions from "../permissions.js";
import type * as projects from "../projects.js";
import type * as reactFlowExample from "../reactFlowExample.js";
import type * as tasks from "../tasks.js";
import type * as userToProject from "../userToProject.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  edges: typeof edges;
  graph: typeof graph;
  migrations: typeof migrations;
  permissions: typeof permissions;
  projects: typeof projects;
  reactFlowExample: typeof reactFlowExample;
  tasks: typeof tasks;
  userToProject: typeof userToProject;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
