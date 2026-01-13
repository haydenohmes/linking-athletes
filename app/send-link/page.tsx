"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


export default function SendLinkPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = React.useState("")

  // Pre-fill email from query params if provided
  React.useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  const handleSendLink = () => {
    if (email) {
      const stored = localStorage.getItem("connectionAttempts")
      const attempts: Array<{id: string, email: string, name: string, status: string, requestedDate: string}> = stored ? JSON.parse(stored) : []
      
      // Check if this email already exists in attempts
      const existingIndex = attempts.findIndex(attempt => attempt.email.toLowerCase() === email.toLowerCase())
      
      if (existingIndex >= 0) {
        // Update existing attempt
        attempts[existingIndex] = {
          ...attempts[existingIndex],
          status: "pending",
          requestedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        }
      } else {
        // Create new attempt
        const attempt = {
          id: Date.now().toString(),
          email: email,
          name: email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, l => l.toUpperCase()),
          status: "pending" as const,
          requestedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        }
        attempts.push(attempt)
      }
      
      localStorage.setItem("connectionAttempts", JSON.stringify(attempts))
      
      // Navigate to connection request sent page
      router.push(`/connection-request-sent?email=${encodeURIComponent(email)}`)
    }
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
                  <p className="leading-[1.2]">Send Link to Connect an Athlete</p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 text-[#c0c6cd] text-[14px] w-full">
                  <p className="leading-[1.4]">We'll check for an existing account and send the athlete a link to confirm connection.</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
                  <Input
                    type="email"
                    placeholder="Athlete Email*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#161b20] border border-[#42474c] border-solid min-h-[48px] rounded-[2px] text-[18px] text-[#c0c6cd] placeholder:text-[#85909e]"
                  />
                </div>
                <div className="flex flex-col gap-0 items-start relative shrink-0 w-full">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="w-full"
                    onClick={handleSendLink}
                    disabled={!email}
                  >
                    Send Link
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

