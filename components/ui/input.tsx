import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      style={{
        border: '1px solid var(--u-color-line-subtle)',
        borderRadius: 'var(--u-border-radius-small)',
        padding: 'var(--u-space-half) var(--u-space-three-quarter)',
        fontSize: 'var(--u-font-size-default)',
        color: 'var(--u-color-base-foreground-contrast)',
        backgroundColor: 'var(--u-color-background-container)',
        fontFamily: 'var(--u-font-body)',
        height: '40px',
        minHeight: '40px',
      }}
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
        'w-full min-w-0 outline-none',
        'transition-[border-color,box-shadow]',
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-[var(--u-color-emphasis-background-contrast)] focus-visible:shadow-[0_0_0_2px_rgba(2,115,227,0.1)]',
        'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
