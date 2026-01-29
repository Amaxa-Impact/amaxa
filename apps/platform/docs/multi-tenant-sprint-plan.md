NOTE: We are no longer using subdomain for workspace routing due to issues. All workspace specfici stuff will now just be under the [workspace]/

# Multi-Tenant Platform Sprint Plan

**Deliverable**: This plan will be written to `apps/platform/docs/multi-tenant-sprint-plan.md` upon approval.

---

## Overview

Transform project-centric platform to multi-tenant workspace architecture:

**Domain Structure**:

- `www.amaxaimpact.org` / `amaxaimpact.org` → Landing site (apps/landing - separate)
- `app.amaxaimpact.org` → Main platform entry point (default home for authenticated users)
- `internal.amaxaimpact.org` → Internal tooling (site admins only)
- `{workspace-slug}.amaxaimpact.org` → Workspace subdomains (client-facing)

**Key Features**:

- Workspace-scoped projects at `{workspace}.amaxaimpact.org/project/[id]`
- Internal tooling (applications, scheduling, workspace management) at `internal.amaxaimpact.org`
- Template system for critical chain MVP
- Email-based invitation flow via WorkOS

**Resolved Decisions**:

- Site admins bypass ALL permission checks (full read/write everywhere)
- Workspace admins only can create projects (not members)
- Workspace slugs are immutable (tied to subdomain)
- Soft delete workspaces with 30-day retention
- Users without workspaces see pending invites (no workspace list for security)
- applicationForms stay internal only (not workspace-scoped)
- presence room format: `ws:{workspaceId}:project:{projectId}:tasks`

---

## Sprint 0: Infrastructure Setup

**Goal**: Testing infrastructure ready. Demo: Run `pnpm test --filter="@amaxa/backend"` with sample test passing.

### Ticket 0.1: Set Up Convex Test Infrastructure

**File**: `packages/backend/package.json`, `packages/backend/vitest.config.ts`

- Add `convex-test` and `vitest` dependencies
- Configure vitest for Convex testing
- Create sample test file `convex/tests/sample.test.ts`
- **Validation**: `pnpm test --filter="@amaxa/backend"` runs and passes sample test

### Ticket 0.2: Create Test Utilities

**File**: `packages/backend/convex/tests/utils.ts`

- Create mock `ctx` helper with configurable auth state
- Create workspace factory for test data
- Create user factory for test data
- **Validation**: Utilities importable and typed correctly

---

## Sprint 1: Workspace Foundation (Database & Backend Core)

**Goal**: Workspace data model complete. Demo: Create/list workspaces via Convex dashboard.

### Ticket 1.1: Create Workspaces Table Schema

**File**: `packages/backend/convex/schema.ts`

- Add `workspaces` table: `name: string`, `slug: string`, `domain: v.optional(string)`, `createdBy: string`, `createdAt: number`
- Add indexes: `by_slug`, `by_domain`
- **Validation**: `pnpx convex dev` compiles; indexes queryable

### Ticket 1.2: Create WorkspaceToUser Table Schema

**File**: `packages/backend/convex/schema.ts`

- Add `workspaceToUser`: `workspaceId: Id<"workspaces">`, `userId: string`, `role: "owner" | "admin" | "member"`
- Add indexes: `by_userId`, `by_workspaceId`, `by_userId_and_workspaceId`
- **Validation**: Schema migration succeeds

### Ticket 1.3: Add workspaceId to Projects Table

**File**: `packages/backend/convex/schema.ts`

- Add `workspaceId: v.optional(v.id("workspaces"))` to projects
- Add index: `by_workspace`
- **Validation**: Existing projects unaffected (null workspaceId valid)

### Ticket 1.4a: Create Workspace Create Mutation

**File**: `packages/backend/convex/workspaces.ts` (new)

- `create`: args `{name, slug}`, returns `Id<"workspaces">`
- Validate slug: lowercase, alphanumeric + hyphens, 3-50 chars
- Validate slug uniqueness via `by_slug` index
- Validate slug not reserved: `app`, `www`, `api`, `admin`, `internal`
- Auto-insert creator as owner in `workspaceToUser`
- **Validation**: Mutation creates workspace + owner record

