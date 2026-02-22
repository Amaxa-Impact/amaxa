Project Updates
Multi-tenant Platform
Now that we've established a solid baseline for our platform will function. We have the model of projects. We are now going to generalize that model into a multi-tenant platform.

So far we have had a singular app.amaxaimpact.org, however as we gain clients we want clean seperation of clients information while also keeping are framework. We are going to be doing this by adding the abstraction of the "workspace."
Workspaces
First we need to understand how our app is composed right now. We have 2 distinct purposes our app servers:
Internal Tooling
Client Facing Tooling
Internal Tooling

This will be in the domain of "app.amaxaimpact.org" and will have two main functions:
Managing workspaces - this will include creating and managing workspaces in terms of the workspace name, domain, and templates

Templates is how we generalize, each client will get their own workspace. It will live in {workspace}.amaxaimpact.org. Templates is an abstraction that allows for us to take that core client facing tooling and customize it. Right now the template will only include various templates for the "critical chain mvp." This is currently housed in: "/project/[id]/tasks. It works with react flow and is a real time editor for tasks. It functions as the base of our task management system. Site wide admins should have the ability to set up various template mvps that can be consumed by clients in projects
Our scheduling infrastructure: We currently have a applications system and a scheduling system built. This will be housed in the app.amaxaimpact.org domain and in that domain only. It will function exactly the same.
Client Facing Tooling (aka platform core)
The core of the platform consists of making the lives of cohorts working on projects easier. We've found via research with our cohorts that teams thrive with a structured approach to implementation cycle. We will need to be able to assign users to projects where they will work with their peers.
Projects
/project/id:
The page will act as the home for a team working on a project. It consists of a few core features:
Tasks Table: This will function as a visual representation of all the tasks that exist in a project. It will have fields including but not limited to: Task Name, Due By, Assigned To, Status (Block, Complete, In-Progress, To Do). You should be able to filter by all those fields
Progress Visualization: A series of charts and graphs that allow the users to see what progress they've made on the project. More details tbd at a later date
/project/id/tasks:
This page will function as a visual representation of tasks that are in a project in a "critical chain." You will be able to visual all tasks via a flowchart. It will consist of 2 states, an edit state where you can change params about a feature, a visual state where the only mutations you can perform are moving around nodes (tasks) and add new tasks.
/project/id/users:
This page will be a RBAC control panel for projects. This page will be view only for students assigned to a project but editable by coaches and site wide admins.
You should be able to add users to the project, edit current user's permissions here, remove users from the project
/project/id/users:
Similarly, this page will be view only for students assigned to a project but editable by coaches and site wide admins.
Edit forms for project name description and any other config items that might come up in the future
We will not have projects belong to workspaces, different clients will have their own workspaces. We will use workspaces for our different cohort batchs (cohorts are groups of highschool students to work on projects for 3 or so months).

---

We will manage subdomain stuff with the vercel:

# Multi-Tenant Template

Multi-tenant applications allow you to serve different customers with unique domains from a single codebase. This template demonstrates how to build a platform that dynamically routes requests based on the incoming domain, enabling you to create white-label solutions, SaaS platforms, and marketplace applications.

<img alt="Multi-Tenant Architecture" src={__img0} placeholder="blur" />

