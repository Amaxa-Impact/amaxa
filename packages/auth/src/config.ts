//TODO: add permissions stuff
import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from "next-auth";
import { skipCSRFCheck } from "@auth/core";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";

import { db } from "@amaxa/db/client";
import { Account, Session, User, UserRoleEnum, UserStatusEnum } from "@amaxa/db/schema";

import { env } from "../env";

declare module "next-auth" {
  interface Session {
    user: {
      role: typeof UserRoleEnum;
      project_permissions?: string;
      status: typeof UserStatusEnum;
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
  callbacks: {
    session: async (opts) => {
      if (!("user" in opts))
        throw new Error("unreachable with session strategy");

      const data = await db.query.User.findFirst({
        columns: {
          status: true,
          role: true,
        }
      })
      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
          status: data?.status,
          role: data?.role,
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

  const data = await db.query.User.findFirst({
    where: (User, { eq }) => eq(User.id, session?.user.id!),
    columns: {
      status: true,
      role: true,
    }
  })
  return session
    ? {
      user: {
        ...session.user,
        role: data?.role! as unknown as typeof UserRoleEnum,
        status: data?.status! as unknown as typeof UserStatusEnum,
      },
      expires: session.session.expires.toISOString(),
    }
    : null;
};

export const invalidateSessionToken = async (token: string) => {
  await adapter.deleteSession?.(token);
};
