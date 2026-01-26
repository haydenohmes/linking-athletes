"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle2, Info, MoreVertical, ChevronDown, AlertTriangle } from "lucide-react"
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
          
          {/* Login Banner */}
          <div className="bg-[#282c34] flex flex-col gap-4 items-center justify-center px-6 py-8 relative shrink-0 w-full max-w-[1128px] rounded-[4px] mt-4 mb-8">
            <div className="flex flex-col gap-2 items-center text-center relative shrink-0 w-full">
              <h2 className="text-white text-[20px] font-bold leading-[1.2]">
                Add or connect athletes to get started.
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
          
          <div className="flex flex-col gap-6 items-start max-w-[1128px] pb-6 pt-0 px-0 relative shrink-0 w-full">
            <div className="flex flex-col gap-4 items-start max-w-[1365px] min-w-[768px] relative shrink-0 w-full">
              <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
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
                    <Avatar className="size-[32px]">
                      <AvatarFallback className="bg-[#38434f] text-white text-[12px] font-bold border border-[#fefefe]">
                        HO
                      </AvatarFallback>
                    </Avatar>
                    <Avatar className="size-[32px]">
                      <AvatarFallback className="bg-[#38434f] text-white text-[12px] font-bold border border-[#fefefe]">
                        WO
                      </AvatarFallback>
                    </Avatar>
                    <Avatar className="size-[32px]">
                      <AvatarFallback className="bg-[#38434f] text-white text-[12px] font-bold border border-[#fefefe]">
                        KO
                      </AvatarFallback>
                    </Avatar>
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
                <div className="bg-[#161b20] flex flex-col gap-5 items-start max-w-[1365px] min-w-[768px] pb-5 pt-4 px-4 relative rounded-[8px] shrink-0 w-full">
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
                            <p className="leading-[1.4] text-[18px]">{`Boys & Girls Stripes | Ages: 2-3 (Parent - Child)`}</p>
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
                        <div className="flex gap-1 items-center relative shrink-0 w-full">
                          <p className="font-medium leading-[1.4] relative shrink-0 text-[#c0c6cd] text-[14px] text-nowrap tracking-[0px]">
                            Eligible athlete:
                          </p>
                          <div className="flex gap-0 items-center relative shrink-0">
                            <div className="flex gap-[2px] items-center relative shrink-0">
                              <CheckCircle2 className="size-4 text-[#c0c6cd]" />
                              <p className="font-medium leading-[1.4] relative shrink-0 text-[#c0c6cd] text-[14px] text-nowrap tracking-[0px]">
                                Hayden Ohmes
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-0 items-center relative shrink-0">
                            <div className="flex gap-[2px] items-center relative shrink-0">
                              <CheckCircle2 className="size-4 text-[#c0c6cd]" />
                              <p className="font-medium leading-[1.4] relative shrink-0 text-[#c0c6cd] text-[14px] text-nowrap tracking-[0px]">
                                Weston Ohmes
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center justify-end relative shrink-0">
                        <Button variant="ghost" size="sm">
                          Register
                        </Button>
                      </div>
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
                    <div className="flex flex-col gap-[2px] items-start relative shrink-0 w-full">
                      <div className="flex gap-4 items-end relative shrink-0 w-full">
                        <div className="basis-0 flex flex-col gap-[2px] grow items-start min-h-px min-w-px relative shrink-0">
                          <div className="flex-col justify-end leading-[0] overflow-ellipsis overflow-hidden relative shrink-0 text-[#c0c6cd] text-[18px] tracking-[0px] w-full font-bold">
                            <p className="leading-[1.4] text-[18px]">{`Boys & Girls Stripes | Ages: 2-3 (Parent - Child)`}</p>
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
                        <div className="flex items-center justify-end relative shrink-0">
                          <div className="flex gap-4 items-center justify-end relative shrink-0">
                            <div className="flex gap-2 items-start relative shrink-0">
                              <div className="flex items-center justify-center relative self-stretch shrink-0">
                                <Info className="size-4 text-[#c0c6cd]" />
                              </div>
                              <div className="flex items-center justify-center relative shrink-0">
                                <p className="font-medium leading-[1.5] relative shrink-0 text-[14px] text-[#c0c6cd] text-nowrap">
                                  Only ## spots left
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-0 items-start relative shrink-0 w-full">
                        <div className="flex gap-[2px] items-center relative shrink-0 w-full">
                          <p className="font-medium leading-[1.4] relative shrink-0 text-[#c0c6cd] text-[14px] text-nowrap tracking-[0px]">
                            Eligible athlete:
                          </p>
                          <div className="flex gap-[2px] items-center relative shrink-0">
                            <div className="flex gap-[2px] items-center relative shrink-0">
                              <CheckCircle2 className="size-4 text-[#c0c6cd]" />
                              <p className="font-medium leading-[1.4] relative shrink-0 text-[#c0c6cd] text-[14px] text-nowrap tracking-[0px]">
                                Hayden Ohmes
                              </p>
                            </div>
                            <div className="flex gap-[2px] items-center relative shrink-0">
                              <CheckCircle2 className="size-4 text-[#c0c6cd]" />
                              <p className="font-medium leading-[1.4] relative shrink-0 text-[#c0c6cd] text-[14px] text-nowrap tracking-[0px]">
                                Kiersten Ohmes
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-0 items-start justify-center relative shrink-0 w-full">
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

