# Multi-Tenant Migration: Agent Context

> Quick reference for AI agents working on the multi-tenant workspace migration. For full implementation details, see [multi-tenant-sprint-plan.md](./multi-tenant-sprint-plan.md).

## What Is This Migration?

We're transforming a **project-centric platform** into a **multi-tenant workspace architecture** to support multiple clients (cohorts) with clean data separation.

**Before**: Single `app.amaxaimpact.org` where all users see all their assigned projects in a flat list.

**After**: Subdomain-based isolation where each client gets `{workspace}.amaxaimpact.org` with their own projects, users, and data.

## Domain Architecture

| Domain | Purpose | Access |
|--------|---------|--------|
| `app.amaxaimpact.org` | Main platform entry, authenticated user home | All users |
| `internal.amaxaimpact.org` | Admin tooling: workspace management, applications, scheduling, templates | Site admins only |
| `{workspace}.amaxaimpact.org` | Client workspace with projects | Workspace members |

## Core Concepts

### Workspaces
- Container for projects and users (one per client/cohort)
- Has immutable slug (subdomain) + optional custom domain
- Roles: `owner` > `admin` > `member`
- Only workspace admins can create projects

### Projects (unchanged core)
- Now scoped to a workspace via `workspaceId`
- Same structure: tasks, taskNodes, edges, userToProject
- Accessed at `{workspace}.amaxaimpact.org/project/[id]`

### Templates (new)
- Reusable project scaffolds for "critical chain MVP"
- Site admins create/manage at `internal.amaxaimpact.org/templates`
- Used when creating new projects in a workspace

## Permission Model

```
Site Admin → bypasses ALL checks (full read/write everywhere)
    ↓
Workspace Owner → can delete workspace, transfer ownership
    ↓
Workspace Admin → can manage users, create projects, invite members
    ↓
Workspace Member → can view workspace, access assigned projects
    ↓
Project Coach/Member → existing project-level RBAC
```

**Key rule**: Workspace role is ceiling for project roles.

## Key Schema Changes

```typescript
// NEW TABLES
workspaces: { name, slug, domain?, createdBy, createdAt }
workspaceToUser: { workspaceId, userId, role: "owner"|"admin"|"member" }
workspaceInvitations: { workspaceId, email, role, invitedBy, status, expiresAt }
projectTemplates: { name, description, createdBy, isPublic }
templateTasks: { templateId, label, description, status, priority, position, dependencies }
auditLog: { userId, action, workspaceId, resourceType, resourceId, timestamp, details }

// MODIFIED TABLES
projects: + workspaceId (optional during migration)
```

## Route Structure

```
apps/platform/src/app/
├── (app)/                    # Main app routes (app.amaxaimpact.org)
│   └── page.tsx              # Home: workspace list or pending invites
├── (internal)/               # Admin routes (internal.amaxaimpact.org)
│   ├── workspaces/           # Workspace CRUD
│   ├── templates/            # Template management
│   └── applications/         # Existing applications system
├── domains/[domain]/         # Workspace routes ({slug}.amaxaimpact.org)
│   ├── page.tsx              # Workspace home
│   ├── projects/             # Project list
│   └── project/[projectId]/  # Existing project pages (migrated)
└── invite/[invitationId]/    # Public invitation accept
```

## Critical Files

| File | Purpose |
|------|---------|
| `packages/backend/convex/schema.ts` | All table definitions |
| `packages/backend/convex/permissions.ts` | Permission helpers (add workspace checks) |
| `packages/backend/convex/workspaces.ts` | Workspace CRUD |
| `packages/backend/convex/workspaceToUser.ts` | Workspace membership |
| `apps/platform/middleware.ts` | Subdomain routing |
| `apps/platform/src/lib/subdomain.ts` | Hostname parsing |
| `apps/platform/src/components/workspace/context.tsx` | Workspace React context |

## Sprint Overview

| Sprint | Goal | Key Deliverable |
|--------|------|-----------------|
| 0 | Test infrastructure | `pnpm test --filter="@amaxa/backend"` works |
| 1 | Workspace data model | CRUD via Convex dashboard |
| 2 | Internal routes | `/(internal)/*` route group |
| 3 | Subdomain routing | Middleware + domain layouts |
| 4 | Workspace UI | Admin CRUD + invitations |
| 5 | Workspace-scoped projects | Projects at `{ws}.amaxaimpact.org/project/[id]` |
| 6 | Template system | Create/use project templates |
| 7 | Data isolation | Security audit passes |
| 8 | Production readiness | E2E tests, docs, error handling |
| 9-10 | Optional | Branding, custom domains |

## Resolved Design Decisions

- **Site admins**: Bypass ALL permission checks
- **Slugs**: Immutable (tied to subdomain)
- **Workspace deletion**: Soft delete, 30-day retention
- **Users without workspaces**: See pending invites only (security)
- **applicationForms**: Stay internal only, not workspace-scoped
- **Presence rooms**: Format `ws:{workspaceId}:project:{projectId}:tasks`
- **Project creation**: Workspace admins only (not members)
- **Moving projects between workspaces**: Deferred (not in scope)

## What Stays The Same

- Project structure (tasks, taskNodes, edges, userToProject)
- React Flow task editor at `/project/[id]/tasks`
- Application forms and scheduling (moved to internal subdomain)
- WorkOS authentication
- Convex backend patterns

## Local Development

Requires `/etc/hosts` entries:
```
127.0.0.1 app.localhost
127.0.0.1 internal.localhost
127.0.0.1 test-workspace.localhost
```

Then access:
- `http://app.localhost:3000` - Main app
- `http://internal.localhost:3000` - Admin tools
- `http://test-workspace.localhost:3000` - Test workspace