### Ticket 1.4b: Create Workspace Queries

**File**: `packages/backend/convex/workspaces.ts`

- `get`: args `{workspaceId}`, returns workspace or null, requires auth + workspace membership
- `getBySlug`: args `{slug}`, returns workspace or null, requires auth + workspace membership
- `getByDomain`: args `{domain}`, internal query for middleware
- **Validation**: Queries return correct data with auth check

### Ticket 1.4c: Create Workspace Update Mutation

**File**: `packages/backend/convex/workspaces.ts`

- `update`: args `{workspaceId, name?}`, requires admin+ role (or site admin bypass)
- Slug is IMMUTABLE (not editable - tied to subdomain)
- **Validation**: Update works; non-admin rejected; slug field rejected

### Ticket 1.4d: Create Workspace Remove Mutation

**File**: `packages/backend/convex/workspaces.ts`

- `remove`: args `{workspaceId}`, requires owner role
- Delete all workspaceToUser records
- Mark projects as orphaned (null workspaceId) or cascade delete (configurable)
- **Validation**: Removal cascades correctly

### Ticket 1.4e: Create Workspace List Query

**File**: `packages/backend/convex/workspaces.ts`

- `list`: internal query, returns all workspaces (site admin only)
- `listForUser`: args `{}`, returns workspaces user belongs to
- **Validation**: User sees only their workspaces

### Ticket 1.5a: Create AddUser Mutation

**File**: `packages/backend/convex/workspaceToUser.ts` (new)

- `addUser`: args `{workspaceId, userId, role}`, requires admin+
- Prevent adding user already in workspace
- **Validation**: User added with correct role

### Ticket 1.5b: Create RemoveUser Mutation

**File**: `packages/backend/convex/workspaceToUser.ts`

- `removeUser`: args `{workspaceId, userId}`, requires admin+
- Prevent removing last owner (must transfer ownership first)
- **Validation**: Removal works; owner protected

### Ticket 1.5c: Create UpdateRole Mutation

**File**: `packages/backend/convex/workspaceToUser.ts`

- `updateRole`: args `{workspaceId, userId, role}`, requires owner for admin/owner promotion
- Prevent demoting last owner
- **Validation**: Role changes work with proper auth

### Ticket 1.5d: Create TransferOwnership Mutation

**File**: `packages/backend/convex/workspaceToUser.ts`

- `transferOwnership`: args `{workspaceId, newOwnerId}`, requires current owner
- Demote current owner to admin, promote target to owner
- **Validation**: Ownership transfers correctly

### Ticket 1.5e: Create Workspace User Queries

**File**: `packages/backend/convex/workspaceToUser.ts`

- `listUsersForWorkspace`: args `{workspaceId}`, returns users with roles
- `getUserRole`: args `{workspaceId}`, returns current user's role
- **Validation**: Queries return correct data

### Ticket 1.6: Create Workspace Permission Helpers

**File**: `packages/backend/convex/permissions.ts`

- `isSiteAdmin(ctx)` - check if user is site admin (bypass all permissions)
- `assertUserInWorkspace(ctx, workspaceId)` - throws if not member (bypassed by site admin)
- `assertWorkspaceAdmin(ctx, workspaceId)` - throws if not admin+ (bypassed by site admin)
- `assertWorkspaceOwner(ctx, workspaceId)` - throws if not owner (bypassed by site admin)
- `getWorkspaceRole(ctx, workspaceId)` - returns role or null
- All permission checks MUST call `isSiteAdmin()` first and allow bypass
- **Test**: `packages/backend/convex/tests/permissions.test.ts`

### Ticket 1.7: Add Rate Limiting to Workspace Creation

**File**: `packages/backend/convex/workspaces.ts`

- Limit workspace creation: 5 per user per hour
- Use in-memory rate tracking or separate rate limit table
- **Validation**: 6th creation in hour rejected

### Ticket 1.8: Workspace CRUD Tests

**File**: `packages/backend/convex/tests/workspaces.test.ts`

- Test all CRUD operations
- Test permission checks
- Test slug validation
- Test rate limiting
- **Validation**: All tests pass

---

