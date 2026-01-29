import "server-only";

import { headers } from "next/headers";
import { env } from "@/env";

import { protocol, rootDomain } from "./constants";

export async function getBaseUrl(): Promise<string> {
  const headersList = await headers();
  const host =
    headersList.get("x-forwarded-host") ??
    headersList.get("host") ??
    env.NEXT_PUBLIC_ROOT_DOMAIN ??
    "localhost:3001";
  const protocolToUse = host.includes("localhost") ? "http" : protocol;
  return `${protocolToUse}://${host}`;
}

export async function extractSubdomain(): Promise<string | null> {
  const headersList = await headers();
  const host =
    headersList.get("x-forwarded-host") ??
    headersList.get("host") ??
    "";

  const hostname = host.split(":")[0];

  if (!hostname) {
    return null;
  }

  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    if (hostname.includes(".localhost")) {
      const subdomain = hostname.split(".")[0];
      if (subdomain) {
        return subdomain;
      }
    }
    return null;
  }

  const root = rootDomain.split(":")[0];

  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const [tenant] = hostname.split("---");
    if (tenant) {
      return tenant;
    }
    return null;
  }

  const isSubdomain =
    hostname !== root &&
    hostname !== `www.${root}` &&
    hostname.endsWith(`.${root}`);

  if (!isSubdomain) {
    return null;
  }

  return hostname.replace(`.${root}`, "");
}
