import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@amaxa/ui";

const buttonVariants = cva(
  "focus-visible:ring-ring inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline:
          "border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  render?: React.ReactElement<{ children?: React.ReactNode }>;
  disabled?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      icon,
      children,
      variant,
      loading,
      disabled,
      size,
      render,
      ...props
    },
    ref,
  ) => {
    const ariaDisabled = Boolean(loading || disabled);

    if (render) {
      return (
        <ButtonPrimitive
          className={cn(buttonVariants({ variant, size }), className)}
          ref={ref}
          render={React.cloneElement(render, {
            children: (
              <>
                {loading && (
                  <Loader2 className={cn("h-4 w-4 animate-spin", "mr-2")} />
                )}
                {!loading && icon}
                {render.props.children}
              </>
            ),
          })}
          disabled={ariaDisabled}
          aria-disabled={ariaDisabled}
          {...props}
        />
      );
    }

    return (
      <ButtonPrimitive
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={ariaDisabled}
        ref={ref}
        {...props}
      >
        <>
          {loading && (
            <Loader2 className={cn("h-4 w-4 animate-spin", "mr-2")} />
          )}
          {!loading && icon}
          {children}
        </>
      </ButtonPrimitive>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
