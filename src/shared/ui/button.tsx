import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex cursor-pointer shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",

        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        ghost: "hover:bg-muted hover:text-foreground",

        destructive: "bg-destructive text-white hover:bg-destructive/90",

        link: "underline-offset-4 text-white/80 hover:text-white cursor-pointer hover:bg-transparent",

        // 🔥 NEW — your brand CTA button
        gradient:
          "relative overflow-hidden rounded-[10px] border-0 bg-gradient-to-br from-primary to-[#0052CC] text-white font-bold transition-all duration-200 hover:-translate-y-[1px] before:absolute before:top-0 before:left-[-100%] before:h-full before:w-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:animate-[shine_2.5s_ease-in-out_infinite] animate-[pulseGlow_2.5s_ease-in-out_infinite]",
        // subtle nav button (icons etc)
        nav: "text-white/80 hover:text-white hover:bg-white/10",
      },

      size: {
        default: "h-11 px-6",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-6",

        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button"; // ✅ FIXED

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
