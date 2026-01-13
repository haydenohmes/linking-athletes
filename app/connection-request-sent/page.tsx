"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"


export default function ConnectionRequestSentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  const handleContinue = () => {
    // Navigate to enter verification code page
    router.push(`/enter-verification-code?email=${encodeURIComponent(email || "")}`)
  }

  return (
    <div className="bg-[#0f1215] flex flex-col isolate items-center overflow-clip relative rounded-[12px] size-full min-h-screen">
      <div className="basis-0 flex flex-col grow items-center justify-center min-h-px min-w-px relative shrink-0 w-full z-[1]">
        <div className="basis-0 flex flex-col gap-0 grow items-center max-w-[560px] min-h-px min-w-px px-6 py-16 relative shrink-0 w-full">
          <div className="bg-[#191f24] flex flex-col gap-6 items-center max-w-[400px] relative rounded-[12px] shrink-0 w-[400px]">
            {/* Content Section */}
            <div className="flex flex-col gap-8 items-center pb-[60px] pt-0 px-10 relative shrink-0 w-full">
              {/* Header Text */}
              <div className="flex flex-col gap-1 items-center leading-[0] relative shrink-0 text-center tracking-[0px] w-full font-medium">
                <div className="flex flex-col justify-center relative shrink-0 text-[#fefefe] text-[24px] w-full">
                  <p className="leading-[1.2]">Connection Request Sent</p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 text-[#c0c6cd] text-[14px] w-full">
                  <p className="leading-[1.4]">If an athlete uses this email, they'll receive a confirmation request. Once they confirm, you can continue registration.</p>
                </div>
              </div>

              {/* Continue Button */}
              <div className="flex flex-col gap-0 items-start relative shrink-0 w-full">
                <div className="flex flex-col gap-0 items-start relative shrink-0 w-full">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="w-full"
                    onClick={handleContinue}
                  >
                    Enter Verification Code
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

