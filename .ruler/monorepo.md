# Monorepo Structure & Strategy

Always use Context7 MCP when I need library/API documentation, code generation, setup or configuration steps without me having to explicitly ask.

## Apps
1. `/apps/platform`: This is our platform for our clients, it also holds our internal tools and uses convex for the backend.
2. `/apps/website`: This is our legacy website for `www.amaxaimpact.org`, it uses nextjs and is just a read-only site with a blog. Since nextjs is overkill for static sites, we are in the process of migrating it to Astro.
3. `/apps/landing`: This is our new landing site for `www.amaxaimpact.org`, it uses Astro and is a read-only site with a blog. This is going to be a new optimized codebase that will remove tech debt and improve performance. It's in the process of being migrated from /apps/website.

## Packages
1. `/packages/backend`: This is our convex backend for the platform. Refer to the convex section of this document for more information on how to use convex/what the best practices are for it.
2. `/packages/resend`: This is our resend package to send emails. We have this here because we send emails in the platform and in the website(s).
3. `/packages/ui`: This is our ui package for the platform. It is the base of the ui that's made with Base UI and Shadcn. We use shadcn everywhere because it's the basis of our design system.
4. `/packages/validators`: This is our validators package for the platform. It is the base of the validators that's made with arktype. We use arktype everywhere because it's the basis of our validation system. Try and centralize things here when possible.

## Tooling
1. `/tooling/eslint`: This is our eslint package for the platform. It is the base of the eslint that's made with eslint. We use eslint everywhere because it's the basis of our linting system.
2. `/tooling/prettier`: This is our prettier package for the platform. It is the base of the prettier that's made with prettier. We use prettier everywhere because it's the basis of our formatting system.
3. `/tooling/typescript`: The basis for our typescript configs.
4. `/tooling/tailwind`: The tailwind config base for all of our apps.
5. `/tooling/github`: The github CI config and shit for our app.

# Code Style and Structure
- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Favor iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., `isLoading`, `hasError`).
- Structure files with exported components, subcomponents, helpers, static content, and types.
- Use lowercase with dashes for directory and file names (e.g., `components/auth-wizard`).
- Avoid using `any` whenever possible, use context7 to look up docs for types if needed.

# Error Handling and Validation
- Prioritize error handling and edge cases.
- Use early returns for error conditions.
- Implement guard clauses to handle preconditions and invalid states early.
- Use custom error types for consistent error handling.

# Methodology
1. **System 2 Thinking**: Approach the problem with analytical rigor. Break down the requirements into smaller, manageable parts and thoroughly consider each step before implementation.
2. **Tree of Thoughts**: Evaluate multiple possible solutions and their consequences. Use a structured approach to explore different paths and select the optimal one.
3. **Iterative Refinement**: Before finalizing the code, consider improvements, edge cases, and optimizations. Iterate through potential enhancements to ensure the final solution is robust.

**Process**:
1. **Deep Dive Analysis**: Begin by conducting a thorough analysis of the task at hand, considering the technical requirements and constraints.
2. **Planning**: Develop a clear plan that outlines the architectural structure and flow of the solution.
3. **Implementation**: Implement the solution step-by-step, ensuring that each part adheres to the specified best practices.
4. **Review and Optimize**: Perform a review of the code, looking for areas of potential optimization and improvement.
5. **Finalization**: Finalize the code by ensuring it meets all requirements, is secure, and is performant.
