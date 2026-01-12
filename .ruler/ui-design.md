# UI and Styling Guidelines

## Objective
Create solutions that are not only functional but also adhere to the best practices in performance, security, and maintainability.

## Frameworks and Composition
- Use modern UI frameworks (e.g., Tailwind CSS, Shadcn UI, Base UI) for styling.
- Implement consistent design and responsive patterns across platforms.
- We are not using Radix UI but Base UI because radix ui is being deprecated.
- Use responsive design with a mobile-first approach.
- Optimize images: include size data, implement lazy loading.

## Migrating from Radix UI
Radix UI uses an asChild prop, while Base UI uses a render prop. Learn more about how composition works in Base UI in the composition guide.
In Radix UI, the Slot component lets you implement an asChild prop.

**Radix UI Slot component (Deprecated Style):**
```typescript
import { Slot } from 'radix-ui';
function Button({ asChild, ...props }) {
  const Comp = asChild ? Slot.Root : 'button';
  return <Comp {...props} />;
}
// Usage
<Button asChild>
  <a href="/contact">Contact</a>
</Button>
```

**Base UI render prop (New Standard):**
In Base UI, `useRender` lets you implement a render prop. The example below is the equivalent implementation to the Radix example above.
```typescript
import { useRender } from '@base-ui/react/use-render';
function Button({ render, ...props }) {
  return useRender({
    defaultTagName: 'button',
    render,
    props,
  });
}
// Usage
<Button render={<a href="/contact" />}>Contact</Button>
```
