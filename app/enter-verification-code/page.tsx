"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CheckCircle2, X, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"


export default function EnterVerificationCodePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "john.doe@example.com"
  const variant = searchParams.get("variant") || "a"
  const [code, setCode] = React.useState<string[]>(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [isConnected, setIsConnected] = React.useState(false)
  const [connectedAthlete, setConnectedAthlete] = React.useState<{name: string, email: string} | null>(null)
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  const handleCodeChange = (index: number, value: string) => {
    // Only allow single character
    if (value.length > 1) return
    
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 6)
    const newCode = [...code]
    pastedData.split("").forEach((char, i) => {
      if (i < 6) {
        newCode[i] = char
      }
    })
    setCode(newCode)
    // Focus the last filled input or the first empty one
    const lastIndex = Math.min(pastedData.length - 1, 5)
    inputRefs.current[lastIndex]?.focus()
  }

  const handleVerify = async () => {
    const fullCode = code.join("")
    if (fullCode.length === 6 && !isVerifying && !isConnected) {
      setIsVerifying(true)
      
      // Simulate verification API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Update connection attempt status in localStorage and get athlete info
      const stored = localStorage.getItem("connectionAttempts")
      if (stored) {
        try {
          const attempts = JSON.parse(stored)
          const updatedAttempts = attempts.map((attempt: any) => {
            if (attempt.email.toLowerCase() === email.toLowerCase()) {
              return { ...attempt, status: "connected" }
            }
            return attempt
          })
          localStorage.setItem("connectionAttempts", JSON.stringify(updatedAttempts))
          
          // Get athlete information from the updated attempts
          const athleteAttempt = updatedAttempts.find((attempt: any) => 
            attempt.email.toLowerCase() === email.toLowerCase()
          )
          if (athleteAttempt) {
            setConnectedAthlete({
              name: athleteAttempt.name,
              email: athleteAttempt.email
            })
          }
        } catch (e) {
          console.error("Failed to update connection attempts", e)
        }
      }
      
      setIsVerifying(false)
      setIsConnected(true)
      
      // Show success toast matching Figma design on the right side
      toast.custom((t) => (
        <div className="bg-[#21262b] flex gap-4 h-[47px] items-start overflow-clip rounded-[4px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.3),0px_0px_8px_0px_rgba(0,0,0,0.2)] w-[348px]">
          <div className="bg-[#548309] flex h-full items-center p-2 rounded-bl-[4px] rounded-tl-[4px] shrink-0">
            <CheckCircle2 className="size-4 text-white" />
          </div>
          <div className="basis-0 flex flex-col gap-2 grow items-start min-h-px min-w-px px-0 py-4 relative shrink-0">
            <p className="font-normal leading-[15px] min-w-full not-italic relative shrink-0 text-[14px] text-[#c0c6cd]">
              Athlete has been connected.
            </p>
          </div>
          <div className="flex gap-0 h-full items-start pl-0 pr-2 py-2 relative shrink-0">
            <button
              onClick={() => toast.dismiss(t)}
              className="flex items-center justify-center size-6 rounded hover:bg-[#0f1215] transition-colors"
              aria-label="Close"
            >
              <X className="size-3 text-[#85909e] hover:text-[#c0c6cd]" />
            </button>
          </div>
        </div>
      ), {
        duration: 5000,
        position: "bottom-right",
      })
    } else if (isConnected) {
      // Navigate to program page when Finish is clicked
      router.push("/program")
    }
  }

  const handleResend = () => {
    // Resend code logic
    setCode(["", "", "", "", "", ""])
    inputRefs.current[0]?.focus()
  }

  const isCodeComplete = code.every(digit => digit !== "")

  return (
    <div className="bg-[#0f1215] flex flex-col isolate items-center overflow-clip relative rounded-[12px] size-full min-h-screen">
      <div className="basis-0 flex flex-col grow items-center justify-center min-h-px min-w-px relative shrink-0 w-full z-[1]">
        <div className="basis-0 flex flex-col gap-0 grow items-center max-w-[560px] min-h-px min-w-px px-6 py-16 relative shrink-0 w-full">
          <div className="bg-[#191f24] flex flex-col gap-6 items-center max-w-[400px] relative rounded-[12px] shrink-0 w-[400px]">
            {/* Content Section */}
            <div className="flex flex-col gap-8 items-center pb-[60px] pt-0 px-10 relative shrink-0 w-full">
              {/* Header Text */}
              {isConnected ? (
                <div className="flex flex-col gap-6 items-center leading-[0] relative shrink-0 text-center tracking-[0px] w-full font-medium">
                  <div className="flex flex-col gap-1 items-center leading-[0] relative shrink-0 text-center tracking-[0px] w-full font-medium">
                    <div className="flex flex-col justify-center relative shrink-0 text-[#fefefe] text-[24px] w-full">
                      <p className="leading-[1.2]">Athlete Connected</p>
                    </div>
                    <div className="flex flex-col justify-center relative shrink-0 text-[#c0c6cd] text-[16px] w-full">
                      <p className="leading-[1.4]">
                        You are now connected with
                      </p>
                    </div>
                  </div>
                  {connectedAthlete && connectedAthlete.name && (
                    variant === "b" ? (
                      <div className="bg-[#21262b] flex flex-col gap-3 items-start pl-4 pr-4 py-4 relative rounded-[8px] shrink-0 w-full">
                        <div className="flex gap-3 items-center relative shrink-0 w-full">
                          <Avatar className="size-[48px] shrink-0">
                            <AvatarFallback className="bg-[#38434f] text-white text-[16px] font-bold">
                              {connectedAthlete.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="basis-0 flex flex-col gap-1 grow items-start justify-start min-h-px min-w-px relative shrink-0">
                            <div className="flex flex-col justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#fefefe] text-[18px] tracking-[0px] w-full font-bold text-left">
                              <p className="leading-[1.2] overflow-ellipsis overflow-hidden text-[18px]">{connectedAthlete.name}</p>
                            </div>
                            <div className="flex font-medium gap-1 items-start leading-[0] relative shrink-0 text-[#c0c6cd] text-[14px] tracking-[0px] w-full text-left">
                              <div className="flex-col justify-center overflow-ellipsis overflow-hidden relative shrink-0">
                                <p className="leading-[1.4] text-[14px]">MD</p>
                              </div>
                              <div className="flex-col justify-center overflow-ellipsis overflow-hidden relative shrink-0 text-center">
                                <p className="leading-[1.4] text-[14px]">·</p>
                              </div>
                              <div className="flex-col justify-center overflow-ellipsis overflow-hidden relative shrink-0">
                                <p className="leading-[1.4] text-[14px]">Wichita FC</p>
                              </div>
                            </div>
                          </div>
                          <CheckCircle2 className="size-6 text-[#548309] shrink-0" />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#21262b] flex gap-2 items-center pl-2 pr-4 py-2 relative rounded-[17px] shrink-0 w-full">
                        <Avatar className="size-[40px] shrink-0">
                          <AvatarFallback className="bg-[#38434f] text-white text-[14px] font-bold">
                            {connectedAthlete.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="basis-0 flex flex-col gap-1 grow items-start justify-start min-h-px min-w-px relative shrink-0">
                          <div className="flex flex-col justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#fefefe] text-[16px] tracking-[0px] w-full font-bold text-left">
                            <p className="leading-[1.2] overflow-ellipsis overflow-hidden text-[16px]">{connectedAthlete.name}</p>
                          </div>
                          <div className="flex font-medium gap-1 items-start leading-[0] relative shrink-0 text-[#c0c6cd] text-[14px] tracking-[0px] w-full text-left">
                            <div className="flex-col justify-center overflow-ellipsis overflow-hidden relative shrink-0">
                              <p className="leading-[1.4] text-[14px]">MD</p>
                            </div>
                            <div className="flex-col justify-center overflow-ellipsis overflow-hidden relative shrink-0 text-center">
                              <p className="leading-[1.4] text-[14px]">·</p>
                            </div>
                            <div className="flex-col justify-center overflow-ellipsis overflow-hidden relative shrink-0">
                              <p className="leading-[1.4] text-[14px]">Wichita FC</p>
                            </div>
                          </div>
                        </div>
                        <CheckCircle2 className="size-5 text-[#548309] shrink-0" />
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-1 items-center leading-[0] relative shrink-0 text-center tracking-[0px] w-full font-medium">
                  <div className="flex flex-col justify-center relative shrink-0 text-[#fefefe] text-[24px] w-full">
                    <p className="leading-[1.2]">Enter Verification Code</p>
                  </div>
                  <div className="flex flex-col justify-center relative shrink-0 text-[#c0c6cd] text-[14px] w-full">
                    <p className="leading-[1.4]">
                      Enter the verification code sent to the athlete at{" "}
                      <span className="font-bold">{email}</span>.
                    </p>
                  </div>
                </div>
              )}

              {/* Verification Code Inputs */}
              {!isConnected && (
                <div className="flex gap-1 items-start relative shrink-0 w-full">
                  {code.map((digit, index) => (
                    <div
                      key={index}
                      className="basis-0 bg-black flex flex-col grow items-center justify-center min-h-px min-w-px px-3 py-4 relative rounded-[4px] shrink-0"
                    >
                      <input
                        ref={(el) => {
                          inputRefs.current[index] = el
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        className="bg-black border-0 text-center text-[32px] text-white font-medium p-0 h-auto focus:outline-none focus:ring-0 w-full"
                        style={{ 
                          caretColor: digit ? "transparent" : "white",
                          backgroundColor: "black"
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Verify Button and Resend Text */}
              <div className="flex flex-col gap-3 items-center relative shrink-0 w-full">
                <div className="flex flex-col gap-0 items-start relative shrink-0 w-full">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="w-full"
                    onClick={handleVerify}
                    disabled={(!isCodeComplete && !isConnected) || isVerifying}
                  >
                    <>
                      {isVerifying && <Loader2 className="size-4 animate-spin mr-2" />}
                      {isConnected ? "Finish" : "Connect Athlete"}
                    </>
                  </Button>
                </div>
                {isConnected && (
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="w-full bg-[#3a3f44] text-white hover:bg-[#4a4f54]"
                    onClick={() => router.push("/add-or-connect-athlete")}
                  >
                    Connect Another Athlete
                  </Button>
                )}
                {!isConnected && (
                  <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#c0c6cd] text-[14px] text-center tracking-[0px] w-full font-medium">
                    <p className="leading-[1.4]">
                      Didn't get the code?<br />
                      <button
                        onClick={handleResend}
                        className="text-[#0a93f5] hover:underline"
                      >
                        Resend the code
                      </button>
                      , check spam or confirm the athlete's email is correct.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

