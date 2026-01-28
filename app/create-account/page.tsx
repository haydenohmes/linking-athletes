"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Info } from "lucide-react"


export default function CreateAccountPage() {
  const router = useRouter()
  const [isLoginMode, setIsLoginMode] = React.useState(false)
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const handleContinue = () => {
    // Navigate to the add-or-connect-athlete flow
    router.push("/add-or-connect-athlete")
  }

  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode)
    // Clear form fields when switching modes
    setFirstName("")
    setLastName("")
    setEmail("")
    setPassword("")
  }

  return (
    <div className="bg-[#0f1215] content-stretch flex flex-col isolate items-center overflow-clip relative rounded-[12px] size-full min-h-screen">
      <div className="content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-h-px min-w-px relative w-full z-[1]">
        <div className="content-stretch flex flex-[1_0_0] flex-col gap-0 items-center max-w-[560px] min-h-px min-w-px px-[24px] py-[64px] relative w-full">
          <div className="bg-[#191f24] content-stretch flex flex-col gap-[24px] items-center max-w-[400px] relative rounded-[12px] shrink-0 w-[400px]">
            {/* Form Container */}
            <div className="content-stretch flex flex-col gap-[32px] items-center pb-[60px] pt-[40px] px-[40px] relative shrink-0 w-full">
              {/* Header */}
              <div className="flex flex-col font-['Barlow',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#fefefe] text-[24px] text-center tracking-[0px] w-full">
                <p className="leading-[1.2]">{isLoginMode ? "Log In" : "Create Account"}</p>
              </div>

              {/* Alert Banner */}
              <div className="bg-[#282c34] border border-[#42474c] rounded-[4px] px-4 py-3 w-full flex items-center gap-2 mb-0">
                <Info className="size-4 text-[#c0c6cd] shrink-0" />
                <p className="text-[#c0c6cd] text-[14px] leading-[1.4] font-['Barlow',sans-serif] text-left">
                  Create an account or login to register your athlete
                </p>
              </div>

              {/* Form Fields */}
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full -mt-2">
                {!isLoginMode ? (
                  <>
                    {/* First Name */}
                    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                      <Input
                        type="text"
                        placeholder="First Name*"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-white border border-[#42474c] text-[#0f1215] text-[18px] placeholder:text-[#85909e] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#42474c] h-[48px] min-h-[48px] px-[16px] rounded-[2px] font-['Barlow',sans-serif]"
                      />
                    </div>

                    {/* Last Name */}
                    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                      <Input
                        type="text"
                        placeholder="Last Name*"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-white border border-[#42474c] text-[#0f1215] text-[18px] placeholder:text-[#85909e] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#42474c] h-[48px] min-h-[48px] px-[16px] rounded-[2px] font-['Barlow',sans-serif]"
                      />
                    </div>
                  </>
                ) : null}

                {/* Email */}
                <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                  <Input
                    type="email"
                    placeholder="Email*"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white border border-[#42474c] text-[#0f1215] text-[18px] placeholder:text-[#85909e] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#42474c] h-[48px] min-h-[48px] px-[16px] rounded-[2px] font-['Barlow',sans-serif]"
                  />
                </div>

                {/* Password - Only show in login mode */}
                {isLoginMode && (
                  <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                    <Input
                      type="password"
                      placeholder="Password*"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white border border-[#42474c] text-[#0f1215] text-[18px] placeholder:text-[#85909e] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#42474c] h-[48px] min-h-[48px] px-[16px] rounded-[2px] font-['Barlow',sans-serif]"
                    />
                  </div>
                )}

                {/* Continue/Log In Button and Toggle Link */}
                <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                  <Button
                    onClick={handleContinue}
                    variant="default"
                    size="lg"
                    className="w-full bg-[#3370f4] hover:bg-[#2a5dd9] text-white font-medium font-['Barlow',sans-serif]"
                  >
                    {isLoginMode ? "Log In" : "Continue"}
                  </Button>
                  <div className="flex flex-col font-['Barlow',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#c0c6cd] text-[14px] tracking-[0px] w-full text-center">
                    <p className="leading-[1.4]">
                      {isLoginMode ? (
                        <>
                          <span>Don't have an account? </span>
                          <button
                            onClick={handleToggleMode}
                            className="text-[#0a93f5] hover:underline cursor-pointer font-['Barlow',sans-serif]"
                          >
                            Create Account
                          </button>
                        </>
                      ) : (
                        <>
                          <span>Already have an account? </span>
                          <button
                            onClick={handleToggleMode}
                            className="text-[#0a93f5] hover:underline cursor-pointer font-['Barlow',sans-serif]"
                          >
                            Log In
                          </button>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

