import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--u-color-emphasis-background-contrast)] focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-[var(--u-color-emphasis-background-contrast)] text-[var(--u-color-emphasis-foreground-reversed)] hover:bg-[var(--u-color-emphasis-background-contrast)]/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20',
        outline:
          'border border-border bg-background hover:bg-muted hover:text-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-muted hover:text-foreground',
        link: 'text-[var(--u-color-emphasis-background-contrast)] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-[40px] min-h-[40px] px-4 text-base font-bold rounded-[2px]',
        sm: 'h-8 rounded-[2px] gap-1.5 px-3 text-sm font-bold has-[>svg]:px-2.5',
        lg: 'h-10 rounded-[2px] px-6 text-base font-bold has-[>svg]:px-4',
        icon: 'size-9 rounded-[2px]',
        'icon-sm': 'size-8 rounded-[2px]',
        'icon-lg': 'size-10 rounded-[2px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
