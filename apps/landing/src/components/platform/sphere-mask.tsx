import { cn } from "@amaxa/ui";

export const SphereMask = ({ reverse = false }: { reverse?: boolean }) => {
  return (
    <div
      className={cn(
        "[--color:var(--primary)]",
        "pointer-events-none relative -z-[2] mx-auto h-[50rem] overflow-hidden",

        "[mask-image:radial-gradient(ellipse_at_center_center,#000,transparent_50%)]",

        reverse ? "mt-[-18.8rem] rotate-180" : "my-[-18.8rem] md:mt-[-30rem]",

        "before:absolute before:inset-0 before:h-full before:w-full before:[background-image:radial-gradient(circle_at_bottom_center,var(--color),transparent_70%)] before:opacity-40",

        "after:bg-background after:absolute after:top-1/2 after:-left-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[50%] after:border-t after:border-[hsl(var(--border))]",
      )}
    ></div>
  );
};
