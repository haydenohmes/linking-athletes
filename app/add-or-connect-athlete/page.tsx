"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Calendar, X, Plus, CheckCircle2, Loader2, Info, Clock, ArrowRight, ArrowLeft, AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type PageMode = "auth" | "selection" | "add" | "connect"
type ConnectStep = "send-link" | "verification" | "connected"

export default function AddOrConnectAthletePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get version from query parameter (defaults to "1" if not provided)
  const version = searchParams.get("version") || "1"
  // Get display mode from query parameter (defaults to "cards" if not provided)
  const displayMode = searchParams.get("display") || "cards"
  // Get connection requests variant from query parameter
  const showConnectionRequests = searchParams.get("connectionRequests") === "true"

  // Redirect logic removed for happy path user testing
  // Users should land on create account page when visiting /add-or-connect-athlete

  // Handle mode parameter from URL
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const urlMode = urlParams.get("mode")
      if (urlMode === "add") {
        setMode("add")
      } else if (urlMode === "connect") {
        setMode("connect")
        // Check localStorage for email to determine if we should go to verification step
        const connectEmail = localStorage.getItem("connectEmail")
        if (connectEmail) {
          setEmail(connectEmail)
          setConnectStep("verification")
        } else {
          setConnectStep("send-link")
        }
      }
    }
  }, [])

  // Selection state
  const [selectedOption, setSelectedOption] = React.useState<"connect" | "add" | null>(
    version === "2" ? "add" : "connect"
  )

  // Auth state
  const [isLoginMode, setIsLoginMode] = React.useState(false)
  const [authFirstName, setAuthFirstName] = React.useState("")
  const [authLastName, setAuthLastName] = React.useState("")
  const [authEmail, setAuthEmail] = React.useState("")
  const [authPassword, setAuthPassword] = React.useState("")

  // Page mode state - starts with auth as the first step
  const [mode, setMode] = React.useState<PageMode>(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      // If coming from program page, skip auth and go to selection/add/connect flows
      const fromProgram = urlParams.get("from") === "program"
      if (fromProgram) {
        // Check if mode is specified in URL
        const urlMode = urlParams.get("mode")
        if (urlMode === "add") {
          return "add"
        }
        if (urlMode === "connect") {
          return "connect"
        }
        const saved = localStorage.getItem("addOrConnectMode")
        if (saved && (saved === "selection" || saved === "add" || saved === "connect")) {
          return saved as PageMode
        }
        return version === "2" ? "add" : "selection"
      }
      
      // Check if authenticated (skip auth if already done)
      const authenticated = localStorage.getItem("isAuthenticated") === "true"
      if (authenticated) {
        // Check if mode is specified in URL
        const urlMode = urlParams.get("mode")
        if (urlMode === "add") {
          return "add"
        }
        const saved = localStorage.getItem("addOrConnectMode")
        if (saved && (saved === "selection" || saved === "add" || saved === "connect")) {
          return saved as PageMode
        }
        return version === "2" ? "add" : "selection"
      }
    }
    // Default to auth as the first step
    return "auth"
  })
  const [connectStep, setConnectStep] = React.useState<ConnectStep>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("addOrConnectStep")
      if (saved && (saved === "send-link" || saved === "verification" || saved === "connected")) {
        return saved as ConnectStep
      }
    }
    return "send-link"
  })

  // Add athlete form state
  const [firstName, setFirstName] = React.useState(() => {
    if (typeof window !== "undefined") {
      // First check for stored firstName
      const storedFirstName = localStorage.getItem("addAthleteFirstName")
      if (storedFirstName) {
        return storedFirstName
      }
      // Then check for full name
      const storedName = localStorage.getItem("addAthleteName")
      if (storedName) {
        const nameParts = storedName.trim().split(" ")
        return nameParts[0] || ""
      }
      // Finally check for connected athlete
      const saved = localStorage.getItem("addOrConnectAthlete")
      if (saved) {
        try {
          const athlete = JSON.parse(saved)
          if (athlete && athlete.name) {
            const nameParts = athlete.name.trim().split(" ")
            return nameParts[0] || ""
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
    return ""
  })
  const [lastName, setLastName] = React.useState(() => {
    if (typeof window !== "undefined") {
      // First check for stored lastName
      const storedLastName = localStorage.getItem("addAthleteLastName")
      if (storedLastName) {
        return storedLastName
      }
      // Then check for full name
      const storedName = localStorage.getItem("addAthleteName")
      if (storedName) {
        const nameParts = storedName.trim().split(" ")
        // Get everything after the first name as last name
        return nameParts.slice(1).join(" ") || ""
      }
      // Finally check for connected athlete
      const saved = localStorage.getItem("addOrConnectAthlete")
      if (saved) {
        try {
          const athlete = JSON.parse(saved)
          if (athlete && athlete.name) {
            const nameParts = athlete.name.trim().split(" ")
            return nameParts.slice(1).join(" ") || ""
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
    return ""
  })

  // Update form fields when mode changes to "add" and athlete name is stored
  React.useEffect(() => {
    if (mode === "add" && typeof window !== "undefined") {
      // First check for stored firstName/lastName
      const storedFirstName = localStorage.getItem("addAthleteFirstName")
      const storedLastName = localStorage.getItem("addAthleteLastName")
      if (storedFirstName) {
        setFirstName(storedFirstName)
      }
      if (storedLastName) {
        setLastName(storedLastName)
      }
      // If no stored names, check for connected athlete
      if (!storedFirstName && !storedLastName) {
        const saved = localStorage.getItem("addOrConnectAthlete")
        if (saved) {
          try {
            const athlete = JSON.parse(saved)
            if (athlete && athlete.name) {
              const nameParts = athlete.name.trim().split(" ")
              const first = nameParts[0] || ""
              const last = nameParts.slice(1).join(" ") || ""
              if (first) setFirstName(first)
              if (last) setLastName(last)
            }
          } catch (e) {
            // Ignore parse errors
          }
        }
      }
    }
  }, [mode])
  const [dateOfBirth, setDateOfBirth] = React.useState("")
  const [gender, setGender] = React.useState("")
  const [grade, setGrade] = React.useState("")
  const [graduationYear, setGraduationYear] = React.useState("")
  const [isGuardian, setIsGuardian] = React.useState(false)

  // Connect flow state - load from localStorage to persist on refresh
  const [email, setEmail] = React.useState(() => {
    if (typeof window !== "undefined") {
      // Only read connectEmail if we're explicitly in connect mode (from URL parameter)
      const urlParams = new URLSearchParams(window.location.search)
      const urlMode = urlParams.get("mode")
      if (urlMode === "connect") {
        // Check for connectEmail first (set from program page connection request cards), then fallback to addOrConnectEmail
        const connectEmail = localStorage.getItem("connectEmail")
        if (connectEmail) {
          localStorage.removeItem("connectEmail") // Clear it after reading
          return connectEmail
        }
      }
      return localStorage.getItem("addOrConnectEmail") || ""
    }
    return ""
  })
  const [code, setCode] = React.useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("addOrConnectCode")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length === 6) {
            return parsed
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
    return ["", "", "", "", "", ""]
  })
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [failedAttempts, setFailedAttempts] = React.useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("verificationFailedAttempts")
      return stored ? parseInt(stored, 10) : 0
    }
    return 0
  })
  const [isConnected, setIsConnected] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("addOrConnectConnected") === "true"
    }
    return false
  })
  const [connectedAthlete, setConnectedAthlete] = React.useState<{name: string, email: string} | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("addOrConnectAthlete")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
    return null
  })
  const [newlyConnectedAthlete, setNewlyConnectedAthlete] = React.useState<{name: string, email: string, isNew: boolean} | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("newlyConnectedAthlete")
      if (stored) {
        try {
          const athlete = JSON.parse(stored)
          // Clear it after reading so it only shows once
          localStorage.removeItem("newlyConnectedAthlete")
          return athlete
        } catch (e) {
          return null
        }
      }
    }
    return null
  })
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
  const [connectionAttempts, setConnectionAttempts] = React.useState<Array<{id: string, email: string, name: string, status: string, requestedDate: string}>>([])
  const [fromConnectedPage, setFromConnectedPage] = React.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("fromConnectedPage") === "true"
    }
    return false
  })
  const [showCancelDialog, setShowCancelDialog] = React.useState(false)
  const [athleteToCancel, setAthleteToCancel] = React.useState<string | null>(null)

  // Load connection attempts from localStorage
  React.useEffect(() => {
    // Clear connection attempts (for testing - remove athletes you just sent codes to)
    if (typeof window !== "undefined") {
      localStorage.removeItem("connectionAttempts")
    }
    
    let attempts: Array<{id: string, email: string, name: string, status: string, requestedDate: string}> = []
    
    // Add default connected athletes for version 1
    const defaultAthletes = [
      {
        id: "john-doe",
        email: "john.doe@hudl.com",
        name: "John Doe",
        status: "pending",
        requestedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      },
      {
        id: "jane-doe",
        email: "jane.doe@hudl.com",
        name: "Jane Doe",
        status: "pending",
        requestedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      }
    ]
    
    // Put default athletes first in the correct order, then other attempts
    const allAttempts = [...defaultAthletes, ...attempts]
    
    // Save to localStorage to persist
    if (typeof window !== "undefined") {
      localStorage.setItem("connectionAttempts", JSON.stringify(allAttempts))
    }
    
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

  // Persist state to localStorage whenever it changes
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("addOrConnectMode", mode)
    }
  }, [mode])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("addOrConnectStep", connectStep)
    }
  }, [connectStep])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (email) {
        localStorage.setItem("addOrConnectEmail", email)
      } else {
        localStorage.removeItem("addOrConnectEmail")
      }
    }
  }, [email])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("addOrConnectCode", JSON.stringify(code))
    }
  }, [code])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("addOrConnectConnected", isConnected.toString())
    }
  }, [isConnected])

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      if (connectedAthlete) {
        localStorage.setItem("addOrConnectAthlete", JSON.stringify(connectedAthlete))
      } else {
        localStorage.removeItem("addOrConnectAthlete")
      }
    }
  }, [connectedAthlete])

  const handleOptionClick = (option: "connect" | "add") => {
    setSelectedOption(option)
  }

  const handleAuthContinue = () => {
    // Mark as authenticated and navigate to program page
    if (typeof window !== "undefined") {
      localStorage.setItem("isAuthenticated", "true")
    }
    const params = new URLSearchParams()
    if (version !== "1") params.set("version", version)
    if (displayMode === "avatars") params.set("display", "avatars")
    if (showConnectionRequests) params.set("connectionRequests", "true")
    const queryString = params.toString() ? `?${params.toString()}` : ""
    router.push(`/program${queryString}`)
  }

  const handleToggleAuthMode = () => {
    setIsLoginMode(!isLoginMode)
    // Clear form fields when switching modes
    setAuthFirstName("")
    setAuthLastName("")
    setAuthEmail("")
    setAuthPassword("")
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
    // Check if we should go back to auth instead of selection
    const authenticated = typeof window !== "undefined" && localStorage.getItem("isAuthenticated") === "true"
    if (!authenticated) {
      // If not authenticated, go to auth page
      setMode("auth")
      return
    }
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
    // Clear localStorage state when going back to selection
    if (typeof window !== "undefined") {
      localStorage.removeItem("addOrConnectEmail")
      localStorage.removeItem("addOrConnectCode")
      localStorage.removeItem("addOrConnectConnected")
      localStorage.removeItem("addOrConnectAthlete")
      localStorage.removeItem("addAthleteName")
    }
  }

  const handleBack = () => {
    // Check if we came from program page
    const fromProgram = searchParams.get("from") === "program" || 
                       (typeof window !== "undefined" && localStorage.getItem("fromProgram") === "true")
    
    // Check if we're on verification step
    if (connectStep === "verification") {
      if (typeof window !== "undefined") {
        localStorage.setItem("addOrConnectStep", "send-link")
      }
      setConnectStep("send-link")
      return
    }
    
    if (mode === "auth") {
      // From auth screen, if we came from program, go back to program
      if (fromProgram) {
        const params = new URLSearchParams()
        if (version !== "1") params.set("version", version)
        if (displayMode === "avatars") params.set("display", "avatars")
        if (showConnectionRequests) params.set("connectionRequests", "true")
        const queryString = params.toString() ? `?${params.toString()}` : ""
        router.push(`/program${queryString}`)
        return
      }
      // Otherwise, this is the root - don't go back further
      return
    } else if (mode === "selection") {
      // From selection screen, if we came from program, go back to program
      if (fromProgram) {
        const params = new URLSearchParams()
        if (version !== "1") params.set("version", version)
        if (displayMode === "avatars") params.set("display", "avatars")
        if (showConnectionRequests) params.set("connectionRequests", "true")
        const queryString = params.toString() ? `?${params.toString()}` : ""
        router.push(`/program${queryString}`)
        return
      }
      // Otherwise, go back to auth (create account page)
      setMode("auth")
      // Clear authentication so they can see the auth screen
      if (typeof window !== "undefined") {
        localStorage.removeItem("isAuthenticated")
      }
    } else if (mode === "connect") {
      if (connectStep === "send-link") {
        // If from program, go back to program, otherwise go to selection
        if (fromProgram) {
          const params = new URLSearchParams()
          if (version !== "1") params.set("version", version)
          if (displayMode === "avatars") params.set("display", "avatars")
          if (showConnectionRequests) params.set("connectionRequests", "true")
          const queryString = params.toString() ? `?${params.toString()}` : ""
          router.push(`/program${queryString}`)
        } else {
          handleBackToSelection()
        }
      } else if (connectStep === "connected") {
        handleBackToSelection()
      }
    } else if (mode === "add") {
      // If from program, go back to program, otherwise go to selection
      if (fromProgram) {
        const params = new URLSearchParams()
        if (version !== "1") params.set("version", version)
        if (displayMode === "avatars") params.set("display", "avatars")
        if (showConnectionRequests) params.set("connectionRequests", "true")
        const queryString = params.toString() ? `?${params.toString()}` : ""
        router.push(`/program${queryString}`)
      } else {
        handleBackToSelection()
      }
    }
  }

  const canGoBack = () => {
    // Hide back button on auth page (it's the root/starting point)
    if (mode === "auth") {
      return false
    }
    // Show back button on all other screens
    return true
  }

  // Add athlete form handlers
  const handleFinish = () => {
    // Save the completed athlete to localStorage
    if (typeof window !== "undefined" && firstName && lastName) {
      const athleteName = `${firstName} ${lastName}`
      const athleteData = {
        id: `athlete-${Date.now()}`,
        name: athleteName,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: dateOfBirth,
        gender: gender,
        grade: grade,
        graduationYear: graduationYear,
        isGuardian: isGuardian,
        completedAt: new Date().toISOString()
      }
      
      // Get existing athletes
      const existingAthletes = localStorage.getItem("completedAthletes")
      let athletes: Array<typeof athleteData> = []
      if (existingAthletes) {
        try {
          athletes = JSON.parse(existingAthletes)
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      // Add new athlete (avoid duplicates by checking name)
      const existingIndex = athletes.findIndex(a => 
        a.firstName === firstName && a.lastName === lastName
      )
      if (existingIndex >= 0) {
        athletes[existingIndex] = athleteData
      } else {
        athletes.push(athleteData)
      }
      
      // Save athletes and set flag BEFORE navigation
      localStorage.setItem("completedAthletes", JSON.stringify(athletes))
      localStorage.setItem("athleteJustAdded", "true")
      
      // Verify it was saved
      console.log("Athlete saved:", athleteData)
      console.log("All athletes:", athletes)
    }
    
    // Clear localStorage state when finishing
    if (typeof window !== "undefined") {
      localStorage.removeItem("addOrConnectMode")
      localStorage.removeItem("addOrConnectStep")
      localStorage.removeItem("fromConnectedPage")
      localStorage.removeItem("addOrConnectEmail")
      localStorage.removeItem("addOrConnectCode")
      localStorage.removeItem("addOrConnectConnected")
      localStorage.removeItem("addOrConnectAthlete")
      localStorage.removeItem("addAthleteName")
      localStorage.removeItem("addAthleteFirstName")
      localStorage.removeItem("addAthleteLastName")
      localStorage.removeItem("fromProgram")
      setFromConnectedPage(false)
    }
    const params = new URLSearchParams()
    if (version !== "1") params.set("version", version)
    if (displayMode === "avatars") params.set("display", "avatars")
    if (showConnectionRequests) params.set("connectionRequests", "true")
    const queryString = params.toString() ? `?${params.toString()}` : ""
    router.push(`/program${queryString}`)
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
      setConnectStep("verification")
      
      // Show success toast
      toast.custom((t) => (
        <div className="bg-[#21262b] flex gap-4 h-[47px] items-start overflow-clip rounded-[4px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.3),0px_0px_8px_0px_rgba(0,0,0,0.2)] w-[348px]">
          <div className="bg-[#548309] flex h-full items-center p-2 rounded-bl-[4px] rounded-tl-[4px] shrink-0">
            <CheckCircle2 className="size-4 text-white" />
          </div>
          <div className="basis-0 flex flex-col gap-2 grow items-start min-h-px min-w-px px-0 py-4 relative shrink-0">
            <p className="font-normal leading-[15px] min-w-full not-italic relative shrink-0 text-[14px] text-[#c0c6cd]">
              Verification code sent successfully.
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
    if (fullCode.length === 6 && !isVerifying && !isConnected && failedAttempts < 10) {
      setIsVerifying(true)
      
      // Simulate verification API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo purposes, treat any code that's not "111111" as invalid
      // In production, this would check against the actual code from the server
      const isCodeValid = fullCode === "111111"
      
      if (!isCodeValid) {
        const newFailedAttempts = failedAttempts + 1
        setFailedAttempts(newFailedAttempts)
        if (typeof window !== "undefined") {
          localStorage.setItem("verificationFailedAttempts", newFailedAttempts.toString())
        }
        setIsVerifying(false)
        // Clear the code inputs after failed attempt
        setCode(["", "", "", "", "", ""])
        inputRefs.current[0]?.focus()
        return
      }
      
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
      
      // Reset failed attempts on success
      setFailedAttempts(0)
      if (typeof window !== "undefined") {
        localStorage.removeItem("verificationFailedAttempts")
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
      // Store newly connected athlete for program page display
      if (typeof window !== "undefined" && connectedAthlete) {
        localStorage.setItem("newlyConnectedAthlete", JSON.stringify({
          ...connectedAthlete,
          isNew: true,
          timestamp: Date.now()
        }))
      }
      // Navigate to program page when Finish is clicked
      // Clear localStorage state when finishing
      if (typeof window !== "undefined") {
        localStorage.removeItem("addOrConnectMode")
        localStorage.removeItem("addOrConnectStep")
        localStorage.removeItem("addOrConnectEmail")
        localStorage.removeItem("addOrConnectCode")
        localStorage.removeItem("addOrConnectConnected")
        localStorage.removeItem("addOrConnectAthlete")
        localStorage.removeItem("fromConnectedPage")
        setFromConnectedPage(false)
      }
      router.push("/program")
    }
  }

  const handleResend = () => {
    // Resend code logic
    setCode(["", "", "", "", "", ""])
    setFailedAttempts(0)
    if (typeof window !== "undefined") {
      localStorage.removeItem("verificationFailedAttempts")
    }
    inputRefs.current[0]?.focus()
  }

  const handleConnectAnother = () => {
    // Reset connect flow and go back to selection
    handleBackToSelection()
  }

  const getStatusBadge = (status: string, email?: string) => {
    // Check if this is the expired email
    if (email?.toLowerCase() === "jane.doe@hudl.com") {
      return { icon: AlertTriangle, color: "text-[#ff8c00]", text: "Expired" }
    }
    switch (status) {
      case "connected":
        return { icon: CheckCircle2, color: "text-[#548309]", text: "Connected" }
      case "pending":
        return { icon: Clock, color: "text-[#85909e]", text: "Enter Code" }
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

  const handleCancelClick = (attemptId: string) => {
    setAthleteToCancel(attemptId)
    setShowCancelDialog(true)
  }

  const handleConfirmCancel = () => {
    if (athleteToCancel) {
      handleRemoveAttempt(athleteToCancel)
      setAthleteToCancel(null)
    }
    setShowCancelDialog(false)
  }

  const isCodeComplete = code.every(digit => digit !== "")

  // Determine card width based on mode
  const cardWidth = mode === "add" ? "w-[480px]" : mode === "auth" ? "w-[400px]" : "w-[500px]"
  const cardMaxWidth = mode === "add" ? "max-w-[480px]" : mode === "auth" ? "max-w-[400px]" : "max-w-[500px]"
  const containerPadding = mode === "add" ? "px-20" : "px-6"

  return (
    <div className="bg-[#0f1215] flex flex-col isolate items-center overflow-clip relative rounded-[12px] size-full min-h-screen">
      <div className={`basis-0 flex flex-col grow items-center justify-center min-h-px min-w-px relative shrink-0 w-full z-[1] overflow-y-auto ${canGoBack() ? "pb-20" : ""}`}>
        <div className={`basis-0 flex flex-col gap-0 grow items-center max-w-[560px] min-h-px min-w-px ${containerPadding} py-16 relative shrink-0 w-full`}>
          <div className={`${mode === "add" ? "bg-[#161b20]" : "bg-[#191f24]"} flex flex-col gap-6 items-center relative rounded-[12px] shrink-0 ${cardMaxWidth} ${cardWidth}`}>
            {/* Content Section */}
            <div className="flex flex-col gap-8 items-center pb-[60px] pt-10 px-10 relative shrink-0 w-full">
              {/* Auth Mode */}
              {mode === "auth" && (
                <>
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
                            value={authFirstName}
                            onChange={(e) => setAuthFirstName(e.target.value)}
                            className="bg-white border border-[#42474c] text-[#0f1215] text-[18px] placeholder:text-[#85909e] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#42474c] h-[48px] min-h-[48px] px-[16px] rounded-[2px] font-['Barlow',sans-serif]"
                          />
                        </div>

                        {/* Last Name */}
                        <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                          <Input
                            type="text"
                            placeholder="Last Name*"
                            value={authLastName}
                            onChange={(e) => setAuthLastName(e.target.value)}
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
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        className="bg-white border border-[#42474c] text-[#0f1215] text-[18px] placeholder:text-[#85909e] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#42474c] h-[48px] min-h-[48px] px-[16px] rounded-[2px] font-['Barlow',sans-serif]"
                      />
                    </div>

                    {/* Password - Only show in login mode */}
                    {isLoginMode && (
                      <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
                        <Input
                          type="password"
                          placeholder="Password*"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          className="bg-white border border-[#42474c] text-[#0f1215] text-[18px] placeholder:text-[#85909e] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#42474c] h-[48px] min-h-[48px] px-[16px] rounded-[2px] font-['Barlow',sans-serif]"
                        />
                      </div>
                    )}

                    {/* Continue/Log In Button and Toggle Link */}
                    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                      <Button
                        onClick={handleAuthContinue}
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
                                onClick={handleToggleAuthMode}
                                className="text-[#0a93f5] hover:underline cursor-pointer font-['Barlow',sans-serif]"
                              >
                                Create Account
                              </button>
                            </>
                          ) : (
                            <>
                              <span>Already have an account? </span>
                              <button
                                onClick={handleToggleAuthMode}
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
                </>
              )}

              {/* Selection Mode */}
              {mode === "selection" && (
                <>
                  {/* Header Text */}
                  <div className="flex flex-col gap-1 items-center leading-[0] relative shrink-0 text-center tracking-[0px] w-full font-medium">
                    <div className="flex flex-col justify-center relative shrink-0 text-[#fefefe] text-[24px] w-full">
                      <p className="leading-[1.2]">Add or Connect to Hudl Athlete</p>
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
                            : "bg-transparent border border-[#42474c] border-solid hover:border-[#5a5f64]"
                        }`}
                      >
                        <div className="basis-0 flex flex-col grow h-full justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-nowrap tracking-[0px] font-medium">
                          <p className={`leading-[1.4] overflow-ellipsis overflow-hidden text-[16px] ${
                            selectedOption === "connect" ? "text-[#fefefe]" : "text-[#85909e]"
                          }`}>
                            Connect to Existing Hudl Athlete
                          </p>
                        </div>
                      </button>
                      
                      {/* Divider with "or" text */}
                      <div className="flex items-center justify-center w-full relative shrink-0">
                        <div className="flex-1 h-px bg-[#42474c]"></div>
                        <div className="px-3">
                          <p className="text-[#85909e] text-[12px]">or</p>
                        </div>
                        <div className="flex-1 h-px bg-[#42474c]"></div>
                      </div>
                      
                      <button
                        onClick={() => handleOptionClick("add")}
                        className={`flex gap-0 items-center min-h-[64px] px-8 py-6 relative rounded-[4px] shrink-0 w-full text-center transition-colors cursor-pointer ${
                          selectedOption === "add"
                            ? "bg-[#0d2959] border border-[#0273e3] border-solid"
                            : "bg-transparent border border-[#42474c] border-solid hover:border-[#5a5f64]"
                        }`}
                      >
                        <div className="basis-0 flex flex-col grow h-full justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[15px] text-nowrap tracking-[0px] font-medium">
                          <p className={`leading-[1.4] overflow-ellipsis overflow-hidden text-[15px] ${
                            selectedOption === "add" ? "text-[#fefefe]" : "text-[#85909e]"
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

                </>
              )}

              {/* Add Athlete Mode */}
              {mode === "add" && (
                <>
                  {/* Header Text */}
                  <div className="flex flex-col gap-1 items-center leading-[0] relative shrink-0 text-center tracking-[0px] w-full font-medium">
                    <div className="flex flex-col justify-center relative shrink-0 text-[#fefefe] text-[24px] w-full">
                      <p className="leading-[1.2]">
                        {fromConnectedPage ? "Complete Athlete Information" : "Add Your Athletes"}
                      </p>
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
                            {(firstName?.trim() || lastName?.trim())
                              ? `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "CD"
                              : connectedAthlete?.name 
                                ? connectedAthlete.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
                                : "CD"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#c0c6cd] text-[16px]">
                          <p className="leading-[1.15]">
                            {(firstName?.trim() || lastName?.trim())
                              ? `${firstName || ""} ${lastName || ""}`.trim()
                              : connectedAthlete?.name || "John Doe"}
                          </p>
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
                            className="bg-white border border-[#42474c] min-h-[40px] rounded-[2px] text-[16px] placeholder:text-[#85909e] px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#0273e3] focus:ring-offset-0"
                            placeholder="First Name"
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
                            className="bg-white border border-[#42474c] min-h-[40px] rounded-[2px] text-[16px] placeholder:text-[#85909e] px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#0273e3] focus:ring-offset-0"
                            placeholder="Last Name"
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
                          <input
                            type="text"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="bg-white border border-[#42474c] min-h-[40px] rounded-[2px] text-[16px] placeholder:text-[#85909e] px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#0273e3] focus:ring-offset-0"
                            placeholder="MM/DD/YYYY"
                          />
                        </div>
                        <div className="basis-0 flex flex-col gap-1 grow items-start min-h-px min-w-px relative shrink-0">
                          <div className="flex gap-1 items-start leading-none relative shrink-0 text-[16px] text-nowrap w-full">
                            <p className="relative shrink-0 text-[#c0c6cd]">Gender</p>
                            <p className="relative shrink-0 text-[#ff563f]">*</p>
                          </div>
                          <Select value={gender} onValueChange={setGender}>
                            <SelectTrigger className="bg-white border border-[#42474c] min-h-[40px] rounded-[2px] text-[16px] [&>svg]:text-gray-600">
                              <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-[#42474c]">
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                              <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
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
                            <SelectTrigger className="bg-white border border-[#42474c] min-h-[40px] rounded-[2px] text-[16px] [&>svg]:text-gray-600">
                              <SelectValue placeholder="Select Grade" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-[#42474c]">
                              <SelectItem value="K">Kindergarten</SelectItem>
                              <SelectItem value="1st">1st</SelectItem>
                              <SelectItem value="2nd">2nd</SelectItem>
                              <SelectItem value="3rd">3rd</SelectItem>
                              <SelectItem value="4th">4th</SelectItem>
                              <SelectItem value="5th">5th</SelectItem>
                              <SelectItem value="6th">6th</SelectItem>
                              <SelectItem value="7th">7th</SelectItem>
                              <SelectItem value="8th">8th</SelectItem>
                              <SelectItem value="9th">9th</SelectItem>
                              <SelectItem value="10th">10th</SelectItem>
                              <SelectItem value="11th">11th</SelectItem>
                              <SelectItem value="12th">12th</SelectItem>
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
                            <SelectTrigger className="bg-white border border-[#42474c] min-h-[40px] rounded-[2px] text-[16px] [&>svg]:text-gray-600">
                              <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-[#42474c]">
                              {Array.from({ length: 15 }, (_, i) => 2025 + i).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
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
                      {version === "2" && !fromConnectedPage && (
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
                      {version !== "2" && !fromConnectedPage && (
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
                      <p className="leading-[1.2]">Send Code to Connect Athlete</p>
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
                        Send Code
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
                  <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
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
                            disabled={failedAttempts >= 10}
                          />
                        </div>
                      ))}
                    </div>
                    {failedAttempts >= 10 && (
                      <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#ff4444] text-[14px] w-full">
                        <p className="leading-[1.4]">You have reached your limit. Please resend code or contact support.</p>
                      </div>
                    )}
                  </div>

                  {/* Verify Button and Resend Text */}
                  <div className="flex flex-col gap-3 items-center relative shrink-0 w-full">
                    <div className="flex flex-col gap-0 items-start relative shrink-0 w-full">
                      <Button 
                        variant="default" 
                        size="lg" 
                        className="w-full"
                        onClick={handleVerify}
                        disabled={!isCodeComplete || isVerifying || failedAttempts >= 10}
                      >
                        <>
                          {isVerifying && <Loader2 className="size-4 animate-spin mr-2" />}
                          Connect Athlete
                        </>
                      </Button>
                    </div>
                    <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#c0c6cd] text-[14px] text-center tracking-[0px] w-full font-medium mt-4">
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
                  <div className="flex flex-col gap-6 items-center leading-[0] relative shrink-0 text-center tracking-[0px] w-full max-w-[400px] font-medium">
                    <div className="flex flex-col gap-1 items-center leading-[0] relative shrink-0 text-center tracking-[0px] w-full font-medium">
                      <div className="flex flex-col justify-center relative shrink-0 text-[#fefefe] text-[24px] w-full">
                        <p className="leading-[1.2]">Athlete Connected</p>
                      </div>
                      <div className="flex flex-col justify-center relative shrink-0 text-[#c0c6cd] text-[16px] w-full">
                        <p className="leading-[1.4]">
                          You are now connected with your athlete. Finish filling out their information to register.
                        </p>
                      </div>
                    </div>
                    {connectedAthlete && connectedAthlete.name && (
                      <div className="bg-[#21262b] flex flex-col gap-3 items-center pl-2 pr-4 py-3 relative rounded-[17px] shrink-0 w-full">
                        <div className="flex gap-2 items-center relative shrink-0 w-full">
                          <Avatar className="size-[40px] shrink-0">
                            <AvatarImage src="/placeholder-user.jpg" alt={connectedAthlete.name} />
                            <AvatarFallback className="bg-[#38434f] text-white text-[14px] font-bold">
                              {connectedAthlete.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="basis-0 flex flex-col gap-1 grow items-start justify-start min-h-px min-w-px relative shrink-0">
                            <div className="flex flex-col justify-center leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#fefefe] text-[16px] tracking-[0px] font-bold text-left w-full">
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
                        </div>
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
                        onClick={() => {
                          // Store athlete name for pre-populating the form
                          if (typeof window !== "undefined" && connectedAthlete) {
                            localStorage.setItem("addAthleteName", connectedAthlete.name)
                            // Split name into first and last name
                            const nameParts = connectedAthlete.name.trim().split(" ")
                            const firstName = nameParts[0] || ""
                            const lastName = nameParts.slice(1).join(" ") || ""
                            localStorage.setItem("addAthleteFirstName", firstName)
                            localStorage.setItem("addAthleteLastName", lastName)
                            // Set flag to indicate coming from connected page
                            localStorage.setItem("fromConnectedPage", "true")
                            setFromConnectedPage(true)
                          }
                          setMode("add")
                          // Clear the code and verification state
                          setCode(["", "", "", "", "", ""])
                          setIsConnected(false)
                          setConnectStep("send-link")
                        }}
                      >
                        Complete Athlete Profile
                        <ArrowRight className="size-4 ml-2" />
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
      
      {/* Bottom Navigation Bar with Back Button */}
      {canGoBack() && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#191f24] border-t border-[#42474c] flex items-center justify-start px-4 py-3 z-50">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleBack()
            }}
            className="bg-[#2a2f35] text-[#c0c6cd] hover:bg-[#343a40] hover:text-[#fefefe] border-0 cursor-pointer"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
        </div>
      )}

      {/* Cancel Connection Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-[#191f24] border border-[#42474c]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#fefefe]">Cancel Connection Request?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#c0c6cd]">
              Are you sure you want to cancel this connection request? The athlete will no longer receive verification codes for this connection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                setShowCancelDialog(false)
                setAthleteToCancel(null)
              }}
              className="bg-transparent border border-[#42474c] text-[#c0c6cd] hover:bg-[#0f1215] hover:text-[#fefefe]"
            >
              Keep Request
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="bg-[#0273e3] text-white hover:bg-[#0260c7]"
            >
              Cancel Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
