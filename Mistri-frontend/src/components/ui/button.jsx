import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: { 
        default:
          "bg-primary text-white shadow hover:bg-primary-600 active:bg-primary-700",
        secondary:
          "bg-secondary text-white shadow hover:bg-secondary-600 active:bg-secondary-700",
        accent:
          "bg-accent text-white shadow hover:bg-accent-600 active:bg-accent-700",
        outline:
          "border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow hover:bg-gray-50 dark:hover:bg-gray-700",
        ghost: 
          "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
        link: 
          "text-primary underline-offset-4 hover:underline",
        destructive:
          "bg-error text-white shadow hover:bg-red-600 active:bg-red-700",
        success:
          "bg-success text-white shadow hover:bg-emerald-600 active:bg-emerald-700",
        gradientPrimary:
          "gradient-primary text-white shadow hover:opacity-90 active:opacity-95",
        gradientSecondary:
          "gradient-secondary text-white shadow hover:opacity-90 active:opacity-95",
        gradientAccent:
          "gradient-accent text-white shadow hover:opacity-90 active:opacity-95",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
        "icon-xl": "h-14 w-14",
      },
      rounded: {
        default: "rounded-lg",
        full: "rounded-full",
        none: "rounded-none",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, rounded, className }))}
      ref={ref}
      {...props} 
    />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
