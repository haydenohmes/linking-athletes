"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle2, Info, MoreVertical, ChevronDown, AlertTriangle, Clock, ArrowRight } from "lucide-react"
import { SendLinkDialog } from "@/components/send-link-dialog"
import { ConnectionRequestSentDialog } from "@/components/connection-request-sent-dialog"

// Image assets from Figma
const imgAvatar = "http://localhost:3845/assets/b1dd324c3cd060008f44c7b2b245f33f1c8fe7a2.png"
const imgAvatar1 = "http://localhost:3845/assets/e2f259dc8f3893c87eea411043772e51eb08d525.svg"
const imgAvatar2 = "http://localhost:3845/assets/acd44c4e069efc9ffdb1db90021476a29529105d.png"
const imgAvatar3 = "http://localhost:3845/assets/148adbaa2669708321cc997f87569327136e1ff5.svg"
const imgAvatar4 = "http://localhost:3845/assets/f3df9eb6112652781f01e232bf176a0925be4ac1.svg"
const imgExpand = "http://localhost:3845/assets/d2d39ba40a6b1f806eb750ce6be0f994da6c8beb.svg"

type ProfileBannerProps = {
  className?: string
  breakpoint?: "xl" | "l" | "m" | "s"
}

function ProfileBanner({ className, breakpoint = "xl" }: ProfileBannerProps) {
  const element = (
    <p 
      className="bg-clip-text bg-gradient-to-b font-light leading-[0.8] relative shrink-0 text-[72px] text-nowrap uppercase tracking-[5.76px]"
      style={{ 
        WebkitTextFillColor: "transparent",
        backgroundImage: "linear-gradient(to bottom, #e6f2ff 40.104%, #c3cedb 80.208%)",
        textShadow: "2px 2px 0px black",
        fontFamily: "Barlow, sans-serif"
      }}
    >
      Sporting Youth Soccer
    </p>
  )
  
  if (breakpoint === "l") {
    return (
      <div className={className}>
        <div className="flex flex-col gap-0 items-start relative shrink-0 w-full z-[1]">
          <div className="flex gap-4 items-center justify-center relative shrink-0 w-full">
            <div className="relative shrink-0 size-[64px]">
              <div className="absolute inset-0 rounded-full border-2 border-[#ffd700] bg-[#0d2959] flex items-center justify-center">
                <span className="text-white text-[16px] font-bold uppercase">HTFS</span>
              </div>
            </div>
            {element}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className={className}>
      <div className="flex flex-col gap-0 items-start relative shrink-0 w-full z-[1]">
        <div className="flex gap-4 items-center justify-center relative shrink-0 w-full">
          <div className="relative shrink-0 size-[64px]">
            <div className="absolute inset-0 rounded-full border-2 border-[#ffd700] bg-[#0d2959] flex items-center justify-center">
              <span className="text-white text-[16px] font-bold uppercase">HTFS</span>
            </div>
          </div>
          {element}
        </div>
      </div>
    </div>
  )
}

type DesktopNavbarProps = {
  className?: string
  isAuth?: boolean
}

function DesktopNavbar({ className, isAuth = false }: DesktopNavbarProps) {
  if (isAuth) {
    return (
      <div className={className}>
        <div className="bg-[#101417] flex h-[48px] items-center justify-end pl-4 pr-4 py-0 relative shrink-0 w-full">
          <div className="flex gap-0 h-full items-center relative shrink-0">
            <div className="flex h-[48px] items-start relative shrink-0">
              <div className="flex h-full items-center px-[10px] py-0 relative shrink-0">
                <Avatar className="size-[28px]">
                  <AvatarFallback className="bg-[#38434f] text-white text-[12px] font-bold">
                    JD
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col h-full items-center justify-center pl-0 pr-4 py-0 relative shrink-0">
                <div className="flex items-center relative shrink-0">
                  <div className="flex flex-col h-[20px] justify-end leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#e6f2ff] text-[14px] text-nowrap">
                    <p className="leading-[1.5] overflow-ellipsis overflow-hidden">John Doe</p>
                  </div>
                  <div className="flex items-center justify-center relative shrink-0 ml-2">
                    <div className="flex-none rotate-[180deg]">
                      <div className="overflow-clip relative size-[16px]">
                        <div className="absolute inset-[26.44%_11.52%]">
                          <div className="absolute inset-0">
                            <img alt="" className="block max-w-none size-full" src={imgExpand} />
                          </div>
                        </div>
                      </div>
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
  
  return (
    <div className={className}>
      <div className="bg-[#101417] flex h-[48px] items-center justify-between px-4 py-0 relative shrink-0 w-full">
        <div className="flex gap-2 items-center relative shrink-0">
          <Button variant="default" size="sm">
            Create Account
          </Button>
          <Button variant="secondary" size="sm">
            Log In
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ProgramPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const version = searchParams.get("version") || "1"
  const displayMode = searchParams.get("display") || "cards"
  const showConnectionRequests = searchParams.get("connectionRequests") === "true"
  const [showSendLinkDialog, setShowSendLinkDialog] = React.useState(false)
  const [showConnectionSentDialog, setShowConnectionSentDialog] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [connectionAttempts, setConnectionAttempts] = React.useState<Array<{id: string, email: string, name: string, status: string, requestedDate: string}>>([])
  const [completedAthletes, setCompletedAthletes] = React.useState<Array<{id: string, name: string, firstName: string, lastName: string}>>([])
  const [newlyConnectedAthlete, setNewlyConnectedAthlete] = React.useState<{name: string, email: string, isNew: boolean} | null>(null)

  // Load completed athletes from localStorage
  const loadCompletedAthletes = React.useCallback(() => {
    if (typeof window !== "undefined") {
      // Always load athletes first
      const stored = localStorage.getItem("completedAthletes")
      if (stored) {
        try {
          const athletes = JSON.parse(stored)
          // Filter out Hayden Ohmes
          const filteredAthletes = athletes.filter((athlete: any) => {
            const name = athlete.name?.toLowerCase() || ""
            const firstName = athlete.firstName?.toLowerCase() || ""
            const lastName = athlete.lastName?.toLowerCase() || ""
            return !(name.includes("hayden") && name.includes("ohmes")) &&
                   !(firstName === "hayden" && lastName === "ohmes")
          })
          setCompletedAthletes(filteredAthletes)
        } catch (e) {
          console.error("Failed to load completed athletes", e)
          setCompletedAthletes([])
        }
      } else {
        setCompletedAthletes([])
      }
      
      // Load newly connected athlete
      const newlyConnected = localStorage.getItem("newlyConnectedAthlete")
      if (newlyConnected) {
        try {
          const athlete = JSON.parse(newlyConnected)
          setNewlyConnectedAthlete(athlete)
          // Clear it after reading so it only shows once
          localStorage.removeItem("newlyConnectedAthlete")
        } catch (e) {
          setNewlyConnectedAthlete(null)
        }
      } else {
        setNewlyConnectedAthlete(null)
      }
    }
  }, [])

  // Load athletes on mount and handle refresh detection
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if athlete was just added (from add flow) - check this FIRST before any other logic
      const athleteJustAdded = localStorage.getItem("athleteJustAdded") === "true"
      const storedAthletes = localStorage.getItem("completedAthletes")
      
      console.log("Program page loaded - athleteJustAdded:", athleteJustAdded)
      console.log("Stored athletes:", storedAthletes)
      
      // If athlete was just added, always load and keep athletes (don't clear)
      if (athleteJustAdded) {
        console.log("Athlete just added - loading and keeping athletes")
        loadCompletedAthletes()
        // Clear the flag after loading
        localStorage.removeItem("athleteJustAdded")
        return // Exit early - don't check for refresh
      }
      
      // Check if this is a page refresh (not client-side navigation)
      let isRefresh = false
      try {
        const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navTiming) {
          // 'reload' means user pressed F5 or refresh button
          // 'navigate' means client-side navigation (router.push)
          isRefresh = navTiming.type === 'reload'
          console.log("Navigation type:", navTiming.type, "isRefresh:", isRefresh)
        } else if ((performance as any).navigation) {
          // Fallback for older browsers
          // type 1 = TYPE_RELOAD
          isRefresh = (performance as any).navigation.type === 1
          console.log("Navigation type (fallback):", (performance as any).navigation.type, "isRefresh:", isRefresh)
        }
      } catch (e) {
        // If we can't detect, assume it's navigation (safer - preserves athletes)
        isRefresh = false
        console.log("Could not detect navigation type, assuming navigation")
      }
      
      if (isRefresh) {
        console.log("Clearing athletes - refresh detected")
        // Clear athletes on refresh for clean starting point
        localStorage.removeItem("completedAthletes")
        localStorage.removeItem("newlyConnectedAthlete")
        setCompletedAthletes([])
        setNewlyConnectedAthlete(null)
      } else {
        console.log("Loading athletes - navigation detected")
        // Load athletes when navigating (not refresh)
        loadCompletedAthletes()
      }
    }
  }, [loadCompletedAthletes])
  
  // Reload athletes when page becomes visible (e.g., when navigating back from add athlete flow)
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Check if athlete was just added
        const athleteJustAdded = localStorage.getItem("athleteJustAdded") === "true"
        if (athleteJustAdded) {
          console.log("Page visible - athlete just added, reloading athletes")
          loadCompletedAthletes()
          localStorage.removeItem("athleteJustAdded")
        } else {
          loadCompletedAthletes()
        }
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [loadCompletedAthletes])
  
  // Also reload athletes when searchParams change (navigation with query params)
  React.useEffect(() => {
    // Small delay to ensure localStorage is updated
    const timer = setTimeout(() => {
      const athleteJustAdded = localStorage.getItem("athleteJustAdded") === "true"
      if (athleteJustAdded) {
        console.log("Search params changed - athlete just added, reloading athletes")
        loadCompletedAthletes()
        localStorage.removeItem("athleteJustAdded")
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [searchParams, loadCompletedAthletes])

  React.useEffect(() => {
    loadCompletedAthletes()
  }, [loadCompletedAthletes])

  // Note: We removed the visibility change handler since we want to clear athletes only on refresh
  // This ensures a clean starting point for testing when refreshing the program page

  // Load connection attempts from localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Clear connection attempts (for testing - remove athletes you just sent codes to)
      localStorage.removeItem("connectionAttempts")
      
      let attempts: Array<{id: string, email: string, name: string, status: string, requestedDate: string}> = []
      
      // Add default connection requests for connectionRequests version
      if (showConnectionRequests) {
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
        
        setConnectionAttempts(defaultAthletes)
      } else {
        setConnectionAttempts(attempts)
      }
    }
  }, [showConnectionRequests])

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
    const params = new URLSearchParams()
    if (version !== "1") params.set("version", version)
    if (displayMode === "avatars") params.set("display", "avatars")
    if (showConnectionRequests) params.set("connectionRequests", "true")
    params.set("from", "program")
    params.set("mode", "connect")
    const queryString = params.toString() ? `?${params.toString()}` : ""
    // Store email for pre-filling
    if (typeof window !== "undefined") {
      localStorage.setItem("connectEmail", attemptEmail)
    }
    router.push(`/add-or-connect-athlete${queryString}`)
  }

  const handleSendLink = () => {
    setShowSendLinkDialog(false)
    setShowConnectionSentDialog(true)
  }

  const handleConnectionSentContinue = () => {
    setShowConnectionSentDialog(false)
    setEmail("")
  }

  return (
    <div className="bg-[#191f24] flex flex-col gap-0 isolate items-start overflow-clip relative rounded-[12px] size-full min-h-screen">
      <DesktopNavbar className="bg-white flex flex-col h-[48px] items-start shrink-0 sticky top-0 w-full z-[2]" isAuth={true} />
      <div className="flex flex-col isolate items-start overflow-x-clip overflow-y-auto relative shrink-0 w-full z-[1]">
        <div className="flex flex-col items-center relative shrink-0 w-full z-[1]">
          <ProfileBanner 
            breakpoint="l" 
            className="bg-gradient-to-b flex flex-col from-[rgba(11,33,57,0.9)] gap-0 isolate items-start max-w-[1919px] min-w-[1366px] overflow-clip px-6 py-[40px] relative shrink-0 w-[1512px] to-[rgba(0,0,0,0)]" 
          />
          
          {/* Login Banner - Only show when connectionRequests is NOT true AND there are no completed athletes */}
          {!showConnectionRequests && completedAthletes.length === 0 && (
            <div className="bg-[#282c34] flex flex-col gap-4 items-center justify-center px-6 py-8 relative shrink-0 w-full max-w-[1128px] rounded-[4px] mt-4 mb-8">
              <div className="flex flex-col gap-2 items-center text-center relative shrink-0 w-full">
                <h2 className="text-white text-[20px] font-bold leading-[1.2]">
                  Add or connect athletes to complete registration.
                </h2>
                <p className="text-[#a0a2a6] text-[16px] leading-[1.4]">
                  We'll use their details to show the registrations they're eligible for.
                </p>
              </div>
              <div className="flex flex-col gap-6 items-center relative shrink-0 w-full">
                <Button 
                  variant="default" 
                  size="default" 
                  onClick={() => {
                    const params = new URLSearchParams()
                    if (version !== "1") params.set("version", version)
                    if (displayMode === "avatars") params.set("display", "avatars")
                    if (showConnectionRequests) params.set("connectionRequests", "true")
                    params.set("from", "program")
                    const queryString = params.toString() ? `?${params.toString()}` : ""
                    router.push(`/add-or-connect-athlete${queryString}`)
                  }}
                  className="w-auto px-6 py-2 bg-[#3370f4] hover:bg-[#2a5dd9] text-white font-bold mt-4"
                >
                  Add or Connect Athletes
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-6 items-start max-w-[1128px] pb-6 pt-0 px-0 relative shrink-0 w-full">
            {/* Connection Requests Section - Only show when connectionRequests=true */}
            {showConnectionRequests && (() => {
              // Ensure connectionAttempts is an array
              const attempts = Array.isArray(connectionAttempts) ? connectionAttempts : []
              
              // Get the connection request card
              const johnCard = attempts.find(a => a && a.email && a.email.toLowerCase() === "john.doe@hudl.com") || {
                id: "john-doe",
                email: "john.doe@hudl.com",
                name: "John Doe",
                status: "pending",
                requestedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              }
              
              const firstRequest = johnCard
              const firstEmail = firstRequest?.email || "john.doe@hudl.com"
              const firstStatusBadge = getStatusBadge(firstRequest?.status || "pending", firstEmail)

              return (
                <div className="flex flex-col gap-2 items-start relative shrink-0 w-full mb-6">
                  <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#c0c6cd] text-[16px] font-medium w-full mb-2">
                    <p className="leading-[1.15]">Connection Requests</p>
                  </div>
                  
                  {/* First Card - Always show */}
                  <div className="bg-[#21262b] border border-[#ff8c00] flex flex-col gap-3 items-start px-4 py-3 relative rounded-[4px] shrink-0 w-full">
                    <div className="flex gap-3 items-center relative shrink-0 w-full">
                      <div className="basis-0 flex flex-col gap-1 grow items-start min-h-px min-w-px relative shrink-0">
                        <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#fefefe] text-[16px] w-full">
                          <p className="leading-[1.4]">{firstEmail}</p>
                        </div>
                      </div>
                      <div className="ml-auto flex gap-2 items-center justify-end relative shrink-0">
                        <button
                          onClick={() => {
                            const params = new URLSearchParams()
                            if (version !== "1") params.set("version", version)
                            if (displayMode === "avatars") params.set("display", "avatars")
                            if (showConnectionRequests) params.set("connectionRequests", "true")
                            params.set("from", "program")
                            params.set("mode", "connect")
                            if (typeof window !== "undefined") {
                              // Clear connectEmail and set step to send-link to go to email step
                              localStorage.removeItem("connectEmail")
                              localStorage.setItem("addOrConnectStep", "send-link")
                            }
                            const queryString = params.toString() ? `?${params.toString()}` : ""
                            router.push(`/add-or-connect-athlete${queryString}`)
                          }}
                          className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded bg-[#2a2f35] hover:bg-[#34363A] text-white font-medium transition-colors text-[14px]"
                        >
                          Resend Code
                        </button>
                        <button
                          onClick={() => {
                            const params = new URLSearchParams()
                            if (version !== "1") params.set("version", version)
                            if (displayMode === "avatars") params.set("display", "avatars")
                            if (showConnectionRequests) params.set("connectionRequests", "true")
                            params.set("from", "program")
                            params.set("mode", "connect")
                            if (typeof window !== "undefined") {
                              // Set connectEmail and step to verification to go directly to code screen
                              localStorage.setItem("connectEmail", firstEmail)
                              localStorage.setItem("addOrConnectStep", "verification")
                            }
                            const queryString = params.toString() ? `?${params.toString()}` : ""
                            router.push(`/add-or-connect-athlete${queryString}`)
                          }}
                          className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded bg-[#34363A] hover:bg-[#3a3d41] text-white font-medium transition-colors text-[14px]"
                        >
                          <div className="flex flex-col justify-center leading-[0] relative shrink-0">
                            <p className="leading-[1.4]">Enter Code</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
            
            <div className="flex flex-col gap-4 items-start max-w-[1365px] min-w-[768px] relative shrink-0 w-full">
              <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
                <div className="flex flex-col justify-end leading-[0] relative shrink-0 text-[#c0c6cd] text-[32px] tracking-[0.25px] w-full">
                  <p className="leading-[1.2] font-bold" style={{ fontFamily: "var(--u-font-body)" }}>
                    {`Sporting Stripes & Stars Summer Camp | Summer 2025`}
                  </p>
                </div>
                <div className="flex gap-2 items-start relative shrink-0 w-full">
                  <p className="font-medium leading-[1.4] relative shrink-0 text-[#c0c6cd] text-[16px] text-nowrap tracking-[0px]">
                    Camp
                  </p>
                  <p className="font-medium leading-[1.4] relative shrink-0 text-[#c0c6cd] text-[16px] text-nowrap tracking-[0px]">
                    ·
                  </p>
                  <div className="flex gap-1 items-center leading-[1.4] relative shrink-0 text-[#c0c6cd] text-[16px] text-nowrap tracking-[0px]">
                    <p className="relative shrink-0">
                      Sep 24, 2025
                    </p>
                    <p className="relative shrink-0">
                      -
                    </p>
                    <p className="relative shrink-0">
                      Nov 1, 2025
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-[2px] items-start leading-[1.4] relative shrink-0 w-full">
                <p className="font-medium min-w-full overflow-ellipsis overflow-hidden relative shrink-0 text-[16px] text-[#c0c6cd] tracking-[0px] w-[min-content]">
                  {`Kick off your summer with Sporting's Stripes & Stars Camp — a high-energy, multi-day experience built for young athletes who want to sharpen their skills, stay active, and have fun. Our camp offers age-based training sessions focused on fundamentals, team play, and confidence-building, all led by experienced coaches in a supportive environment. Each day includes a mix of drills, small-sided games, and team challenges to keep athletes engaged and growing. Whether your athlete is just getting started or preparing for competitive play, Stripes & Stars is a gr...`}
                </p>
                <p className="font-bold not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#36485c] text-[14px] text-nowrap">
                  read more
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 items-start justify-end relative shrink-0 w-full">
              <div className="flex flex-col items-start relative shrink-0 w-full">
                <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[10px] text-[#c0c6cd] text-nowrap uppercase font-bold">
                  <p className="leading-[1.2]">My Athletes</p>
                </div>
              </div>
              <div className="flex gap-4 items-center px-0 py-0 relative shrink-0 w-full">
                <div className="flex gap-1 items-center relative shrink-0">
                  <div className="flex gap-[2px] items-center relative shrink-0">
                    {/* Show completed athletes */}
                    {completedAthletes.map((athlete) => (
                      <Avatar key={athlete.id} className="size-[32px]">
                        <AvatarFallback className="bg-[#38434f] text-white text-[12px] font-bold border border-[#fefefe]">
                          {athlete.firstName && athlete.lastName
                            ? `${athlete.firstName[0]}${athlete.lastName[0]}`.toUpperCase()
                            : athlete.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {/* Show JD avatar for connection request version */}
                    {showConnectionRequests && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              const params = new URLSearchParams()
                              if (version !== "1") params.set("version", version)
                              if (displayMode === "avatars") params.set("display", "avatars")
                              if (showConnectionRequests) params.set("connectionRequests", "true")
                              params.set("from", "program")
                              params.set("mode", "connect")
                              if (typeof window !== "undefined") {
                                localStorage.setItem("connectEmail", "john.doe@hudl.com")
                              }
                              const queryString = params.toString() ? `?${params.toString()}` : ""
                              router.push(`/add-or-connect-athlete${queryString}`)
                            }}
                            className="cursor-pointer opacity-60"
                          >
                            <Avatar className="size-[32px]">
                              <AvatarFallback className="bg-[#38434f] text-[#85909e] text-[12px] font-bold border border-[#ff8c00]">
                                JD
                              </AvatarFallback>
                            </Avatar>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Pending request</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {/* Show newly connected athlete if exists */}
                    {newlyConnectedAthlete && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => {
                              // Store athlete name for pre-populating the form
                              if (typeof window !== "undefined" && newlyConnectedAthlete) {
                                localStorage.setItem("addAthleteName", newlyConnectedAthlete.name)
                              }
                              const params = new URLSearchParams()
                              if (version !== "1") params.set("version", version)
                              if (displayMode === "avatars") params.set("display", "avatars")
                              if (showConnectionRequests) params.set("connectionRequests", "true")
                              params.set("from", "program")
                              params.set("mode", "add")
                              const queryString = params.toString() ? `?${params.toString()}` : ""
                              router.push(`/add-or-connect-athlete${queryString}`)
                            }}
                            className="cursor-pointer"
                          >
                            <Avatar className="size-[32px]">
                              <AvatarFallback className="bg-[#38434f] text-[#85909e] text-[12px] font-bold border border-[#85909e]">
                                {newlyConnectedAthlete.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Information incomplete</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      const params = new URLSearchParams()
                      if (version !== "1") params.set("version", version)
                      if (displayMode === "avatars") params.set("display", "avatars")
                      if (showConnectionRequests) params.set("connectionRequests", "true")
                      params.set("from", "program")
                      // Ensure user is authenticated when coming from program page
                      // Store flag so back button knows to return to program page
                      if (typeof window !== "undefined") {
                        localStorage.setItem("isAuthenticated", "true")
                        localStorage.setItem("fromProgram", "true")
                      }
                      const queryString = params.toString() ? `?${params.toString()}` : ""
                      router.push(`/add-or-connect-athlete${queryString}`)
                    }}
                    className="cursor-pointer"
                  >
                    <Avatar className="size-[32px] hover:opacity-80 transition-opacity">
                      <AvatarFallback className="bg-[#38434f] text-white text-[12px] font-bold border border-[#fefefe]">
                        +
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-0 items-start relative shrink-0 w-full">
              <div className="flex flex-col gap-3 items-start relative shrink-0 w-full">
                <div className="flex items-center pb-1 pt-0 px-0 relative shrink-0 w-full">
                  <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[#c0c6cd] text-[18px] text-nowrap tracking-[0px] font-bold">
                    <p className="leading-[1.4]">Registrations</p>
                  </div>
                </div>
                <div className="bg-[#0f1215] flex flex-col gap-5 items-start max-w-[1365px] min-w-[768px] pb-5 pt-4 px-4 relative rounded-[8px] shrink-0 w-full">
                  <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
                    <div className="flex items-center justify-between relative shrink-0 w-full">
                      <div className="flex flex-col justify-end leading-[0] relative shrink-0 text-[#96ccf3] text-[18px] text-nowrap tracking-[0px] font-medium">
                        <p className="leading-[1.4]">$410</p>
                      </div>
                      <Button variant="ghost" size="icon-sm">
                        <MoreVertical className="size-4" />
                      </Button>
                    </div>
                    <div className="flex gap-4 items-end relative shrink-0 w-full">
                      <div className="basis-0 flex flex-col gap-0 grow items-start min-h-px min-w-px relative shrink-0">
                        <div className="flex flex-col gap-[2px] items-start pb-2 pt-0 px-0 relative shrink-0 w-full">
                          <div className="flex-col justify-end leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#c0c6cd] text-[18px] tracking-[0px] w-full font-bold">
                            <p className="leading-[1.4] text-[18px]">{`Boys & Girls Stripes | Ages: 14-15`}</p>
                          </div>
                          <div className="flex gap-1 h-[20px] items-center leading-[1.4] relative shrink-0 text-[#c0c6cd] text-nowrap tracking-[0px] w-full font-medium">
                            <p className="relative shrink-0 text-[14px]">
                              Sep 24, 2025
                            </p>
                            <p className="overflow-ellipsis overflow-hidden relative shrink-0 text-[14px]">
                              -
                            </p>
                            <p className="basis-0 grow min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[14px]">
                              Sep 28, 2025
                            </p>
                          </div>
                        </div>
                        {completedAthletes.length > 0 && (
                          <div className="flex gap-1 items-center relative shrink-0 w-full">
                            <p className="font-medium leading-[1.4] relative shrink-0 text-[#c0c6cd] text-[14px] text-nowrap tracking-[0px]">
                              Eligible athlete:
                            </p>
                            <div className="flex gap-2 items-center relative shrink-0 flex-wrap">
                              {completedAthletes.map((athlete) => (
                                <div key={athlete.id} className="flex gap-[2px] items-center relative shrink-0">
                                  <CheckCircle2 className="size-4 text-[#548309]" />
                                  <p className="font-medium leading-[1.4] relative shrink-0 text-[#c0c6cd] text-[14px] text-nowrap tracking-[0px]">
                                    {athlete.name}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 items-center justify-end relative shrink-0">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-[#3370f4] hover:bg-[#2a5dd9] text-white"
                          onClick={() => {
                            const params = new URLSearchParams()
                            if (version !== "1") params.set("version", version)
                            if (displayMode === "avatars") params.set("display", "avatars")
                            if (showConnectionRequests) params.set("connectionRequests", "true")
                            params.set("from", "program")
                            // Ensure user is authenticated when coming from program page
                            // Store flag so back button knows to return to program page
                            if (typeof window !== "undefined") {
                              localStorage.setItem("isAuthenticated", "true")
                              localStorage.setItem("fromProgram", "true")
                            }
                            const queryString = params.toString() ? `?${params.toString()}` : ""
                            router.push(`/add-or-connect-athlete${queryString}`)
                          }}
                        >
                          Register
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0 items-start justify-center relative shrink-0 w-full mt-1">
                      <button
                        onClick={() => {
                          const params = new URLSearchParams()
                          if (version !== "1") params.set("version", version)
                          if (displayMode === "avatars") params.set("display", "avatars")
                          if (showConnectionRequests) params.set("connectionRequests", "true")
                          params.set("from", "program")
                          const queryString = params.toString() ? `?${params.toString()}` : ""
                          router.push(`/add-or-connect-athlete${queryString}`)
                        }}
                        className="text-underline decoration-solid font-medium leading-[1.4] not-italic relative shrink-0 text-[#0a93f5] text-[14px] underline w-full text-left"
                      >
                        Add or Connect Athlete
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0f1215] flex flex-col gap-5 items-start max-w-[1365px] min-w-[768px] pb-5 pt-4 px-4 relative rounded-[8px] shrink-0 w-full">
                  <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
                    <div className="flex items-center justify-between relative shrink-0 w-full">
                      <div className="flex flex-col justify-end leading-[0] relative shrink-0 text-[#96ccf3] text-[18px] text-nowrap tracking-[0px] font-medium">
                        <p className="leading-[1.4]">$410</p>
                      </div>
                      <Button variant="ghost" size="icon-sm">
                        <MoreVertical className="size-4" />
                      </Button>
                    </div>
                    <div className="flex gap-4 items-end relative shrink-0 w-full">
                      <div className="basis-0 flex flex-col gap-0 grow items-start min-h-px min-w-px relative shrink-0">
                        <div className="flex flex-col gap-[2px] items-start pb-2 pt-0 px-0 relative shrink-0 w-full">
                          <div className="flex-col justify-end leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#c0c6cd] text-[18px] tracking-[0px] w-full font-bold">
                            <p className="leading-[1.4] text-[18px]">{`Boys & Girls Stripes | Ages: 15-16`}</p>
                          </div>
                          <div className="flex gap-1 h-[20px] items-center leading-[1.4] relative shrink-0 text-[#c0c6cd] text-nowrap tracking-[0px] w-full font-medium">
                            <p className="relative shrink-0 text-[14px]">
                              Sep 24, 2025
                            </p>
                            <p className="overflow-ellipsis overflow-hidden relative shrink-0 text-[14px]">
                              -
                            </p>
                            <p className="basis-0 grow min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[14px]">
                              Sep 28, 2025
                            </p>
                          </div>
                        </div>
                        {completedAthletes.length > 0 && (
                          <div className="flex gap-1 items-center relative shrink-0 w-full">
                            <p className="font-medium leading-[1.4] relative shrink-0 text-[#c0c6cd] text-[14px] text-nowrap tracking-[0px]">
                              Eligible athlete:
                            </p>
                            <div className="flex gap-2 items-center relative shrink-0 flex-wrap">
                              {completedAthletes.map((athlete) => (
                                <div key={athlete.id} className="flex gap-[2px] items-center relative shrink-0">
                                  <CheckCircle2 className="size-4 text-[#548309]" />
                                  <p className="font-medium leading-[1.4] relative shrink-0 text-[#c0c6cd] text-[14px] text-nowrap tracking-[0px]">
                                    {athlete.name}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 items-center justify-end relative shrink-0">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-[#3370f4] hover:bg-[#2a5dd9] text-white"
                          onClick={() => {
                            const params = new URLSearchParams()
                            if (version !== "1") params.set("version", version)
                            if (displayMode === "avatars") params.set("display", "avatars")
                            if (showConnectionRequests) params.set("connectionRequests", "true")
                            params.set("from", "program")
                            // Ensure user is authenticated when coming from program page
                            // Store flag so back button knows to return to program page
                            if (typeof window !== "undefined") {
                              localStorage.setItem("isAuthenticated", "true")
                              localStorage.setItem("fromProgram", "true")
                            }
                            const queryString = params.toString() ? `?${params.toString()}` : ""
                            router.push(`/add-or-connect-athlete${queryString}`)
                          }}
                        >
                          Register
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0 items-start justify-center relative shrink-0 w-full mt-1">
                      <button
                        onClick={() => {
                          const params = new URLSearchParams()
                          if (version !== "1") params.set("version", version)
                          if (displayMode === "avatars") params.set("display", "avatars")
                          if (showConnectionRequests) params.set("connectionRequests", "true")
                          params.set("from", "program")
                          const queryString = params.toString() ? `?${params.toString()}` : ""
                          router.push(`/add-or-connect-athlete${queryString}`)
                        }}
                        className="text-underline decoration-solid font-medium leading-[1.4] not-italic relative shrink-0 text-[#0a93f5] text-[14px] underline w-full text-left"
                      >
                        Add or Connect Athlete
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0f1215] flex flex-col gap-5 items-start max-w-[1365px] min-w-[768px] pb-5 pt-4 px-4 relative rounded-[8px] shrink-0 w-full">
                  <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
                    <div className="flex items-center justify-between relative shrink-0 w-full">
                      <div className="flex flex-col justify-end leading-[0] relative shrink-0 text-[#96ccf3] text-[18px] text-nowrap tracking-[0px] font-medium">
                        <p className="leading-[1.4]">$410</p>
                      </div>
                      <Button variant="ghost" size="icon-sm">
                        <MoreVertical className="size-4" />
                      </Button>
                    </div>
                    <div className="flex gap-4 items-end relative shrink-0 w-full">
                      <div className="basis-0 flex flex-col gap-0 grow items-start min-h-px min-w-px relative shrink-0">
                        <div className="flex flex-col gap-[2px] items-start pb-2 pt-0 px-0 relative shrink-0 w-full">
                          <div className="flex-col justify-end leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#c0c6cd] text-[18px] tracking-[0px] w-full font-bold">
                            <p className="leading-[1.4] text-[18px]">{`Boys & Girls Stripes | Ages: 17-18`}</p>
                          </div>
                          <div className="flex gap-1 h-[20px] items-center leading-[1.4] relative shrink-0 text-[#c0c6cd] text-nowrap tracking-[0px] w-full font-medium">
                            <p className="relative shrink-0 text-[14px]">
                              Sep 24, 2025
                            </p>
                            <p className="overflow-ellipsis overflow-hidden relative shrink-0 text-[14px]">
                              -
                            </p>
                            <p className="basis-0 grow min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[14px]">
                              Sep 28, 2025
                            </p>
                          </div>
                        </div>
                        {completedAthletes.length > 0 && (
                          <div className="flex gap-1 items-center relative shrink-0 w-full">
                            <p className="font-medium leading-[1.4] relative shrink-0 text-[#c0c6cd] text-[14px] text-nowrap tracking-[0px]">
                              Eligible athlete:
                            </p>
                            <div className="flex gap-2 items-center relative shrink-0 flex-wrap">
                              {completedAthletes.map((athlete) => (
                                <div key={athlete.id} className="flex gap-[2px] items-center relative shrink-0">
                                  <CheckCircle2 className="size-4 text-[#548309]" />
                                  <p className="font-medium leading-[1.4] relative shrink-0 text-[#c0c6cd] text-[14px] text-nowrap tracking-[0px]">
                                    {athlete.name}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 items-center justify-end relative shrink-0">
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="bg-[#3370f4] hover:bg-[#2a5dd9] text-white"
                          onClick={() => {
                            const params = new URLSearchParams()
                            if (version !== "1") params.set("version", version)
                            if (displayMode === "avatars") params.set("display", "avatars")
                            if (showConnectionRequests) params.set("connectionRequests", "true")
                            params.set("from", "program")
                            // Ensure user is authenticated when coming from program page
                            // Store flag so back button knows to return to program page
                            if (typeof window !== "undefined") {
                              localStorage.setItem("isAuthenticated", "true")
                              localStorage.setItem("fromProgram", "true")
                            }
                            const queryString = params.toString() ? `?${params.toString()}` : ""
                            router.push(`/add-or-connect-athlete${queryString}`)
                          }}
                        >
                          Register
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0 items-start justify-center relative shrink-0 w-full mt-1">
                      <button
                        onClick={() => {
                          const params = new URLSearchParams()
                          if (version !== "1") params.set("version", version)
                          if (displayMode === "avatars") params.set("display", "avatars")
                          if (showConnectionRequests) params.set("connectionRequests", "true")
                          params.set("from", "program")
                          const queryString = params.toString() ? `?${params.toString()}` : ""
                          router.push(`/add-or-connect-athlete${queryString}`)
                        }}
                        className="text-underline decoration-solid font-medium leading-[1.4] not-italic relative shrink-0 text-[#0a93f5] text-[14px] underline w-full text-left"
                      >
                        Add or Connect Athlete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <SendLinkDialog
        open={showSendLinkDialog}
        onOpenChange={setShowSendLinkDialog}
        email={email}
        onEmailChange={setEmail}
        onSend={handleSendLink}
      />
      
      <ConnectionRequestSentDialog
        open={showConnectionSentDialog}
        onOpenChange={setShowConnectionSentDialog}
        onContinue={handleConnectionSentContinue}
      />
    </div>
  )
}

