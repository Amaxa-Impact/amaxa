import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from "next-auth";
import { skipCSRFCheck } from "@auth/core";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";

import type { ProjectPermission, UserRole, UserStatus } from "@amaxa/db/schema";
import { db } from "@amaxa/db/client";
import { Account, Session, User } from "@amaxa/db/schema";

import { env } from "../env";
import { getUserInformation } from "./actions";

declare module "next-auth" {
  interface Session {
    user: {
      role: UserRole;
      project_permissions?: Record<string, ProjectPermission>;
      status: UserStatus;
      id: string;
    } & DefaultSession["user"];
  }
}

const adapter = DrizzleAdapter(db, {
  usersTable: User,
  accountsTable: Account,
  sessionsTable: Session,
});

export const isSecureContext = env.NODE_ENV !== "development";

export const authConfig = {
  adapter,
  // In development, we need to skip checks to allow Expo to work
  ...(!isSecureContext
    ? {
        skipCSRFCheck: skipCSRFCheck,
        trustHost: true,
      }
    : {}),
  secret: env.AUTH_SECRET,
  providers: [Google],
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-out",
  },
  callbacks: {
    session: (opts) => {
      if (!("user" in opts))
        throw new Error("unreachable with session strategy");

      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
        },
      };
    },
  },
} satisfies NextAuthConfig;

export const validateToken = async (
  token: string,
): Promise<NextAuthSession | null> => {
  const sessionToken = token.slice("Bearer ".length);
  const session = await adapter.getSessionAndUser?.(sessionToken);

  if (session) {
    const data = await getUserInformation(session.user.id);
    return {
      user: {
        ...session.user,
        role: data.role,
        status: data.status,
        project_permissions: data.project_permissions,
      },
      expires: session.session.expires.toISOString(),
    };
  } else {
    return null;
  }
};

export const invalidateSessionToken = async (token: string) => {
  await adapter.deleteSession?.(token);
};
