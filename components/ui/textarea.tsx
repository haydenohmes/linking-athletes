import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      style={{
        border: '1px solid var(--u-color-line-subtle)',
        borderRadius: 'var(--u-border-radius-small)',
        padding: 'var(--u-space-half) var(--u-space-three-quarter)',
        fontSize: 'var(--u-font-size-default)',
        color: 'var(--u-color-base-foreground-contrast)',
        backgroundColor: 'var(--u-color-background-container)',
        fontFamily: 'var(--u-font-body)',
      }}
      className={cn(
        'placeholder:text-muted-foreground w-full min-h-16 outline-none resize-none',
        'transition-[border-color,box-shadow]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:border-[var(--u-color-emphasis-background-contrast)] focus-visible:shadow-[0_0_0_2px_rgba(2,115,227,0.1)]',
        'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
