# Platform App Guidelines

## Optimization and Best Practices

- Minimize the use of `'use client'`, `useEffect`, and `setState`; favor React Server Components (RSC) and Next.js SSR features.
- **NOTE**: favoring RSC only applies to apps with NEXTJS, and even when you're using nextjs, this doesn't apply to places where you use convex. Convex is fully reactive and uses web sockets and consequently we need to use client components often. Even then minimize the use of `useEffect`.
- Implement dynamic imports for code splitting and optimization when possible based on the given framework.

## State Management and Data Fetching

- Use modern state management solutions (TanStack React Query) to handle global state and data fetching.
- We use convex for data fetching and state management in the /platform app.
- Keep it simple, don't use a whole library for something that happens once.
- Provide clear and concise comments for complex logic. However unless something cannot be inferred from just reading the logic do not add comments.