## Sprint 2: Internal Route Reorganization

**Goal**: Route structure ready for multi-tenant. Demo: Internal routes at `/internal/*` path.

### Ticket 2.1: Create Internal Route Group

**Files**: `apps/platform/src/app/(internal)/`

- Create `(internal)` route group folder
- Create `layout.tsx` with site admin auth check
- Create internal navigation sidebar component
- **Validation**: Layout renders for admins only

### Ticket 2.2: Move Applications Routes

**Files**: `apps/platform/src/app/(internal)/applications/`

- Move `/applications` → `/(internal)/applications`
- Update all internal imports
- Update navbar links
- **Validation**: Applications accessible at new path

### Ticket 2.3: Move Existing Admin Routes

- Identify any other admin-only routes
- Move to `(internal)` group
- **Validation**: Admin routes work from internal group

### Ticket 2.4: Create Workspaces Route Placeholder

**File**: `apps/platform/src/app/(internal)/workspaces/page.tsx`

- Placeholder page "Workspaces management coming soon"
- Add to internal navigation
- **Validation**: Route accessible

### Ticket 2.5: Update Navigation for Internal Routes

**File**: `apps/platform/src/components/application/navbar.tsx`

- Show internal nav for site admins: Workspaces, Applications
- Update link paths to `/(internal)/*`
- **Validation**: Nav shows correct links

---

## Sprint 3: Middleware & Subdomain Routing

**Goal**: Route by subdomain. Demo: Visit `test.localhost:3000` shows workspace context.

### Ticket 3.1: Create Middleware File

**File**: `apps/platform/middleware.ts` (new)

- Export `middleware` function
- Export `config.matcher` excluding api, \_next, static assets
- Log incoming hostname (dev only)
- **Validation**: Middleware runs, logs visible

### Ticket 3.2: Implement Subdomain Extraction Helper

**File**: `apps/platform/src/lib/subdomain.ts` (new)

- `extractSubdomain(hostname, rootDomain)` function
- Handle localhost: `{sub}.localhost:3000` → sub
- Handle production: `{sub}.amaxaimpact.org` → sub
- Handle preview: `{sub}---branch.vercel.app` → sub
- Return special identifiers: `"app"` for app subdomain, `"internal"` for internal subdomain
- Return null for www/root (should never hit platform - landing site handles)
- **Test**: Unit test all hostname patterns

### Ticket 3.3: Implement Middleware Routing

**File**: `apps/platform/middleware.ts`

- Extract subdomain using helper
- Route logic:
  - `internal.amaxaimpact.org` → rewrite to `/(internal)/...` routes (admin check in layout)
  - `app.amaxaimpact.org` → NextResponse.next() (main platform home)
  - `{workspace}.amaxaimpact.org` → rewrite to `/domains/[subdomain]/...`
- Block internal routes from non-internal subdomains (return 404)
- Set `x-workspace-slug` header for workspace routes
- **Validation**: All three domain types route correctly

### Ticket 3.4: Environment Configuration

**Files**: `.env.local`, `apps/platform/next.config.ts`

- Add `NEXT_PUBLIC_ROOT_DOMAIN=amaxaimpact.org`
- Add `NEXT_PUBLIC_INTERNAL_SUBDOMAIN=internal`
- Add `NEXT_PUBLIC_APP_SUBDOMAIN=app`
- Document local development setup
- **Validation**: Env vars accessible

### Ticket 3.5: Local Development Setup

**File**: `apps/platform/README.md`

- Document `/etc/hosts` entries needed
- Create setup script `scripts/setup-local-domains.sh`
- **Validation**: Local multi-tenant dev works

### Ticket 3.6: Create Domain Route Layout

**File**: `apps/platform/src/app/domains/[domain]/layout.tsx`

- Server component
- Fetch workspace by slug (via internal Convex query)
- 404 if workspace not found
- Create WorkspaceProvider context
- **Validation**: Layout renders workspace data

### Ticket 3.7: Create WorkspaceProvider Context

**File**: `apps/platform/src/components/workspace/context.tsx` (new)

- `WorkspaceContext`: workspace `{id, name, slug, domain}`, userRole
- `WorkspaceProvider` component
- `useWorkspace()` hook
- **Validation**: Context accessible in domain routes

