"use client"

import React from "react"
import { Button } from "@/components/ui/button"
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

type AddOrConnectAthleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedOption?: "connect" | "add"
  onOptionChange?: (option: "connect" | "add") => void
  onContinue?: () => void
}

export function AddOrConnectAthleteDialog({
  open,
  onOpenChange,
  selectedOption = "connect",
  onOptionChange,
  onContinue,
}: AddOrConnectAthleteDialogProps) {
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
                <p className="leading-[1.2]">Add or Connect Athlete</p>
              </div>
              <div className="flex flex-col justify-center relative shrink-0 text-[#c0c6cd] text-[14px] w-full">
                <p className="leading-[1.4]">Link to an existing athlete account or add a new athlete to get started.</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
              <div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
                <button
                  onClick={() => onOptionChange?.("connect")}
                  className={`flex gap-0 items-center min-h-[64px] px-8 py-6 relative rounded-[4px] shrink-0 w-full text-center ${
                    selectedOption === "connect"
                      ? "bg-[#0d2959] border border-[#0273e3] border-solid"
                      : "bg-[#0f1215] border border-[#0f1215] border-solid"
                  }`}
                >
                  <div className="basis-0 flex flex-col grow h-full justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-nowrap tracking-[0px] font-medium">
                    <p className={`leading-[1.4] overflow-ellipsis overflow-hidden text-[16px] ${
                      selectedOption === "connect" ? "text-[#fefefe]" : "text-[#c0c6cd]"
                    }`}>
                      Connect to Existing Athlete
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => onOptionChange?.("add")}
                  className={`flex gap-0 items-center min-h-[64px] px-8 py-6 relative rounded-[4px] shrink-0 w-full text-center ${
                    selectedOption === "add"
                      ? "bg-[#0d2959] border border-[#0273e3] border-solid"
                      : "bg-[#0f1215] border border-[#0f1215] border-solid"
                  }`}
                >
                  <div className="basis-0 flex flex-col grow h-full justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-nowrap tracking-[0px] font-medium">
                    <p className={`leading-[1.4] overflow-ellipsis overflow-hidden text-[16px] ${
                      selectedOption === "add" ? "text-[#fefefe]" : "text-[#c0c6cd]"
                    }`}>
                      Add New Athlete
                    </p>
                  </div>
                </button>
              </div>
              <div className="flex flex-col gap-0 items-start relative shrink-0 w-full">
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full"
                  onClick={onContinue}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}