<Callout>
  Deploy the template directly: [vercel.com/templates/saas/platforms-starter-kit](https://vercel.com/templates/saas/platforms-starter-kit)
</Callout>

## What is Multi-Tenancy?

Multi-tenancy is an architecture pattern where a single instance of an application serves multiple tenants (customers or organizations). Each tenant gets their own subdomain or custom domain while sharing the same underlying infrastructure and codebase.

Common use cases include:

- **White-label platforms** - Rebrandable applications for different clients
- **SaaS marketplaces** - Multiple stores/sites under one platform
- **Content management systems** - Publishing platforms with custom domains
- **Agency portfolios** - Client websites managed from one codebase

## How It Works

The multi-tenant template uses Next.js middleware to intercept incoming requests and route them based on the hostname:

1. **Request arrives** - A user visits `customer1.example.com` or `customer1.com`
2. **Middleware intercepts** - Extracts the hostname from the request headers
3. **Dynamic routing** - Rewrites the URL internally to include tenant context
4. **Tenant-specific content** - Renders customized content for that domain
5. **Response served** - User sees their branded experience

## Getting Started

### Step 1: Clone the Template

Start by cloning the multi-tenant template:

```bash title="Terminal"
git clone https://github.com/vercel/platforms
cd platforms
pnpm install
```

The template includes:

- **Next.js App Router** for modern React architecture
- **Middleware** for domain-based routing
- **Tailwind CSS** for styling
- **TypeScript** for type safety

### Step 2: Set Up Local Development

For local development, you'll need to map custom domains to localhost. Add these entries to your hosts file:

```text title="/etc/hosts"
127.0.0.1 tenant1.localhost
127.0.0.1 tenant2.localhost
127.0.0.1 custom.localhost
```

Then start the development server:

```bash title="Terminal"
pnpm dev
```

Visit different domains to see tenant-specific content:

- [http://localhost:3002](http://localhost:3002) - Default home page
- [http://tenant1.localhost:3002](http://tenant1.localhost:3002) - Tenant 1's site
- [http://tenant2.localhost:3002](http://tenant2.localhost:3002) - Tenant 2's site

### Step 3: Configure Middleware

The middleware is the heart of the multi-tenant system. It intercepts all requests and routes them appropriately:

```typescript title="middleware.ts"
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  // Add tenant context to the request and rewrite to /[domain]

  // if it starts with /domains, pass through
  if (request.nextUrl.pathname.startsWith("/domains")) {
    return NextResponse.next();
  }

  const target = `${request.nextUrl.href}domains/${hostname}`;
  const response = NextResponse.rewrite(target);
  response.headers.set("x-tenant-domain", hostname);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### Step 4: Create Tenant-Specific Pages

Each tenant's content is served from a dynamic route that receives the domain as a parameter:

```tsx title="app/domains/[domain]/page.tsx"
export default async function TenantPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;

  // Fetch tenant-specific data
  const tenant = await getTenantByDomain(domain);

  // Render customized content
  return (
    <div className="min-h-screen">
      <header className="p-6" style={{ backgroundColor: tenant.brandColor }}>
        <h1 className="text-3xl font-bold text-white">{tenant.name}</h1>
      </header>

      <main className="p-6">
        {/* Tenant-specific content */}
        <TenantContent data={tenant.content} />
      </main>
    </div>
  );
}
```

## Core Components

### Domain Resolution

The system identifies tenants through their domain:

```typescript title="middleware.ts"
function extractSubdomain(request: NextRequest): string | null {
  const url = request.url;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];

  // Local development environment
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    // Try to extract subdomain from the full URL
    const fullUrlMatch = url.match(/http:\/\/([^.]+)\.localhost/);
    if (fullUrlMatch && fullUrlMatch[1]) {
      return fullUrlMatch[1];
    }

    // Fallback to host header approach
    if (hostname.includes(".localhost")) {
      return hostname.split(".")[0];
    }

    return null;
  }

  // Production environment
  const rootDomainFormatted = rootDomain.split(":")[0];

  // Handle preview deployment URLs (tenant---branch-name.vercel.app)
  if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
    const parts = hostname.split("---");
    return parts.length > 0 ? parts[0] : null;
  }

  // Regular subdomain detection
  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`);

  return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, "") : null;
}
```

### Domain Configuration

Configure domains in your Vercel dashboard:

1. **Wildcard subdomain** - `*.yourdomain.com`
   - Captures all subdomains automatically
   - Perfect for user-generated sites

2. **Custom domains** - Add individually
   - Each tenant's custom domain
   - Requires DNS configuration per domain

## Use Cases

### SaaS Platforms

Build software that serves multiple organizations with isolated data and custom branding.

### E-commerce Marketplaces

Create platforms where vendors get their own storefronts with unique domains.

### Content Publishing

Enable creators to publish content on their custom domains while using your platform.

### Agency Solutions

Manage multiple client websites from a single codebase with individual customizations.

---

The multi-tenant template provides a solid foundation for building platforms that serve multiple customers from a single codebase. By leveraging Next.js middleware and dynamic routing, you can create scalable SaaS applications that offer custom domains, personalized experiences, and efficient resource utilization.

Whether you're building a white-label solution, a marketplace platform, or a content management system, this architecture pattern enables you to grow from one to thousands of tenants without infrastructure complexity.

## Tenants

### What is a tenant

A tenant represents a customer, workspace, or organization within your multi-tenant application. Each tenant has its own data, configuration, and branding, but all tenants share the same codebase and deployment.

**Examples**:

- Blog platform: Each writer with their own blog is a tenant
- Documentation platform: Each company with its own docs site is a tenant
- E-commerce platform: Each store owner is a tenant

### Tenant identification strategies

You can identify tenants using three approaches:

**Subdomain-based**: Extract the tenant from the subdomain (`tenant1.yourapp.com`)

```ts title="middleware.ts"
const hostname = request.headers.get("host");
const subdomain = hostname.split(".")[0]; // "tenant1"
```

**Custom domain-based**: Map custom domains to tenants (`tenant1.com` → Tenant 1)

```ts title="middleware.ts"
// Map custom domain to tenant in database
const tenant = await db.tenant.findFirst({
  where: { customDomain: hostname },
});
```

**Path-based**: Extract tenant from URL path (`/tenant1/dashboard`)

```ts title="middleware.ts"
const pathname = request.nextUrl.pathname;
const tenantSlug = pathname.split("/")[1]; // "tenant1"
```

### Tenant data isolation

Multi-tenant applications must isolate data between tenants:

**Database-level**: Use tenant ID in all queries

```ts title="database.ts"
const posts = await db.post.findMany({
  where: { tenantId: tenant.id },
});
```

**Application-level**: Middleware ensures requests can only access their tenant's data

**Edge Config**: Store tenant configuration for fast lookups at the edge

## Domains

### Wildcard domains

Wildcard domains let you automatically serve all subdomains from a single Vercel project:

- Add `*.yourapp.com` to your project
- Point your domain to Vercel's nameservers
- Any subdomain (`tenant1.yourapp.com`, `tenant2.yourapp.com`) automatically routes to your app
- Vercel issues SSL certificates for each subdomain on the fly

**Requirements**: Must use Vercel's nameservers (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`)

### Custom domains

Custom domains let tenants bring their own domain:

- Add `tenant1.com` to your Vercel project via SDK
- Tenant configures DNS (CNAME or nameservers)
- Verify domain ownership (TXT record)
- Vercel issues SSL certificate automatically

### SSL certificate issuance

Vercel automatically issues SSL certificates for all domains using Let's Encrypt:

- Wildcard domains: Single wildcard certificate covers all subdomains
- Custom domains: Individual certificate per domain
- Automatic renewal before expiration
- No configuration required

### Domain verification

For domains already in use on Vercel, ownership verification is required:

1. Add domain to your project
2. Vercel generates a unique TXT record
3. Tenant adds TXT record to their DNS
4. Verify ownership via SDK or dashboard
5. Certificate issues once verified

## Routing

### How middleware resolves tenants

Next.js middleware runs on every request before your pages render:

```ts title="middleware.ts"
export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host");

  // Get tenant from subdomain or custom domain
  const tenant = await resolveTenant(hostname);

  // Add tenant to request headers
  const response = NextResponse.next();
  response.headers.set("x-tenant-id", tenant.id);

  return response;
}
```

### Request handling flow

1. User visits `tenant1.yourapp.com`
2. Request hits Vercel's edge network
3. Middleware extracts subdomain (`tenant1`)
4. Middleware looks up tenant in database or Edge Config
5. Middleware adds tenant context to request headers
6. Page component reads tenant from headers
7. Page renders with tenant-specific data

### Performance considerations

**Edge Config**: Store tenant configuration at the edge for sub-10ms lookups

```ts title="edge-config.ts"
import { get } from "@vercel/edge-config";

const tenant = await get(`tenant_${hostname}`);
```

**Caching**: Cache tenant lookups in middleware to reduce database queries

**Connection pooling**: Use connection pooling for database queries to handle multiple tenants efficiently

## Architecture

### Single deployment serving multiple domains

Multi-tenant architecture means:

- One Next.js codebase
- One Vercel deployment
- Multiple domains (subdomains + custom domains)
- Shared infrastructure and resources
- Tenant-aware routing and data access

### Tenant context

Pass tenant information through your application:

**In middleware**: Set headers

```ts title="middleware.ts"
response.headers.set("x-tenant-id", tenant.id);
```

**In server components**: Read headers

```ts title="server-component.ts"
import { headers } from "next/headers";

const tenantId = headers().get("x-tenant-id");
```

**In API routes**: Access request headers

```ts title="api-route.ts"
const tenantId = request.headers.get("x-tenant-id");
```

# Configuring Custom Domains

## Using wildcard domains

If you plan on offering subdomains like `*.acme.com`, add a wildcard domain to your Vercel project. This requires using [Vercel's nameservers](https://vercel.com/docs/projects/domains/working-with-nameservers) so that Vercel can manage the DNS challenges necessary for generating wildcard SSL certificates.

1. Point your domain to Vercel's nameservers (`ns1.vercel-dns.com` and `ns2.vercel-dns.com`).
2. In your Vercel project settings, add the apex domain (e.g., `acme.com`).
3. Add a wildcard domain: `.acme.com`.

Now, any `tenant.acme.com` you create—whether it's `tenant1.acme.com` or `docs.tenant1.acme.com`—automatically resolves to your Vercel deployment. Vercel issues individual certificates for each subdomain on the fly.

## Offering custom domains

You can also give tenants the option to bring their own domain. In that case, you'll want your code to:

1. Provision and assign the tenant's domain to your Vercel project.
2. Verify the domain (to ensure the tenant truly owns it).
3. Automatically generate an SSL certificate.

## Adding a domain programmatically

You can add a new domain through the [Vercel SDK](https://vercel.com/docs/sdk). For example:

```ts title="add-domain.ts"
import { VercelCore as Vercel } from "@vercel/sdk/core.js";
import { projectsAddProjectDomain } from "@vercel/sdk/funcs/projectsAddProjectDomain.js";

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

// The 'idOrName' is your project name in Vercel, for example: 'multi-tenant-app'
await projectsAddProjectDomain(vercel, {
  idOrName: "my-multi-tenant-app",
  teamId: "team_1234",
  requestBody: {
    // The tenant's custom domain
    name: "customacmesite.com",
  },
});
```

Once the domain is added, Vercel attempts to issue an SSL certificate automatically.

## Verifying domain ownership

If the domain is already in use on Vercel, the user needs to set a TXT record to prove ownership of it.

You can check the verification status and trigger manual verification:

```ts title="verify-domain.ts"
import { VercelCore as Vercel } from "@vercel/sdk/core.js";
import { projectsGetProjectDomain } from "@vercel/sdk/funcs/projectsGetProjectDomain.js";
import { projectsVerifyProjectDomain } from "@vercel/sdk/funcs/projectsVerifyProjectDomain.js";

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

const domain = "customacmesite.com";

const [domainResponse, verifyResponse] = await Promise.all([
  projectsGetProjectDomain(vercel, {
    idOrName: "my-multi-tenant-app",
    teamId: "team_1234",
    domain,
  }),
  projectsVerifyProjectDomain(vercel, {
    idOrName: "my-multi-tenant-app",
    teamId: "team_1234",
    domain,
  }),
]);

const { value: result } = verifyResponse;

if (!result?.verified) {
  console.log(`Domain verification required for ${domain}.`);
  // You can prompt the tenant to add a TXT record or switch nameservers.
}
```

## Handling redirects and apex domains

### Redirecting between apex and "www"

Some tenants might want `www.customacmesite.com` to redirect automatically to their apex domain `customacmesite.com`, or the other way around.

1. Add both `customacmesite.com` and `www.customacmesite.com` to your Vercel project.
2. Configure a redirect for `www.customacmesite.com` to the apex domain by setting `redirect: customacmesite.com` through the API or your Vercel dashboard.

This ensures a consistent user experience and prevents issues with duplicate content.

### Avoiding duplicate content across subdomains

If you offer both `tenant.acme.com` and `customacmesite.com` for the same tenant, you may want to redirect the subdomain to the custom domain (or vice versa) to avoid search engine duplicate content. Alternatively, set a canonical URL in your HTML `<head>` to indicate which domain is the "official" one.

## Deleting or removing domains

If a tenant cancels or no longer needs their custom domain, you can remove it from your Vercel account using the SDK:

```ts title="remove-domain.ts"
import { VercelCore as Vercel } from "@vercel/sdk/core.js";
import { domainsDeleteDomain } from "@vercel/sdk/funcs/domainsDeleteDomain.js";
import { projectsRemoveProjectDomain } from "@vercel/sdk/funcs/projectsRemoveProjectDomain.js";

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

await Promise.all([
  projectsRemoveProjectDomain(vercel, {
    idOrName: "my-multi-tenant-app",
    teamId: "team_1234",
    domain: "customacmesite.com",
  }),
  domainsDeleteDomain(vercel, {
    domain: "customacmesite.com",
  }),
]);
```

The first call disassociates the domain from your project, and the second removes it from your account entirely.

## Troubleshooting common issues

# Quickstart

<Video src="https://www.youtube.com/embed/vVYlCnNjEWA?si=FlkfRF7ktnKCS_VH" />

## Types of domains

This guide walks you through setting up domains for your multi-tenant application. There are two main approaches:

### Wildcard Domains (\*.acme.com)

If you want to offer subdomains like `tenant.acme.com`, you'll need to:

1. Configure wildcard domains for subdomains like `*.acme.com`

### Custom Domains (tenant.com)

If you want to allow tenants to use their own domains, you'll need to:

1. Enable custom domain support for your tenants
2. Add domains programmatically using the Vercel SDK
3. Verify domain ownership with TXT records
4. Configure domain redirects and handle SEO
5. Clean up domains when tenants leave

You can implement either approach or both depending on your needs.

## Wildcard Domain Setup

If you plan on offering subdomains like `*.acme.com`, add a wildcard domain to your Vercel project. This requires using [Vercel's nameservers](https://vercel.com/docs/projects/domains/working-with-nameservers) so that Vercel can manage the DNS challenges necessary for generating wildcard SSL certificates.

1. Point your domain to Vercel's nameservers (`ns1.vercel-dns.com` and `ns2.vercel-dns.com`).
2. In your Vercel project settings, add the apex domain (e.g., `acme.com`).
3. Add a wildcard domain: `.acme.com`.

Now, any `tenant.acme.com` you create—whether it's `tenant1.acme.com` or `docs.tenant1.acme.com`—automatically resolves to your Vercel deployment. Vercel issues individual certificates for each subdomain on the fly.

## Custom Domain Setup

The following steps guide you through setting up custom domain support for your tenants. This allows them to use their own domains (e.g., `customacmesite.com`) instead of subdomains.

### Step 1: Enable Custom Domains

You can also give tenants the option to bring their own domain. In that case, you'll want your code to:

1. Provision and assign the tenant's domain to your Vercel project.
2. Verify the domain (to ensure the tenant truly owns it).
3. Automatically generate an SSL certificate.

### Step 2: Add Domains Programmatically

You can add a new domain through the [Vercel SDK](https://vercel.com/docs/sdk). For example:

```ts title="add-domain.ts"
import { VercelCore as Vercel } from "@vercel/sdk/core.js";
import { projectsAddProjectDomain } from "@vercel/sdk/funcs/projectsAddProjectDomain.js";

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

// The 'idOrName' is your project name in Vercel, for example: 'multi-tenant-app'
await projectsAddProjectDomain(vercel, {
  idOrName: "my-multi-tenant-app",
  teamId: "team_1234",
  requestBody: {
    // The tenant's custom domain
    name: "customacmesite.com",
  },
});
```

Once the domain is added, Vercel attempts to issue an SSL certificate automatically.

### Step 3: Verify Domain Ownership

If the domain is already in use on Vercel, the user needs to set a TXT record to prove ownership of it.

You can check the verification status and trigger manual verification:

```ts title="verify-domain.ts"
import { VercelCore as Vercel } from "@vercel/sdk/core.js";
import { projectsGetProjectDomain } from "@vercel/sdk/funcs/projectsGetProjectDomain.js";
import { projectsVerifyProjectDomain } from "@vercel/sdk/funcs/projectsVerifyProjectDomain.js";

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

const domain = "customacmesite.com";

const [domainResponse, verifyResponse] = await Promise.all([
  projectsGetProjectDomain(vercel, {
    idOrName: "my-multi-tenant-app",
    teamId: "team_1234",
    domain,
  }),
  projectsVerifyProjectDomain(vercel, {
    idOrName: "my-multi-tenant-app",
    teamId: "team_1234",
    domain,
  }),
]);

const { value: result } = verifyResponse;

if (!result?.verified) {
  console.log(`Domain verification required for ${domain}.`);
  // You can prompt the tenant to add a TXT record or switch nameservers.
}
```

### Step 4: Configure Redirects

#### Redirecting between apex and "www"

Some tenants might want `www.customacmesite.com` to redirect automatically to their apex domain `customacmesite.com`, or the other way around.

1. Add both `customacmesite.com` and `www.customacmesite.com` to your Vercel project.
2. Configure a redirect for `www.customacmesite.com` to the apex domain by setting `redirect: customacmesite.com` through the API or your Vercel dashboard.

This ensures a consistent user experience and prevents issues with duplicate content.

#### Avoiding duplicate content across subdomains

If you offer both `tenant.acme.com` and `customacmesite.com` for the same tenant, you may want to redirect the subdomain to the custom domain (or vice versa) to avoid search engine duplicate content. Alternatively, set a canonical URL in your HTML `<head>` to indicate which domain is the "official" one.

### Step 5: Clean Up Domains

If a tenant cancels or no longer needs their custom domain, you can remove it from your Vercel account using the SDK:

```ts title="remove-domain.ts"
import { VercelCore as Vercel } from "@vercel/sdk/core.js";
import { domainsDeleteDomain } from "@vercel/sdk/funcs/domainsDeleteDomain.js";
import { projectsRemoveProjectDomain } from "@vercel/sdk/funcs/projectsRemoveProjectDomain.js";

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

await Promise.all([
  projectsRemoveProjectDomain(vercel, {
    idOrName: "my-multi-tenant-app",
    teamId: "team_1234",
    domain: "customacmesite.com",
  }),
  domainsDeleteDomain(vercel, {
    domain: "customacmesite.com",
  }),
]);
```

The first call disassociates the domain from your project, and the second removes it from your account entirely.

# Configuring Custom Domains

## Using wildcard domains

If you plan on offering subdomains like `*.acme.com`, add a wildcard domain to your Vercel project. This requires using [Vercel's nameservers](https://vercel.com/docs/projects/domains/working-with-nameservers) so that Vercel can manage the DNS challenges necessary for generating wildcard SSL certificates.

1. Point your domain to Vercel's nameservers (`ns1.vercel-dns.com` and `ns2.vercel-dns.com`).
2. In your Vercel project settings, add the apex domain (e.g., `acme.com`).
3. Add a wildcard domain: `.acme.com`.

Now, any `tenant.acme.com` you create—whether it's `tenant1.acme.com` or `docs.tenant1.acme.com`—automatically resolves to your Vercel deployment. Vercel issues individual certificates for each subdomain on the fly.

## Offering custom domains

You can also give tenants the option to bring their own domain. In that case, you'll want your code to:

1. Provision and assign the tenant's domain to your Vercel project.
2. Verify the domain (to ensure the tenant truly owns it).
3. Automatically generate an SSL certificate.

## Adding a domain programmatically

You can add a new domain through the [Vercel SDK](https://vercel.com/docs/sdk). For example:

```ts title="add-domain.ts"
import { VercelCore as Vercel } from "@vercel/sdk/core.js";
import { projectsAddProjectDomain } from "@vercel/sdk/funcs/projectsAddProjectDomain.js";

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

// The 'idOrName' is your project name in Vercel, for example: 'multi-tenant-app'
await projectsAddProjectDomain(vercel, {
  idOrName: "my-multi-tenant-app",
  teamId: "team_1234",
  requestBody: {
    // The tenant's custom domain
    name: "customacmesite.com",
  },
});
```

Once the domain is added, Vercel attempts to issue an SSL certificate automatically.

## Verifying domain ownership

If the domain is already in use on Vercel, the user needs to set a TXT record to prove ownership of it.

You can check the verification status and trigger manual verification:

```ts title="verify-domain.ts"
import { VercelCore as Vercel } from "@vercel/sdk/core.js";
import { projectsGetProjectDomain } from "@vercel/sdk/funcs/projectsGetProjectDomain.js";
import { projectsVerifyProjectDomain } from "@vercel/sdk/funcs/projectsVerifyProjectDomain.js";

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

const domain = "customacmesite.com";

const [domainResponse, verifyResponse] = await Promise.all([
  projectsGetProjectDomain(vercel, {
    idOrName: "my-multi-tenant-app",
    teamId: "team_1234",
    domain,
  }),
  projectsVerifyProjectDomain(vercel, {
    idOrName: "my-multi-tenant-app",
    teamId: "team_1234",
    domain,
  }),
]);

const { value: result } = verifyResponse;

if (!result?.verified) {
  console.log(`Domain verification required for ${domain}.`);
  // You can prompt the tenant to add a TXT record or switch nameservers.
}
```

## Handling redirects and apex domains

### Redirecting between apex and "www"

Some tenants might want `www.customacmesite.com` to redirect automatically to their apex domain `customacmesite.com`, or the other way around.

1. Add both `customacmesite.com` and `www.customacmesite.com` to your Vercel project.
2. Configure a redirect for `www.customacmesite.com` to the apex domain by setting `redirect: customacmesite.com` through the API or your Vercel dashboard.

This ensures a consistent user experience and prevents issues with duplicate content.

### Avoiding duplicate content across subdomains

If you offer both `tenant.acme.com` and `customacmesite.com` for the same tenant, you may want to redirect the subdomain to the custom domain (or vice versa) to avoid search engine duplicate content. Alternatively, set a canonical URL in your HTML `<head>` to indicate which domain is the "official" one.

## Deleting or removing domains

If a tenant cancels or no longer needs their custom domain, you can remove it from your Vercel account using the SDK:

```ts title="remove-domain.ts"
import { VercelCore as Vercel } from "@vercel/sdk/core.js";
import { domainsDeleteDomain } from "@vercel/sdk/funcs/domainsDeleteDomain.js";
import { projectsRemoveProjectDomain } from "@vercel/sdk/funcs/projectsRemoveProjectDomain.js";

const vercel = new Vercel({
  bearerToken: process.env.VERCEL_TOKEN,
});

await Promise.all([
  projectsRemoveProjectDomain(vercel, {
    idOrName: "my-multi-tenant-app",
    teamId: "team_1234",
    domain: "customacmesite.com",
  }),
  domainsDeleteDomain(vercel, {
    domain: "customacmesite.com",
  }),
]);
```

The first call disassociates the domain from your project, and the second removes it from your account entirely.

## Troubleshooting common issues

Here are a few common issues you might run into and how to solve them:

### DNS propagation delays

After pointing your nameservers to Vercel or adding CNAME records, changes can take 24–48 hours to propagate. Use [WhatsMyDNS](https://www.whatsmydns.net/) to confirm updates worldwide.

### Forgetting to verify domain ownership

If you add a tenant's domain but never verify it (e.g., by adding a `TXT` record or using Vercel nameservers), SSL certificates won't be issued. Always check the domain's status in your Vercel project or with the SDK.

### Wildcard domain requires Vercel nameservers

If you try to add `.acme.com` without pointing to `ns1.vercel-dns.com` and `ns2.vercel-dns.com`, wildcard SSL won't work. Make sure the apex domain's nameservers are correctly set.

### Exceeding subdomain length for preview URLs

Each DNS label has a [63-character limit](https://vercel.com/guides/why-is-my-vercel-deployment-url-being-shortened#rfc-1035). If you have a very long branch name plus a tenant subdomain, the fully generated preview URL might fail to resolve. Keep branch names concise.

### Duplicate content SEO issues

If the same site is served from both subdomain and custom domain, consider using [canonical](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#alternates) tags or auto-redirecting to the primary domain.

### Misspelled domain

A small typo can block domain verification or routing, so double-check your domain spelling.

Last updated on June 12, 2025

# Configuring Custom Subpaths

Custom subpaths let customers host your platform content on any path of their exisitng domain, like `company.com/docs` or `startup.com/help`, while you maintain a single Next.js application and they host the rest of their site separetely.

## Single app, multiple subpaths

Use a catch-all route to handle all customer requests in one application:

```tsx title="app/sites/[...slug]/page.tsx"
export default async function CustomerSite({
  params,
}: {
  params: { slug: string[] };
}) {
  const [customerSlug, ...contentPath] = params.slug;

  // Load customer config
  const customer = await getCustomer(customerSlug);
  if (!customer) return notFound();

  // Load customer-specific content
  const content = await getContent(customer.id, contentPath.join("/"));

  return (
    <div>
      <h1>{customer.name}</h1>
      <div>{content}</div>
    </div>
  );
}
```

This handles requests like:

- `yourapp.com/sites/acme/getting-started`
- `yourapp.com/sites/startup/api-reference`

## Redirect subdomains to paths

Redirect customer subdomains to path-based routes:

```ts title="middleware.ts"
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  // Check if it's a customer subdomain
  const subdomain = hostname.split(".")[0];

  if (
    subdomain !== "www" &&
    subdomain !== "app" &&
    hostname.includes("yourapp.com")
  ) {
    // Rewrite vercel.yourapp.com/guide -> yourapp.com/sites/vercel/guide
    const rewriteUrl = new URL(`/sites/${subdomain}${pathname}`, request.url);
    rewriteUrl.host = "yourapp.com";

    return NextResponse.rewrite(rewriteUrl);
  }

  return NextResponse.next();
}
```

## Set unique asset prefix

Configure Next.js to use a unique asset prefix to avoid conflicts:

```js title="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: "/your-platform-assets",

  async rewrites() {
    return [
      {
        source: "/your-platform-assets/_next/:path*",
        destination: "/_next/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
```

This ensures your CSS, JS, and images load from `/your-platform-assets/_next/...` instead of `/_next/...`.

## Customer domain setup

Customers map two paths on their domain to your platform:

**Content mapping:**

```
/docs/:path* -> https://yourapp.com/sites/customer-slug/:path*
```

**Asset mapping:**

```
/your-platform-assets/:path* -> https://yourapp.com/your-platform-assets/:path*
```

Example with Vercel routing middleware:

```ts title="middleware.ts"
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Route content requests
  if (pathname.startsWith("/docs/")) {
    const targetPath = pathname.replace("/docs/", "/sites/customer-slug/");
    const targetUrl = `https://yourapp.com${targetPath}`;

    return NextResponse.rewrite(new URL(targetUrl));
  }

  // Route asset requests
  if (pathname.startsWith("/your-platform-assets/")) {
    const targetUrl = `https://yourapp.com${pathname}`;
    return NextResponse.rewrite(new URL(targetUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/docs/:path*", "/your-platform-assets/:path*"],
};
```

## Handle customer configuration

Store customer settings and customize the experience:

```tsx title="app/sites/[...slug]/layout.tsx"
export default async function CustomerLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string[] };
}) {
  const customerSlug = params.slug[0];
  const customer = await getCustomer(customerSlug);

  return (
    <html>
      <head>
        <title>{customer.siteTitle}</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --primary-color: ${customer.primaryColor};
              --font-family: ${customer.fontFamily};
            }
          `,
          }}
        />
      </head>
      <body>
        <nav style={{ backgroundColor: customer.primaryColor }}>
          <img src={customer.logo} alt={customer.name} />
        </nav>
        {children}
      </body>
    </html>
  );
}
```

# Multi-tenant preview URLs

Multi-tenant preview URLs let you test tenant-specific experiences in preview deployments without configuring additional domains. Add any prefix before `---` in a preview URL, and Vercel routes the request to the same deployment while passing the full hostname to your code.

<Callout>
  This feature requires a [custom preview suffix
  suffix](https://vercel.com/docs/deployments/preview-deployment-suffix). It
  does not work with the default `.vercel.app` suffix.
</Callout>

## The problem

Standard preview URLs like `my-app-git-feature.vercel.dev` work well for single-tenant applications, but multi-tenant apps need to test changes for each tenant separately.

Without tenant-aware previews, you would need to:

- Manually switch tenant context in your application
- Deploy separate preview environments per tenant
- Manually assign domains to each preview deployment

## The solution

You can add any **dynamic prefix** before `---` in your preview URL:

```
{prefix}---{preview-url}
```

Vercel routes the request to the same deployment as `{preview-url}`, but your code receives the full hostname including the prefix. This lets you extract the prefix and handle tenant routing however you want.

**Examples**:

| URL                                      | Routes to                       | Your code receives                             |
| ---------------------------------------- | ------------------------------- | ---------------------------------------------- |
| `acme---preview-xyz.vercel.dev`          | `preview-xyz.vercel.dev`        | `host: acme---preview-xyz.vercel.dev`          |
| `globex---my-app-git-feature.vercel.dev` | `my-app-git-feature.vercel.dev` | `host: globex---my-app-git-feature.vercel.dev` |
| `tenant-123---my-app-abc123.vercel.dev`  | `my-app-abc123.vercel.dev`      | `host: tenant-123---my-app-abc123.vercel.dev`  |

## How it works

1. User visits `{tenant}---{preview-url}`
2. Vercel routes the request to the deployment at `{preview-url}`
3. Your code receives the full hostname: `{tenant}---{preview-url}`
4. Your code extracts the prefix and handles routing

The prefix can be anything—a tenant ID, workspace name, feature flag, or anything else your application needs.

## Reference implementation

Below if a reference implementation of extracting a tenant prefix from the hostname and routing to the `/[domain]/page.tsx` path.

```ts title="middleware.ts"
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSubdomain } from "tldts";

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || request.nextUrl.hostname;
  const subdomain = getSubdomain(hostname) || "";
  const [tenantPart] = subdomain.includes("---") ? subdomain.split("---") : [];

  if (!tenantPart) {
    return NextResponse.next();
  }
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  // Rewrite to tenant-prefixed path
  url.pathname = `/${tenantPart}${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

<Callout type="info">
  Checkout multi-tenant preview URLs in action with this
  [demo](https://multi-tenant-preview-urls-k6oodlv4w.vercel.rocks/all).
</Callout>

## Limitations

- Preview URL prefixes only work with custom deployment URL suffixes, not the default `.vercel.app`
- The prefix must appear before `---` in the preview URL path
- Total hostname length must not exceed DNS limits (253 characters)

# Reference

## Custom blocks

Start with our Custom [Blocks](/platforms/docs/platform-elements/blocks/custom-domain) and [Actions](/platforms/docs/platform-elements/actions/add-custom-domain) that speed up your usage of the Vercel API.

## Domain API reference

### Add domain

Add a domain to your Vercel project programmatically using the [create or transfer domain API](https://vercel.com/docs/rest-api/reference/endpoints/domains/add-an-existing-domain-to-the-vercel-platform).

**SDK**:

```ts title="add-domain.ts"
import { Vercel } from "@vercel/sdk";

const vercel = new Vercel({
  bearerToken: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await vercel.domains.createOrTransferDomain({
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l",
    slug: "my-team-url-slug",
    requestBody: {
      name: "example.com",
      method: "add",
      token: "fdhfr820ad#@FAdlj$$",
    },
  });

  console.log(result);
}

run();
```

### Get domain status

Check domain configuration and verification status using the [check domain API](https://vercel.com/docs/rest-api/reference/endpoints/domains/get-information-for-a-single-domain).

**SDK**:

```ts title="get-domain-status.ts"
import { Vercel } from "@vercel/sdk";

const vercel = new Vercel({
  bearerToken: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await vercel.domains.getDomain({
    domain: "example.com",
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l",
    slug: "my-team-url-slug",
  });

  console.log(result);
}

run();
```

### Verify domain

Trigger domain ownership verification using the [domain configuration API](https://vercel.com/docs/rest-api/reference/endpoints/domains/get-a-domains-configuration).

**SDK**:

```ts title="verify-domain.ts"
import { Vercel } from "@vercel/sdk";

const vercel = new Vercel({
  bearerToken: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await vercel.domains.getDomainConfig({
    domain: "example.com",
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l",
    slug: "my-team-url-slug",
  });

  console.log(result);
}

run();
```

### Remove domain

Remove a domain from your project using the [remove domain API](https://vercel.com/docs/rest-api/reference/endpoints/domains/remove-a-domain-by-name).

**SDK**:

```ts title="remove-domain.ts"
import { Vercel } from "@vercel/sdk";

const vercel = new Vercel({
  bearerToken: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await vercel.domains.deleteDomain({
    domain: "example.com",
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l",
    slug: "my-team-url-slug",
  });

  console.log(result);
}

run();
```

### List domains

Get all domains for a project using the [list domains API](https://vercel.com/docs/rest-api/reference/endpoints/domains/list-all-the-domains).

**REST API**:

```ts title="list-domains.ts"
import { Vercel } from "@vercel/sdk";

const vercel = new Vercel({
  bearerToken: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await vercel.domains.getDomains({
    limit: 20,
    since: 1609499532000,
    until: 1612264332000,
    teamId: "team_1a2b3c4d5e6f7g8h9i0j1k2l",
    slug: "my-team-url-slug",
  });

  console.log(result);
}

run();
```

### Error codes

| Code                    | Description                       | Solution                                |
| ----------------------- | --------------------------------- | --------------------------------------- |
| `domain_already_in_use` | Domain is used by another project | Verify domain ownership with TXT record |
| `invalid_domain`        | Domain format is invalid          | Check domain spelling and format        |
| `forbidden`             | Insufficient permissions          | Check API token permissions             |
| `rate_limit_exceeded`   | Too many requests                 | Wait and retry with exponential backoff |

## Troubleshooting

### DNS Propagation Delays

**Problem**: Domain not resolving after adding to project.

**Solution**:

- DNS changes take 24-48 hours to propagate globally
- Use [WhatsMyDNS](https://www.whatsmydns.net/) to check propagation
- Verify nameservers are set correctly
- Clear your local DNS cache: `sudo dscacheutil -flushcache` (macOS)

### Domain Verification Failures

**Problem**: Domain verification failing with TXT record added.

**Solution**:

- Wait 5-10 minutes after adding TXT record
- Verify TXT record is set correctly: `dig TXT _vercel.tenant1.com`
- Ensure no trailing dots in TXT value
- Check for duplicate TXT records
- Try verification again via SDK

### Wildcard Domain Not Working

**Problem**: Subdomains not routing to your application.

**Solution**:

- Verify nameservers point to `ns1.vercel-dns.com` and `ns2.vercel-dns.com`
- Confirm wildcard domain (`.yourapp.com`) is added to project
- Wait for DNS propagation (up to 48 hours)
- Check wildcard certificate status in project settings
- Ensure apex domain is also added to project

### SSL Certificate Not Issued

**Problem**: Domain shows "Certificate Error" in browser.

**Solution**:

- Complete domain verification first
- Wait 5-10 minutes for certificate issuance
- Check domain status in Vercel dashboard
- Ensure no CAA records blocking Let's Encrypt
- Verify domain is not on SSL blacklist

### Preview URL Not Resolving

**Problem**: Preview deployment URLs not working with custom domains.

**Solution**:

- Preview URLs with custom domains require Enterprise plan
- Use subdomain-based preview URLs: `branch-name---project.vercel.app`
- Contact sales to upgrade for multi-tenant preview URLs
- Keep branch names under 63 characters (DNS label limit)

### SEO Duplicate Content

**Problem**: Same content served on multiple domains.

**Solution**:

- Set canonical URLs pointing to primary domain
- Redirect subdomain to custom domain (or vice versa)
- Use consistent domain in sitemaps
- Configure 301 redirects in middleware

```tsx title="app/layout.tsx"
// app/layout.tsx
export async function generateMetadata() {
  return {
    alternates: {
      canonical: "https://primary-domain.com",
    },
  };
}
```

## FAQ

### What's the difference between Multi-Tenant and Multi-Project?

**Multi-Tenant**: Single codebase serving multiple tenants with their own domains. All tenants share the same deployment.

**Multi-Project**: Multiple projects, each with unique code and isolated deployments. Each tenant has their own Vercel project.

Use Multi-Tenant when all tenants need the same functionality but different content. Use Multi-Project when tenants need custom code.

### How many domains can I add per project?

- **Hobby**: 50 domains
- **Pro**: Unlimited (soft limit: 100,000)
- **Enterprise**: Unlimited (soft limit: 1,000,000)

Soft limits can be increased by [contacting support](/help).

### How do I get unlimited domains?

Upgrade to the Pro plan for unlimited custom domains. [View pricing](/pricing).

### What are multi-tenant preview URLs?

Multi-tenant preview URLs let you test changes for specific tenants before deploying to production. They follow the format: `tenant1---project-git-branch.vercel.app`.

This feature is **Enterprise only**. Contact your sales representative to enable it.

### How is pricing calculated?

Multi-tenant applications are priced based on:

- **Team plan**: Hobby, Pro, or Enterprise
- **Usage**: Bandwidth, function invocations, build minutes
- **Domains**: No additional cost for domains (within plan limits)

See [pricing documentation](/pricing) for details.

### What security features are available?

All Vercel applications include:

- **Firewall**: DDoS protection and rate limiting
- **WAF**: Web Application Firewall
- **SSL certificates**: Automatic HTTPS for all domains
- **Edge network**: Global CDN with low latency

### How can I monitor domain operations?

- **Vercel Dashboard**: View domain status and SSL certificates
- **API**: Query domain status programmatically
- **Webhooks**: Get notified of domain events (Enterprise)
- **Logs**: View domain resolution and errors

### How do I handle DNS propagation delays?

DNS changes take 24-48 hours to propagate. Use [WhatsMyDNS](https://www.whatsmydns.net/) to monitor propagation across global nameservers.

### Why isn't my SSL certificate being issued?

SSL certificates require domain verification. Add the TXT record provided by Vercel, wait 5-10 minutes, then trigger verification via the SDK or dashboard.

### How do I handle SEO with multiple domains?

Set canonical URLs to indicate the primary domain for each page. This prevents duplicate content issues.
