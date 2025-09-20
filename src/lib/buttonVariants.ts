import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-primary-dark disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-soft hover:shadow-lg hover:scale-105 dark:bg-primary-dark dark:text-primary-foreground-dark dark:shadow-soft-dark",
        destructive:
          "bg-red-500 text-white shadow-soft hover:bg-red-600 hover:scale-105",
        outline:
          "glass-button text-text dark:text-text-dark hover:scale-105",
        secondary:
          "bg-secondary text-secondary-foreground shadow-soft hover:bg-secondary/80 hover:scale-105 dark:bg-secondary-dark dark:text-secondary-foreground-dark",
        ghost: "hover:bg-white/10 dark:hover:bg-background-dark/10 text-text dark:text-text-dark hover:scale-105",
        link: "text-primary dark:text-primary-dark underline-offset-4 hover:underline",
        glass: "glass-card text-text dark:text-text-dark hover:scale-105",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-2xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)