### Ticket 3.8: Create Workspace Home Page

**File**: `apps/platform/src/app/domains/[domain]/page.tsx`

- Display workspace name, description
- Placeholder for projects list
- **Validation**: Page renders at subdomain

---

## Sprint 4: Workspace Management UI

**Goal**: Admins create/manage workspaces. Demo: Full workspace CRUD from UI.

### Ticket 4.1: Create Workspaces List Page

**File**: `apps/platform/src/app/(internal)/workspaces/page.tsx`

- Server component with admin auth
- Fetch all workspaces via `api.workspaces.list`
- Table: name, slug, domain, created, actions
- Create workspace button
- **Validation**: List renders

### Ticket 4.2: Create Workspace Dialog

**File**: `apps/platform/src/app/(internal)/workspaces/create-dialog.tsx`

- Client component, modal form
- Fields: name (required), slug (auto-gen from name, editable)
- Submit calls `api.workspaces.create`
- Error handling for duplicate slug
- **Validation**: Workspace creates successfully

### Ticket 4.3: Create Workspace Detail Page

**File**: `apps/platform/src/app/(internal)/workspaces/[workspaceId]/page.tsx`

- Tabs: Settings, Users, (future: Branding, Domain)
- Settings form: name, slug
- Delete button with confirmation
- **Validation**: Can update workspace

### Ticket 4.4: Create Workspace Users Page

**File**: `apps/platform/src/app/(internal)/workspaces/[workspaceId]/users/page.tsx`

- List users in workspace with roles
- Add user dialog
- Role dropdown
- Remove user button
- **Validation**: User management works

### Ticket 4.5: WorkOS User Lookup Helper

**File**: `apps/platform/src/lib/workos-users.ts`

- Function to search WorkOS users by email
- Cache results briefly
- **Validation**: User search returns results

### Ticket 4.6: Create Workspace Invitation Schema

**File**: `packages/backend/convex/schema.ts`

- Add `workspaceInvitations` table: `workspaceId`, `email`, `role`, `invitedBy`, `createdAt`, `expiresAt`, `status: "pending" | "accepted" | "expired"`
- Indexes: `by_email`, `by_workspace`, `by_email_and_workspace`
- **Validation**: Schema compiles

### Ticket 4.7: Create Invitation Backend

**File**: `packages/backend/convex/workspaceInvitations.ts` (new)

- `create`: args `{workspaceId, email, role}`, requires workspace admin
- `listForWorkspace`: args `{workspaceId}`
- `listPendingForEmail`: args `{email}` - user sees their pending invites
- `accept`: args `{invitationId}` - creates workspaceToUser record
- `revoke`: args `{invitationId}` - admin cancels invite
- Send email via WorkOS on create
- **Validation**: Full invitation lifecycle works

### Ticket 4.8: Create Invitation Accept Route

**File**: `apps/platform/src/app/invite/[invitationId]/page.tsx` (new)

- Public route (with auth redirect)
- Show invitation details (workspace name, role)
- Accept/Decline buttons
- Redirect to workspace on accept
- **Validation**: User can accept invite from email link

### Ticket 4.9: Create Pending Invitations UI

**File**: `apps/platform/src/app/(app)/page.tsx` (update)

- For users with no workspaces: show pending invitations
- List pending invites with workspace name, invited by, role
- Accept button on each
- **Validation**: Users see and can accept invites

### Ticket 4.10: E2E Tests for Workspace Management

**File**: `apps/platform/tests/e2e/workspaces.spec.ts`

- Test: Create workspace
- Test: Edit workspace
- Test: Invite user (sends email)
- Test: Accept invitation
- Test: Delete workspace
- **Validation**: All E2E tests pass

---

## Sprint 5: Workspace-Scoped Projects

**Goal**: Projects belong to workspaces. Demo: Create project at workspace subdomain.

### Ticket 5.1: Update Project Create Mutation

**File**: `packages/backend/convex/projects.ts`

- Require `workspaceId` parameter
- Validate user has workspace access
- **Validation**: Project creates with workspaceId

### Ticket 5.2: Create Workspace Projects Query

