"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { ProfileDropdown } from "@/components/navbar/profile-dropdown";
import { useWorkspace } from "@/components/workspace/context";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@amaxa/ui/breadcrumb";
import { buttonVariants } from "@amaxa/ui/button";

import { useAuthContext } from "~/lib/auth/auth-context";

interface WorkspaceNavLink {
  href: string;
  label: string;
}

const getAdminLinks = (workspaceSlug: string): WorkspaceNavLink[] => [
  {
    href: `/${workspaceSlug}/admin/projects`,
    label: "Admin Projects",
  },
  { href: `/${workspaceSlug}/admin/users`, label: "Manage Users" },
];

export const WorkspaceNavbar = memo(function WorkspaceNavbar() {
  const { user, isLoading, isAdmin: isSiteAdmin } = useAuthContext();
  const { userRole, workspace } = useWorkspace();

  const isAdmin = userRole === "admin" || userRole === "owner" || isSiteAdmin;

  const adminLinks = useMemo(() => {
    if (!workspace.slug) return [];
    return getAdminLinks(workspace.slug);
  }, [workspace]);

  const links = isAdmin ? adminLinks : [];

  return (
    <nav className="h-16 border-b">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    render={
                      isSiteAdmin ? (
                        <Link href="/" />
                      ) : (
                        <a href="https://www.amaxaimpact.org" />
                      )
                    }
                  >
                    Àmaxa
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>{workspace.name}</BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {isAdmin && (
            <div className="flex items-center gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={buttonVariants({
                    variant: "secondary",
                    className: "text-primary-foreground hover:text-primary",
                  })}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
          {isLoading ? (
            <div className="bg-primary-foreground/20 h-8 w-8 animate-pulse rounded-full" />
          ) : (
            user && <ProfileDropdown />
          )}
        </div>
      </div>
    </nav>
  );
});
