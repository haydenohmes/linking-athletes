"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, ChevronDown, X, Plus } from "lucide-react"

export default function AddAthletePage() {
  const router = useRouter()
  const [firstName, setFirstName] = React.useState("John")
  const [lastName, setLastName] = React.useState("Doe")
  const [dateOfBirth, setDateOfBirth] = React.useState("10/24/2012")
  const [gender, setGender] = React.useState("Male")
  const [grade, setGrade] = React.useState("7th")
  const [graduationYear, setGraduationYear] = React.useState("2029")
  const [isGuardian, setIsGuardian] = React.useState(true)

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
    // Remove current athlete from form
    handleAddAnother()
  }

  return (
    <div className="bg-[#0f1215] flex flex-col isolate items-center overflow-clip relative rounded-[12px] size-full min-h-screen">
      <div className="basis-0 flex flex-col grow items-center justify-center min-h-px min-w-px relative shrink-0 w-full z-[1]">
        <div className="basis-0 flex flex-col gap-0 grow items-center max-w-[560px] min-h-px min-w-px px-20 py-16 relative shrink-0 w-full">
          <div className="bg-[#191f24] flex flex-col gap-6 items-center relative rounded-[12px] shrink-0 w-[480px]">
            {/* Content Section */}
            <div className="flex flex-col gap-8 items-center pb-[60px] pt-10 px-10 relative shrink-0 w-full">
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
                        <Calendar className="size-4 text-white shrink-0 ml-2" />
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
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleAddAnother}
                    className="w-full text-[#0a93f5] hover:text-[#0a93f5] hover:bg-[#0a93f5]/10"
                  >
                    <Plus className="size-4 mr-2" />
                    Add Another Athlete
                  </Button>
                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleFinish}
                    className="w-full"
                  >
                    Finish
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

