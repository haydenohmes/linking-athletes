'use client'

import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/lib/utils'

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer data-[state=checked]:bg-[#0273e3] data-[state=unchecked]:bg-[#c4c6c8] focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-5 w-9 shrink-0 items-center rounded-full border-0 transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={
          'bg-white pointer-events-none block h-4 w-4 rounded-full shadow-sm transition-transform data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-[2px]'
        }
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
