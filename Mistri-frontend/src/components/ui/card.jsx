import React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

/**
 * Card component for displaying content in a card format
 */
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:shadow-md dark:border-border-dark dark:bg-card-dark dark:text-card-foreground-dark",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

/**
 * Card header component for the top section of the card
 */
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * Card title component for the card header
 */
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * Card description component for the card header
 */
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground dark:text-muted-foreground-dark", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * Card content component for the main content of the card
 */
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

/**
 * Card footer component for the bottom section of the card
 */
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

/**
 * Card image component for displaying images in the card
 */
const CardImage = React.forwardRef(({ className, ...props }, ref) => (
  <div className={cn("relative w-full overflow-hidden", className)}>
    <img
      ref={ref}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      {...props}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
  </div>
));
CardImage.displayName = "CardImage";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardImage }; 