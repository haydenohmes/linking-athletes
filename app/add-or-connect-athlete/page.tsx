"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Calendar, X, Plus, CheckCircle2, Loader2, Info, Clock, ArrowRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type PageMode = "selection" | "add" | "connect"
type ConnectStep = "send-link" | "request-sent" | "verification" | "connected"

export default function AddOrConnectAthletePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get version from query parameter (defaults to "1" if not provided)
  const version = searchParams.get("version") || "1"

  // Both versions redirect to program page first
  React.useEffect(() => {
    // Only redirect if we're not already coming from program page navigation
    // Check if there's a referrer or if this is a direct navigation
    const shouldRedirect = !window.location.search.includes("from=program")
    if (shouldRedirect) {
      const versionParam = version !== "1" ? `?version=${version}` : "?version=1"
      router.push(`/program${versionParam}`)
    }
  }, [version, router])

  // Selection state
  const [selectedOption, setSelectedOption] = React.useState<"connect" | "add" | null>(
    version === "2" ? "add" : "connect"
  )

  // Page mode state - version 2 starts at add form, version 1 starts at selection
  const [mode, setMode] = React.useState<PageMode>(version === "2" ? "add" : "selection")
  const [connectStep, setConnectStep] = React.useState<ConnectStep>("send-link")

  // Add athlete form state
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [dateOfBirth, setDateOfBirth] = React.useState("")
  const [gender, setGender] = React.useState("")
  const [grade, setGrade] = React.useState("")
  const [graduationYear, setGraduationYear] = React.useState("")
  const [isGuardian, setIsGuardian] = React.useState(false)

  // Connect flow state
  const [email, setEmail] = React.useState("")
  const [code, setCode] = React.useState<string[]>(["", "", "", "", "", ""])
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [isConnected, setIsConnected] = React.useState(false)
  const [connectedAthlete, setConnectedAthlete] = React.useState<{name: string, email: string} | null>(null)
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
  const [connectionAttempts, setConnectionAttempts] = React.useState<Array<{id: string, email: string, name: string, status: string, requestedDate: string}>>([])

  // Load connection attempts from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem("connectionAttempts")
    let attempts: Array<{id: string, email: string, name: string, status: string, requestedDate: string}> = []
    
    if (stored) {
      try {
        attempts = JSON.parse(stored)
      } catch (e) {
        console.error("Failed to load connection attempts", e)
      }
    }
    
    // Add default connected athletes for version 1
    const defaultAthletes = [
      {
        id: "weston-ohmes",
        email: "weston.ohmes@example.com",
        name: "Weston Ohmes",
        status: "connected",
        requestedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      },
      {
        id: "kiersten-ohmes",
        email: "kiersten.ohmes@example.com",
        name: "Kiersten Ohmes",
        status: "pending",
        requestedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      }
    ]
    
    // Merge default athletes with stored attempts, avoiding duplicates
    const existingIds = new Set(attempts.map(a => a.id))
    const newAthletes = defaultAthletes.filter(a => !existingIds.has(a.id))
    const allAttempts = [...newAthletes, ...attempts]
    
    setConnectionAttempts(allAttempts)
  }, [])

  // Keep version parameter in URL when navigating
  React.useEffect(() => {
    if (version !== "1") {
      const params = new URLSearchParams()
      params.set("version", version)
      window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`)
    }
  }, [version])

  const handleOptionClick = (option: "connect" | "add") => {
    setSelectedOption(option)
  }

  const handleContinue = () => {
    if (selectedOption === "connect") {
      setMode("connect")
      setConnectStep("send-link")
    } else if (selectedOption === "add") {
      setMode("add")
    }
  }

  const handleBackToSelection = () => {
    setMode("selection")
    setConnectStep("send-link")
    setEmail("")
    setCode(["", "", "", "", "", ""])
    setIsConnected(false)
    setConnectedAthlete(null)
    setFirstName("")
    setLastName("")
    setDateOfBirth("")
    setGender("")
    setGrade("")
    setGraduationYear("")
    setIsGuardian(false)
  }

  // Add athlete form handlers
  const handleFinish = () => {
    // TODO: Handle form submission
    router.push("/program")
  }

  const handleAddAnother = () => {
    // Reset form for another athlete
    setFirstName("")
    setLastName("")
    setDateOfBirth("")
    setGender("")
    setGrade("")
    setGraduationYear("")
    setIsGuardian(false)
  }

  const handleRemoveAthlete = () => {
    handleAddAnother()
  }

  // Connect flow handlers
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
      setConnectionAttempts(attempts)
      setConnectStep("request-sent")
    }
  }

  const handleEnterVerificationCode = () => {
    setConnectStep("verification")
  }

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
      setConnectStep("connected")
      
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
    } else if (isConnected && connectStep === "connected") {
      // Navigate to program page when Finish is clicked
      router.push("/program")
    }
  }

  const handleResend = () => {
    // Resend code logic
    setCode(["", "", "", "", "", ""])
    inputRefs.current[0]?.focus()
  }

  const handleConnectAnother = () => {
    // Reset connect flow and go back to selection
    handleBackToSelection()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return { icon: CheckCircle2, color: "text-[#548309]", text: "Connected" }
      case "pending":
        return { icon: Clock, color: "text-[#85909e]", text: "Pending" }
      default:
        return { icon: Clock, color: "text-[#85909e]", text: "Pending" }
    }
  }

  const handleResendAttempt = (attemptEmail: string) => {
    setEmail(attemptEmail)
    setMode("connect")
    setConnectStep("send-link")
  }

  const handleRemoveAttempt = (attemptId: string) => {
    const updated = connectionAttempts.filter(attempt => attempt.id !== attemptId)
    setConnectionAttempts(updated)
    localStorage.setItem("connectionAttempts", JSON.stringify(updated))
  }

  const isCodeComplete = code.every(digit => digit !== "")

  // Determine card width based on mode
  const cardWidth = mode === "add" ? "w-[480px]" : "w-[500px]"
  const cardMaxWidth = mode === "add" ? "max-w-[480px]" : "max-w-[500px]"
  const containerPadding = mode === "add" ? "px-20" : "px-6"

  return (
    <div className="bg-[#0f1215] flex flex-col isolate items-center overflow-clip relative rounded-[12px] size-full min-h-screen">
      <div className="basis-0 flex flex-col grow items-center justify-center min-h-px min-w-px relative shrink-0 w-full z-[1]">
        <div className={`basis-0 flex flex-col gap-0 grow items-center max-w-[560px] min-h-px min-w-px ${containerPadding} py-16 relative shrink-0 w-full`}>
          <div className={`${mode === "add" ? "bg-[#161b20]" : "bg-[#191f24]"} flex flex-col gap-6 items-center relative rounded-[12px] shrink-0 ${cardMaxWidth} ${cardWidth}`}>
            {/* Content Section */}
            <div className="flex flex-col gap-8 items-center pb-[60px] pt-10 px-10 relative shrink-0 w-full">
              {/* Selection Mode */}
              {mode === "selection" && (
                <>
                  {/* Header Text */}
                  <div className="flex flex-col gap-1 items-center leading-[0] relative shrink-0 text-center tracking-[0px] w-full font-medium">
                    <div className="flex flex-col justify-center relative shrink-0 text-[#fefefe] text-[24px] w-full">
                      <p className="leading-[1.2]">Add or Connect Athlete</p>
                    </div>
                    <div className="flex flex-col justify-center relative shrink-0 text-[#c0c6cd] text-[14px] w-full">
                      <p className="leading-[1.4]">Link to an existing athlete account or add a new athlete to get started.</p>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                    <div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
                      <button
                        onClick={() => handleOptionClick("connect")}
                        className={`flex gap-0 items-center min-h-[64px] px-8 py-6 relative rounded-[4px] shrink-0 w-full text-center transition-colors cursor-pointer ${
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
                        onClick={() => handleOptionClick("add")}
                        className={`flex gap-0 items-center min-h-[64px] px-8 py-6 relative rounded-[4px] shrink-0 w-full text-center transition-colors cursor-pointer ${
                          selectedOption === "add"
                            ? "bg-[#0d2959] border border-[#0273e3] border-solid"
                            : "bg-transparent border border-[#42474c] border-solid hover:border-[#42474c]"
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
                        onClick={handleContinue}
                        disabled={!selectedOption}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>

                  {/* Athletes Status Module - Version 1 only */}
                  {version === "1" && connectionAttempts.length > 0 && (
                    <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                      <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#c0c6cd] text-[16px] font-medium w-full">
                        <p className="leading-[1.15]">Athletes</p>
                      </div>
                      <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
                        {[...connectionAttempts].sort((a, b) => {
                          // Put pending athletes first
                          if (a.status === "pending" && b.status !== "pending") return -1
                          if (a.status !== "pending" && b.status === "pending") return 1
                          return 0
                        }).map((attempt) => {
                          const statusBadge = getStatusBadge(attempt.status)
                          const StatusIcon = statusBadge.icon
                          const isKiersten = attempt.id === "kiersten-ohmes"
                          return (
                            <div
                              key={attempt.id}
                              className="bg-[#21262b] border border-[#42474c] flex flex-col gap-3 items-start px-4 py-3 relative rounded-[4px] shrink-0 w-full"
                            >
                              <div className="flex gap-3 items-center relative shrink-0 w-full">
                                {!isKiersten && (
                                  <Avatar className="size-8 shrink-0">
                                    <AvatarFallback className="bg-[#38434f] text-white text-[12px] font-bold">
                                      {attempt.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <div className="basis-0 flex flex-col gap-1 grow items-start min-h-px min-w-px relative shrink-0">
                                  {!isKiersten && (
                                    <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#fefefe] text-[16px] w-full">
                                      <p className="leading-[1.15]">{attempt.name}</p>
                                    </div>
                                  )}
                                  <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#85909e] text-[14px] w-full">
                                    <p className="leading-[1.4]">{attempt.email}</p>
                                  </div>
                                  {isKiersten && attempt.status === "pending" && (
                                    <button
                                      onClick={() => handleResendAttempt(attempt.email)}
                                      className="flex items-center gap-1 text-[#c0c6cd] hover:text-[#85909e] text-[14px] transition-colors mt-0.5"
                                    >
                                      Resend Code
                                      <ArrowRight className="size-3" />
                                    </button>
                                  )}
                                </div>
                                <div className="ml-auto flex gap-2 items-center relative shrink-0">
                                  {attempt.status === "pending" ? (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="flex items-center justify-center cursor-help">
                                          <StatusIcon className={`size-4 ${statusBadge.color}`} />
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Pending</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  ) : (
                                    <StatusIcon className={`size-4 ${statusBadge.color}`} />
                                  )}
                                  <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#c0c6cd] text-[14px]">
                                    <p className="leading-[1.4]">{statusBadge.text}</p>
                                  </div>
                                  {isKiersten && (
                                    <button
                                      onClick={() => handleRemoveAttempt(attempt.id)}
                                      className="flex items-center justify-center size-6 rounded hover:bg-[#0f1215] transition-colors shrink-0 ml-2"
                                      aria-label="Remove athlete"
                                    >
                                      <X className="size-4 text-[#85909e] hover:text-[#c0c6cd]" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Add Athlete Mode */}
              {mode === "add" && (
                <>
                  {/* Header Text */}
                  <div className="flex flex-col gap-1 items-center leading-[0] relative shrink-0 text-center tracking-[0px] w-full font-medium">
                    <div className="flex flex-col justify-center relative shrink-0 text-[#fefefe] text-[24px] w-full">
                      <p className="leading-[1.2]">Add Your Athletes</p>
                    </div>
                    <div className="flex flex-col justify-center relative shrink-0 text-[#c0c6cd] text-[14px] w-full">
                      <p className="leading-[1.4]">Add your athlete's information so we can match them to the programs for which they are eligible.</p>
                    </div>
                  </div>

                  {/* Form Section */}
                  <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                    {/* Athlete Row */}
                    <div className="flex gap-2 items-center relative shrink-0 w-full">
                      <div className="basis-0 flex gap-2 grow items-center min-h-px min-w-px relative shrink-0">
                        <Avatar className="size-8 shrink-0">
                          <AvatarFallback className="bg-[#38434f] text-white text-[12px] font-bold">
                            {firstName && lastName ? `${firstName[0]}${lastName[0]}` : "CD"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#c0c6cd] text-[16px]">
                          <p className="leading-[1.15]">{firstName && lastName ? `${firstName} ${lastName}` : "John Doe"}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleRemoveAthlete}
                        className="shrink-0"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>

                    {/* Form Fields */}
                    <div className="flex flex-col gap-5 items-start relative shrink-0 w-full">
                      {/* First Name and Last Name */}
                      <div className="flex gap-3 items-start relative shrink-0 w-full">
                        <div className="basis-0 flex flex-col gap-1 grow items-start min-h-px min-w-px relative shrink-0">
                          <div className="flex gap-1 items-start leading-none relative shrink-0 text-[16px] text-nowrap w-full">
                            <p className="relative shrink-0 text-[#c0c6cd]">First Name</p>
                            <p className="relative shrink-0 text-[#ff563f]">*</p>
                          </div>
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="bg-black border border-[#42474c] min-h-[40px] rounded-[2px] text-[16px] text-white placeholder:text-[#85909e] px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#0273e3] focus:ring-offset-0"
                            placeholder="First Name"
                            style={{ backgroundColor: "black", color: "white" }}
                          />
                        </div>
                        <div className="basis-0 flex flex-col gap-1 grow items-start min-h-px min-w-px relative shrink-0">
                          <div className="flex gap-1 items-start leading-none relative shrink-0 text-[16px] text-nowrap w-full">
                            <p className="relative shrink-0 text-[#c0c6cd]">Last Name</p>
                            <p className="relative shrink-0 text-[#ff563f]">*</p>
                          </div>
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="bg-black border border-[#42474c] min-h-[40px] rounded-[2px] text-[16px] text-white placeholder:text-[#85909e] px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#0273e3] focus:ring-offset-0"
                            placeholder="Last Name"
                            style={{ backgroundColor: "black", color: "white" }}
                          />
                        </div>
                      </div>

                      {/* Date of Birth and Gender */}
                      <div className="flex gap-3 items-start relative shrink-0 w-full">
                        <div className="basis-0 flex flex-col gap-1 grow items-start min-h-px min-w-px relative shrink-0">
                          <div className="flex gap-1 items-start leading-none relative shrink-0 text-[16px] text-nowrap w-full">
                            <p className="relative shrink-0 text-[#c0c6cd]">Date of Birth</p>
                            <p className="relative shrink-0 text-[#ff563f]">*</p>
                          </div>
                          <div className="bg-black border border-[#42474c] flex items-center min-h-[40px] px-4 py-0 relative rounded-[2px] shrink-0 w-full" style={{ backgroundColor: "black" }}>
                            <input
                              type="text"
                              value={dateOfBirth}
                              onChange={(e) => setDateOfBirth(e.target.value)}
                              className="bg-transparent border-0 p-0 text-[16px] text-white placeholder:text-[#85909e] focus:outline-none flex-1"
                              placeholder="MM/DD/YYYY"
                              style={{ backgroundColor: "transparent", color: "white" }}
                            />
                            {version !== "1" && <Calendar className="size-4 text-white shrink-0 ml-2" />}
                          </div>
                        </div>
                        <div className="basis-0 flex flex-col gap-1 grow items-start min-h-px min-w-px relative shrink-0">
                          <div className="flex gap-1 items-start leading-none relative shrink-0 text-[16px] text-nowrap w-full">
                            <p className="relative shrink-0 text-[#c0c6cd]">Gender</p>
                            <p className="relative shrink-0 text-[#ff563f]">*</p>
                          </div>
                          <Select value={gender} onValueChange={setGender}>
                            <SelectTrigger className="bg-black border border-[#42474c] min-h-[40px] rounded-[2px] text-[16px] text-white [&>svg]:text-white" style={{ backgroundColor: "black", color: "white" }}>
                              <SelectValue placeholder="Select Gender" className="text-white" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#161b20] border border-[#42474c] text-white">
                              <SelectItem value="Male" className="text-white">Male</SelectItem>
                              <SelectItem value="Female" className="text-white">Female</SelectItem>
                              <SelectItem value="Other" className="text-white">Other</SelectItem>
                              <SelectItem value="Prefer not to say" className="text-white">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Grade and Graduation Year */}
                      <div className="flex gap-3 items-start relative shrink-0 w-full">
                        <div className="basis-0 flex flex-col gap-1 grow items-start min-h-px min-w-px relative shrink-0">
                          <div className="flex gap-1 items-start leading-none relative shrink-0 text-[16px] text-nowrap w-full">
                            <p className="relative shrink-0 text-[#c0c6cd]">Grade</p>
                            <p className="relative shrink-0 text-[#ff563f]">*</p>
                          </div>
                          <Select value={grade} onValueChange={setGrade}>
                            <SelectTrigger className="bg-black border border-[#42474c] min-h-[40px] rounded-[2px] text-[16px] text-white [&>svg]:text-white" style={{ backgroundColor: "black", color: "white" }}>
                              <SelectValue placeholder="Select Grade" className="text-white" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#161b20] border border-[#42474c] text-white">
                              <SelectItem value="K" className="text-white">Kindergarten</SelectItem>
                              <SelectItem value="1st" className="text-white">1st</SelectItem>
                              <SelectItem value="2nd" className="text-white">2nd</SelectItem>
                              <SelectItem value="3rd" className="text-white">3rd</SelectItem>
                              <SelectItem value="4th" className="text-white">4th</SelectItem>
                              <SelectItem value="5th" className="text-white">5th</SelectItem>
                              <SelectItem value="6th" className="text-white">6th</SelectItem>
                              <SelectItem value="7th" className="text-white">7th</SelectItem>
                              <SelectItem value="8th" className="text-white">8th</SelectItem>
                              <SelectItem value="9th" className="text-white">9th</SelectItem>
                              <SelectItem value="10th" className="text-white">10th</SelectItem>
                              <SelectItem value="11th" className="text-white">11th</SelectItem>
                              <SelectItem value="12th" className="text-white">12th</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="flex gap-1 items-center justify-center relative shrink-0 w-full">
                            <p className="text-[#85909e] text-[12px] leading-[1.4]">2025-2026 Academic Year</p>
                          </div>
                        </div>
                        <div className="basis-0 flex flex-col gap-1 grow items-start min-h-px min-w-px relative shrink-0">
                          <div className="flex gap-1 items-start leading-none relative shrink-0 text-[16px] text-nowrap w-full">
                            <p className="relative shrink-0 text-[#c0c6cd]">Graduation Year</p>
                            <p className="relative shrink-0 text-[#ff563f]">*</p>
                          </div>
                          <Select value={graduationYear} onValueChange={setGraduationYear}>
                            <SelectTrigger className="bg-black border border-[#42474c] min-h-[40px] rounded-[2px] text-[16px] text-white [&>svg]:text-white" style={{ backgroundColor: "black", color: "white" }}>
                              <SelectValue placeholder="Select Year" className="text-white" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#161b20] border border-[#42474c] text-white">
                              {Array.from({ length: 15 }, (_, i) => 2025 + i).map((year) => (
                                <SelectItem key={year} value={year.toString()} className="text-white">
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Guardian Checkbox */}
                      <div className="flex gap-2 items-start relative shrink-0 w-full">
                        <div className="flex h-[21px] items-center justify-center relative shrink-0 mt-0.5">
                          <Checkbox
                            checked={isGuardian}
                            onCheckedChange={(checked) => setIsGuardian(checked === true)}
                            className="border-[#42474c] data-[state=checked]:bg-[#0273e3] data-[state=checked]:border-[#0273e3]"
                          />
                        </div>
                        <div className="basis-0 flex flex-col justify-center leading-[0] grow min-h-px min-w-px relative shrink-0 text-[#c0c6cd] text-[14px]">
                          <p className="leading-[1.4] break-words">
                            I am the parent or legal guardian of the athlete listed above. I understand that a parent or legal guardian is required to register someone under 18 years old. I acknowledge that the participant and I, the parent/legal guardian, agree to abide by the organization's rules and policies.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
                      <button
                        onClick={handleAddAnother}
                        className="w-full bg-[#34363A] text-[#C4C4C4] hover:bg-[#3a3d41] rounded-[2px] h-10 px-4 flex items-center justify-center gap-2 transition-colors shadow-sm font-bold text-base"
                      >
                        <Plus className="size-4 text-[#C4C4C4]" />
                        <span className="text-[#C4C4C4] font-bold">Add Another Athlete</span>
                      </button>
                      {version === "2" && (
                        <Button
                          variant="secondary"
                          size="lg"
                          onClick={() => {
                            setMode("connect")
                            setConnectStep("send-link")
                          }}
                          className="w-full"
                        >
                          Connect an athlete
                        </Button>
                      )}
                      <Button
                        variant="default"
                        size="lg"
                        onClick={handleFinish}
                        className="w-full"
                      >
                        Finish
                      </Button>
                      {version !== "2" && (
                        <Button
                          variant="ghost"
                          size="lg"
                          onClick={() => {
                            setMode("connect")
                            setConnectStep("send-link")
                          }}
                          className="w-full"
                        >
                          Connect an athlete
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Connect Flow - Send Link */}
              {mode === "connect" && connectStep === "send-link" && (
                <>
                  {/* Header Text */}
                  <div className="flex flex-col gap-1 items-center leading-[0] relative shrink-0 text-center tracking-[0px] w-full font-medium">
                    <div className="flex flex-col justify-center relative shrink-0 text-[#fefefe] text-[24px] w-full">
                      <p className="leading-[1.2]">Send Link to Connect an Athlete</p>
                    </div>
                    <div className="flex flex-col justify-center relative shrink-0 text-[#c0c6cd] text-[14px] w-full">
                      <p className="leading-[1.4]">We'll check for an existing account and send the athlete a verification code to confirm connection.</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
                    <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
                      <input
                        type="email"
                        placeholder="Athlete Email*"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-black border border-[#42474c] min-h-[48px] rounded-[2px] text-[18px] text-white placeholder:text-[#85909e] px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#0273e3] focus:ring-offset-0"
                        style={{ backgroundColor: "black", color: "white" }}
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
                </>
              )}

              {/* Connect Flow - Request Sent */}
              {mode === "connect" && connectStep === "request-sent" && (
                <>
                  {/* Header Text */}
                  <div className="flex flex-col gap-1 items-center leading-[0] relative shrink-0 text-center tracking-[0px] w-full font-medium">
                    <div className="flex flex-col justify-center relative shrink-0 text-[#fefefe] text-[24px] w-full">
                      <p className="leading-[1.2]">Connection Request Sent</p>
                    </div>
                    <div className="flex flex-col justify-center relative shrink-0 text-[#c0c6cd] text-[14px] w-full">
                      <p className="leading-[1.4]">If an athlete uses this email, they'll receive a verification code. Click the button below to enter the verification code.</p>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div className="flex flex-col gap-0 items-start relative shrink-0 w-full">
                    <div className="flex flex-col gap-0 items-start relative shrink-0 w-full">
                      <Button 
                        variant="default" 
                        size="lg" 
                        className="w-full"
                        onClick={handleEnterVerificationCode}
                      >
                        Enter Verification Code
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Connect Flow - Verification Code */}
              {mode === "connect" && connectStep === "verification" && !isConnected && (
                <>
                  {/* Header Text */}
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

                  {/* Verification Code Inputs */}
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

                  {/* Verify Button and Resend Text */}
                  <div className="flex flex-col gap-3 items-center relative shrink-0 w-full">
                    <div className="flex flex-col gap-0 items-start relative shrink-0 w-full">
                      <Button 
                        variant="default" 
                        size="lg" 
                        className="w-full"
                        onClick={handleVerify}
                        disabled={!isCodeComplete || isVerifying}
                      >
                        <>
                          {isVerifying && <Loader2 className="size-4 animate-spin mr-2" />}
                          Connect Athlete
                        </>
                      </Button>
                    </div>
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
                  </div>
                </>
              )}

              {/* Connect Flow - Connected Success */}
              {mode === "connect" && connectStep === "connected" && isConnected && (
                <>
                  {/* Header Text */}
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
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 items-center relative shrink-0 w-full">
                    <div className="flex flex-col gap-0 items-start relative shrink-0 w-full">
                      <Button 
                        variant="default" 
                        size="lg" 
                        className="w-full"
                        onClick={handleVerify}
                      >
                        Finish
                      </Button>
                    </div>
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      className="w-full bg-[#3a3f44] text-white hover:bg-[#4a4f54]"
                      onClick={handleConnectAnother}
                    >
                      Connect Another Athlete
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
