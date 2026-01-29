import type { NextRequest } from "next/server";
import { Result } from "better-result";

import { NoSubdomainError } from "../errors";
import { rootDomain } from "./constants";

type ExtractSubdomainError = NoSubdomainError;

export const extractSubdomainFromRequest = (
  request: NextRequest,
): Result<string, ExtractSubdomainError> => {
  const url = request.url;
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0];

  if (!hostname) {
    return Result.err(new NoSubdomainError({ message: "Missing host header" }));
  }

  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    const match = /http:\/\/([^.]+)\.localhost/.exec(url);
    if (match?.[1]) {
      return Result.ok(match[1]);
    }

    if (hostname.includes(".localhost")) {
      const subdomain = hostname.split(".")[0];
      if (subdomain) {
        return Result.ok(subdomain);
      }
    }

    return Result.err(
      new NoSubdomainError({ message: "No localhost subdomain found" }),
    );
  }

  const root = rootDomain.split(":")[0];

  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const [tenant] = hostname.split("---");
    if (tenant) {
      return Result.ok(tenant);
    }

    return Result.err(
      new NoSubdomainError({ message: "Invalid preview hostname" }),
    );
  }

  const isSubdomain =
    hostname !== root &&
    hostname !== `www.${root}` &&
    hostname.endsWith(`.${root}`);

  if (!isSubdomain) {
    return Result.err(
      new NoSubdomainError({ message: "No subdomain present" }),
    );
  }

  return Result.ok(hostname.replace(`.${root}`, ""));
};