**File**: `packages/backend/convex/projects.ts`

- `listForWorkspace`: args `{workspaceId}`, returns projects
- Validate workspace membership
- **Validation**: Returns workspace projects only

### Ticket 5.3: Project Migration Script

**File**: `packages/backend/convex/migrations/migrateProjects.ts`

- Internal mutation
- Create "Default" workspace if needed
- Assign orphan projects to default workspace
- Log progress
- **Validation**: All projects have workspaceId after run

### Ticket 5.4: Workspace Projects List Page

**File**: `apps/platform/src/app/domains/[domain]/projects/page.tsx`

- List projects in workspace
- Create project button (admin/coach only)
- Project cards with name, description
- **Validation**: Projects visible

### Ticket 5.5: Create Project Dialog (Workspace Context)

**File**: `apps/platform/src/app/domains/[domain]/projects/create-dialog.tsx`

- Form: name, description
- Auto-set workspaceId from context
- **Validation**: Project creates in workspace

### Ticket 5.6a: Create Workspace Project Layout

**File**: `apps/platform/src/app/domains/[domain]/project/[projectId]/layout.tsx`

- Validate project belongs to workspace
- Extend DashboardProvider with workspace context
- **Validation**: Layout validates workspace ownership

### Ticket 5.6b: Migrate Project Home Page

**File**: `apps/platform/src/app/domains/[domain]/project/[projectId]/page.tsx`

- Copy from existing `/project/[projectId]/page.tsx`
- Update imports for new context
- **Validation**: Home page renders

### Ticket 5.6c: Migrate Tasks Page

**File**: `apps/platform/src/app/domains/[domain]/project/[projectId]/tasks/page.tsx`

- Copy existing tasks page
- Update imports
- **Validation**: Tasks flow works

### Ticket 5.6d: Migrate Users Page

**File**: `apps/platform/src/app/domains/[domain]/project/[projectId]/users/`

- Copy existing users page
- Update imports
- **Validation**: User management works

### Ticket 5.6e: Migrate Settings Page

**File**: `apps/platform/src/app/domains/[domain]/project/[projectId]/settings/`

- Copy existing settings page
- Update imports
- **Validation**: Settings work

### Ticket 5.7: Update Workspace Home Page

**File**: `apps/platform/src/app/domains/[domain]/page.tsx`

- Show recent projects
- Quick actions: create project
- Team overview
- **Validation**: Dashboard functional

### Ticket 5.8: Update Sidebar for Workspace

**File**: `apps/platform/src/components/dashboard/sidebar/app-sidebar.tsx`

- Show workspace name in header
- Link back to workspace home
- **Validation**: Sidebar shows workspace context

---

## Sprint 6: Template System

**Goal**: Admins create project templates. Demo: Create template, use to scaffold project.

### Ticket 6.1: Create Template Schema

**File**: `packages/backend/convex/schema.ts`

- `projectTemplates`: `name`, `description`, `createdBy`, `isPublic: boolean`
- `templateTasks`: `templateId`, `label`, `description`, `status`, `priority`, `position: {x,y}`, `dependencies: string[]`
- Indexes: `by_public`, `by_creator`, template tasks `by_template`
- **Validation**: Schema compiles

### Ticket 6.2: Template CRUD Backend

**File**: `packages/backend/convex/projectTemplates.ts` (new)

- `create`, `get`, `list`, `update`, `remove` mutations/queries
- Permission checks (site admin only for now)
- **Test**: CRUD tests

### Ticket 6.3: Template Tasks CRUD

**File**: `packages/backend/convex/templateTasks.ts` (new)

- `create`, `update`, `remove`, `listForTemplate`
- Copy between templates
- **Validation**: Tasks CRUD works

### Ticket 6.4: Create Template from Project

**File**: `packages/backend/convex/projectTemplates.ts`

- `createFromProject`: args `{projectId, name, description}`
- Copy tasks, strip assignees/dates
- Create dependencies from edges
- **Validation**: Template created from project

### Ticket 6.5: Create Project from Template

**File**: `packages/backend/convex/projects.ts`

