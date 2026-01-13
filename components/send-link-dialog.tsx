"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

// Image assets from Figma
const img = "http://localhost:3845/assets/6c2ed2e86744ab5f1ae79b2018b7e78d05c426fa.svg"
const img1 = "http://localhost:3845/assets/dd74780ac684fa7efbe145b86e5922525bdaef6b.svg"

type SendLinkDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  email?: string
  onEmailChange?: (email: string) => void
  onSend?: () => void
}

export function SendLinkDialog({
  open,
  onOpenChange,
  email = "",
  onEmailChange,
  onSend,
}: SendLinkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f1215] max-w-[400px] p-0 gap-0">
        <div className="flex flex-col gap-6 items-center max-w-[400px] relative rounded-[12px] shrink-0 w-[400px] bg-[#191f24]">
          <div className="flex flex-col items-center justify-center pb-6 pt-10 px-10 relative shrink-0 w-full">
            <div className="flex flex-col items-start relative shrink-0">
              <div className="h-[40px] overflow-clip relative shrink-0 w-[122px]">
                <div className="absolute inset-[0.36%_67.43%_0_0.03%]">
                  <img alt="" className="block max-w-none size-full" src={img} />
                </div>
                <div className="absolute inset-[9.12%_0.11%_11.93%_37.16%]">
                  <img alt="" className="block max-w-none size-full" src={img1} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8 items-center pb-[60px] pt-0 px-10 relative shrink-0 w-full">
            <div className="flex flex-col gap-1 items-center leading-[0] relative shrink-0 text-center tracking-[0px] w-full font-medium">
              <div className="flex flex-col justify-center relative shrink-0 text-[#fefefe] text-[24px] w-full">
                <p className="leading-[1.2]">Send Link to Connect an Athlete</p>
              </div>
              <div className="flex flex-col justify-center relative shrink-0 text-[#c0c6cd] text-[14px] w-full">
                <p className="leading-[1.4]">We'll check for an existing account and send the athlete a link to confirm connection.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
              <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
                <Input
                  type="email"
                  placeholder="Athlete Email*"
                  value={email}
                  onChange={(e) => onEmailChange?.(e.target.value)}
                  className="bg-[#161b20] border border-[#42474c] border-solid min-h-[48px] rounded-[2px] text-[18px] text-[#c0c6cd] placeholder:text-[#85909e]"
                />
              </div>
              <div className="flex flex-col gap-0 items-start relative shrink-0 w-full">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full"
                  onClick={onSend}
                >
                  Send Link
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


