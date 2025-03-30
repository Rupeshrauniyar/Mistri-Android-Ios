import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, leftIcon, rightIcon, error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          {leftIcon}
        </div>
      )}
      
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm",
          "border-gray-300 dark:border-gray-700",
          "placeholder:text-gray-400 dark:placeholder:text-gray-600",
          "focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 focus:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          leftIcon && "pl-10",
          rightIcon && "pr-10",
          error && "border-error focus:ring-error-100 dark:focus:ring-error-900 focus:border-error",
          className
        )}
        ref={ref}
        {...props} 
      />
      
      {rightIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
          {rightIcon}
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
})

Input.displayName = "Input"

export { Input }
