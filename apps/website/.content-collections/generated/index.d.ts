import type configuration from "../../content-collections.ts";
import type { GetTypeByName } from "@content-collections/core";

export type BlogPost = GetTypeByName<typeof configuration, "BlogPost">;
export declare const allBlogPosts: BlogPost[];

export type ChangelogPost = GetTypeByName<typeof configuration, "ChangelogPost">;
export declare const allChangelogPosts: ChangelogPost[];

export type HelpPost = GetTypeByName<typeof configuration, "HelpPost">;
export declare const allHelpPosts: HelpPost[];

export type LegalPost = GetTypeByName<typeof configuration, "LegalPost">;
export declare const allLegalPosts: LegalPost[];

export type IntegrationsPost = GetTypeByName<typeof configuration, "IntegrationsPost">;
export declare const allIntegrationsPosts: IntegrationsPost[];

export {};
