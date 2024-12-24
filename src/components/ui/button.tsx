import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-[0_8px_16px_rgb(0_0_0/0.2)] backdrop-blur-sm relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-t before:from-transparent before:to-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-corporate-blue to-corporate-teal text-white border border-white/10 after:absolute after:inset-0 after:bg-black/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity",
        destructive: "bg-gradient-to-r from-red-600 to-red-500 text-white border border-white/10 after:absolute after:inset-0 after:bg-black/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity",
        outline: "border border-white/10 bg-gradient-to-r from-gray-800/50 to-gray-700/50 text-white hover:from-corporate-blue hover:to-corporate-teal after:absolute after:inset-0 after:bg-black/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity",
        secondary: "bg-gradient-to-r from-corporate-teal to-corporate-green text-white border border-white/10 after:absolute after:inset-0 after:bg-black/20 after:opacity-0 hover:after:opacity-100 after:transition-opacity",
        ghost: "hover:bg-gradient-to-r hover:from-corporate-blue/20 hover:to-corporate-teal/20 text-white after:absolute after:inset-0 after:bg-black/10 after:opacity-0 hover:after:opacity-100 after:transition-opacity",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
