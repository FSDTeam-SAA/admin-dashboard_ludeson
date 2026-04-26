"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 ring-offset-white disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "gradient-primary text-white shadow-[0_14px_32px_rgba(47,108,246,0.25)] hover:brightness-105",
        secondary: "bg-[var(--soft)] text-[var(--foreground)] hover:bg-[#dfe9ff]",
        outline:
          "border border-[var(--primary)] bg-white text-[var(--primary)] hover:bg-[var(--soft)]",
        ghost: "bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--soft)]",
        success: "bg-[var(--success)] text-white hover:bg-[#17a24f]",
        danger: "border border-[var(--danger)] bg-white text-[var(--danger)] hover:bg-[#fff3f3]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <LoaderCircle className="size-4 animate-spin" /> : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
