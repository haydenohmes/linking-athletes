'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Checkbox({
  className,
  checked,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const isIndeterminate = checked === "indeterminate"
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={isIndeterminate ? undefined : checked}
      data-state={isIndeterminate ? "indeterminate" : checked ? "checked" : "unchecked"}
      className={cn(
        'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {isIndeterminate ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="h-0.5 w-3 bg-white" />
        </div>
      ) : (
        <CheckboxPrimitive.Indicator
          data-slot="checkbox-indicator"
          className="flex items-center justify-center text-current transition-none"
        >
          <CheckIcon className="size-3.5" />
        </CheckboxPrimitive.Indicator>
      )}
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