- `createFromTemplate`: args `{workspaceId, templateId, name}`
- Copy template tasks to project tasks
- Create taskNodes with positions
- Create edges from dependencies
- **Validation**: Project scaffolded correctly

### Ticket 6.6: Template List UI

**File**: `apps/platform/src/app/(internal)/templates/page.tsx`

- List templates
- Create template button
- **Validation**: List renders

### Ticket 6.7: Template Editor UI

**File**: `apps/platform/src/app/(internal)/templates/[templateId]/page.tsx`

- Reuse React Flow editor
- Edit template tasks visually
- Save changes
- **Validation**: Visual editing works

### Ticket 6.8: Template Selection in Project Creation

**File**: `apps/platform/src/app/domains/[domain]/projects/create-dialog.tsx`

- Add template selector
- Preview template
- Create from template option
- **Validation**: Template selection works

---

## Sprint 7: Data Isolation & Security

**Goal**: Complete workspace data isolation. Demo: Security audit passes.

### Ticket 7.1: Add Workspace Validation to Projects

**File**: `packages/backend/convex/projects.ts`

- All queries validate workspace membership
- All mutations check workspace context
- **Test**: Cross-workspace access denied

### Ticket 7.2: Add Workspace Validation to Tasks

**File**: `packages/backend/convex/tasks.ts`

- Trace task → project → workspace
- Validate access on all operations
- **Test**: Cross-workspace denied

### Ticket 7.3: Add Workspace Validation to Edges

**File**: `packages/backend/convex/edges.ts`

- Same pattern as tasks
- **Test**: Cross-workspace denied

### Ticket 7.4: Add Workspace Validation to TaskNodes

**File**: `packages/backend/convex/taskNodes.ts` (if separate)

- Validate workspace via task → project chain
- **Test**: Isolation works

### Ticket 7.5: Add Workspace Validation to UserToProjects

**File**: `packages/backend/convex/userToProjects.ts`

- Validate workspace access before project access
- **Test**: Access checks work

### Ticket 7.6: Security Test Suite

**File**: `packages/backend/convex/tests/security.test.ts`

- Test: Cross-workspace project read denied
- Test: Cross-workspace task read denied
- Test: Cross-workspace mutation denied
- Test: Unauthenticated access denied
- **Validation**: All tests pass

### Ticket 7.7: Audit Logging Schema

**File**: `packages/backend/convex/schema.ts`

- `auditLog`: `userId`, `action`, `workspaceId`, `resourceType`, `resourceId`, `timestamp`, `details`
- Index: `by_workspace_and_time`
- **Validation**: Schema compiles

### Ticket 7.8: Audit Logging Mutations

**File**: `packages/backend/convex/auditLog.ts` (new)

- `log`: internal mutation
- `query`: args `{workspaceId, limit?, offset?}`
- Helper to log from other mutations
- **Validation**: Logs created on actions

---

## Sprint 8: Polish & Production Readiness

**Goal**: Production-ready. Demo: Full end-to-end flow.

### Ticket 8.1: Error Boundaries

**Files**: Layout files

- Workspace not found page
- Permission denied page
- Generic error boundary
- **Validation**: Graceful errors

### Ticket 8.2: Loading States

**Files**: Page files

- Skeleton loaders
- Suspense boundaries
- **Validation**: No layout shift

### Ticket 8.3: SEO & Metadata

**File**: `apps/platform/src/app/domains/[domain]/layout.tsx`

- Dynamic metadata from workspace
- Open Graph tags
- **Validation**: Correct metadata

### Ticket 8.4: Performance Optimization

- Review query patterns
- Add missing indexes
- Memoization audit
- **Validation**: Page loads < 2s

### Ticket 8.5: E2E Test Suite

**File**: `apps/platform/tests/e2e/multi-tenant.spec.ts`

- Create workspace flow
- Subdomain routing
- Project creation in workspace
- Cross-workspace isolation
- **Validation**: All pass

### Ticket 8.6: Documentation

**Files**: README, docs/

- Architecture overview
- Local dev setup
- Deployment guide
- **Validation**: New dev can setup

### Ticket 8.7: Migration Guide

**File**: `docs/migration-to-workspaces.md`

