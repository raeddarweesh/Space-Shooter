import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-display font-medium tracking-wide transition-opacity duration-150 ease-[var(--ease-smooth-out)] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-fg text-bg hover:opacity-90",
        ghost: "bg-transparent text-fg hover:bg-surface-2",
        outline: "border border-border-strong bg-surface text-fg hover:bg-surface-2",
        danger: "bg-danger text-fg hover:opacity-90",
      },
      size: {
        default: "h-11 min-w-11 rounded-md px-5 text-sm",
        lg: "h-12 min-w-12 rounded-lg px-6 text-base",
        icon: "size-11 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
});