- Data migration steps
- Rollback procedures
- **Validation**: Guide reviewed

---

## Sprint 9: Workspace Customization (Optional)

**Goal**: Workspace branding. Demo: Custom colors visible.

### Ticket 9.1: Workspace Settings Schema

**File**: `packages/backend/convex/schema.ts`

- Add to workspaces: `settings: {primaryColor?, logo?, favicon?}`
- `defaultTemplateId`
- **Validation**: Schema compiles

### Ticket 9.2: Workspace Settings Mutations

**File**: `packages/backend/convex/workspaces.ts`

- `updateSettings`, `getSettings`
- File upload for logo/favicon
- **Validation**: Settings persist

### Ticket 9.3: Branding UI

**File**: `apps/platform/src/app/(internal)/workspaces/[workspaceId]/branding/page.tsx`

- Color picker
- Logo upload
- Preview panel
- **Validation**: Branding saves

### Ticket 9.4: Apply Branding to Client Routes

**File**: `apps/platform/src/app/domains/[domain]/layout.tsx`

- Inject CSS variables
- Set favicon
- **Validation**: Branding visible

---

## Sprint 10: Custom Domains (Optional)

**Goal**: Custom domains work. Demo: Custom domain routes correctly.

### Ticket 10.1: Vercel SDK Setup

- Add `@vercel/sdk` dependency
- Configure env vars: VERCEL_TOKEN, VERCEL_TEAM_ID, VERCEL_PROJECT_ID
- **Validation**: SDK imports

### Ticket 10.2: Domain Registration Action

**File**: `packages/backend/convex/workspaceDomains.ts`

- `registerDomain` action
- Call Vercel API
- Store status in workspace
- **Validation**: Domain added to Vercel

### Ticket 10.3: Domain Verification

**File**: `packages/backend/convex/workspaceDomains.ts`

- `verifyDomain` action
- Return verification instructions
- **Validation**: Verification flow works

### Ticket 10.4: Domain Management UI

**File**: `apps/platform/src/app/(internal)/workspaces/[workspaceId]/domain/page.tsx`

- Domain input
- Status indicator
- Instructions
- **Validation**: Full flow works

### Ticket 10.5: Middleware Custom Domain Support

**File**: `apps/platform/middleware.ts`

- Check hostname against workspace custom domains
- Route to workspace if match
- **Validation**: Custom domain routes

---

## Design Decisions (Resolved)

### Architecture

- Site admins: Full read/write access, bypass ALL permission checks
- applicationForms: Internal only (not workspace-scoped)
- presence room format: `ws:{workspaceId}:project:{projectId}:tasks`
- Workspace role is ceiling for project roles

### Business Logic

- Project creation: Workspace admins only
- Max projects: Unlimited (add limits later if needed)
- User with no workspaces: Show pending email invitations only (security)
- Moving projects between workspaces: Deferred
- Workspace slugs: Immutable (tied to subdomain)

### Security

- SSL: Vercel handles automatically
- Invitations: Email via WorkOS → accept route
- Workspace deletion: Soft delete with 30-day retention

### Scale

- Max workspaces per user: Unlimited
- Billing: Not in scope

---

## Critical Files Reference

**Backend**:

- `packages/backend/convex/schema.ts` - All table definitions
- `packages/backend/convex/permissions.ts` - Permission helpers with site admin bypass
- `packages/backend/convex/workspaces.ts` - Workspace CRUD
- `packages/backend/convex/workspaceToUser.ts` - Workspace membership
- `packages/backend/convex/workspaceInvitations.ts` - Invitation flow
- `packages/backend/convex/projects.ts` - Project mutations

**Frontend**:

- `apps/platform/middleware.ts` - Subdomain routing
- `apps/platform/src/lib/subdomain.ts` - Hostname parsing
- `apps/platform/src/components/workspace/context.tsx` - Workspace context
- `apps/platform/src/components/dashboard/context.tsx` - Dashboard context
- `apps/platform/src/app/(internal)/layout.tsx` - Internal routes layout
- `apps/platform/src/app/domains/[domain]/layout.tsx` - Workspace routes layout
- `apps/platform/src/app/invite/[invitationId]/page.tsx` - Invitation accept
