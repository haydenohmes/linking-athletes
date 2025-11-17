"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, ChevronUp, ArrowLeft, Filter, Send, Check, GripVertical, X, LayoutGrid, List, ArrowUpDown, ArrowRight } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog" // Added Dialog components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type AthleteStatus = "Assigned" | "Invited" | "Accepted" | "Rostered" | "Declined" | null

type Athlete = {
  id: string
  name: string
  initials: string
  position: string
  status: AthleteStatus
  birthdate: string
  registrations: string[] // Array of registration option names
}

const teams = [
  { id: "13-peak", name: "U13-Black", slots: 12, gender: "Male" },
  { id: "13-timberline", name: "U13-Red", slots: 12, gender: "Female" },
  { id: "13-ascent", name: "U13-Gold", slots: 12, gender: "Male" },
  { id: "14-peak", name: "U14-Black", slots: 12, gender: "Female" },
  { id: "14-ascent", name: "U14-Red", slots: 12, gender: "Male" },
  { id: "14-timberline", name: "U14-Gold", slots: 12, gender: "Female" },
  { id: "15-peak", name: "U15-Black", slots: 12, gender: "Male" },
  { id: "15-timberline", name: "U15-Red", slots: 12, gender: "Female" },
  { id: "15-ascent", name: "U15-Gold", slots: 12, gender: "Male" },
  { id: "16-peak", name: "U16-Black", slots: 12, gender: "Female" },
  { id: "16-ascent", name: "U16-Red", slots: 12, gender: "Male" },
  { id: "17-ascent", name: "U17-Black", slots: 12, gender: "Female" },
  { id: "17-timberline", name: "U17-Red", slots: 12, gender: "Male" },
]

const registrationOptions = [
  "2025-2026 Volleyball Registration",
  "2025-2026 Fall Registration",
  "2025-2026 Winter Registration",
  "2025-2026 Spring Registration",
]

// Helper function to assign registrations to athletes
const assignRegistrations = (athletes: Omit<Athlete, 'registrations'>[]): Athlete[] => {
  return athletes.map((athlete, index) => {
    // Distribute athletes across different registrations
    const registrationIndex = index % registrationOptions.length
    const registrations = [registrationOptions[registrationIndex]]
    
    // Some athletes have multiple registrations (every 4th athlete)
    if (index % 4 === 0 && index + 1 < athletes.length) {
      registrations.push(registrationOptions[(registrationIndex + 1) % registrationOptions.length])
    }
    
    return { ...athlete, registrations }
  })
}

const initialAthletesData: Omit<Athlete, 'registrations'>[] = [
  { id: "1", name: "Ava Miller", initials: "AM", position: "Setter", status: null, birthdate: "03/15/2010" },
  { id: "2", name: "Zoe Parker", initials: "ZP", position: "Outside Hitter", status: null, birthdate: "07/22/2010" },
  {
    id: "3",
    name: "Nora Harris",
    initials: "NH",
    position: "Middle Blocker",
    status: "Invited",
    birthdate: "11/08/2009",
  },
  { id: "4", name: "Lily Mitchell", initials: "LM", position: "Libero", status: null, birthdate: "01/30/2011" },
  { id: "5", name: "Mary Moore", initials: "MM", position: "Opposite", status: null, birthdate: "06/12/2010" },
  { id: "6", name: "Katie Schuler", initials: "KS", position: "Setter", status: null, birthdate: "09/25/2009" },
  { id: "7", name: "Fran Freedman", initials: "FF", position: "Outside Hitter", status: null, birthdate: "04/18/2010" },
  { id: "8", name: "Jan Doe", initials: "JD", position: "Middle Blocker", status: "Declined", birthdate: "12/05/2010" },
  { id: "9", name: "Emma Johnson", initials: "EJ", position: "Setter", status: null, birthdate: "02/14/2010" },
  {
    id: "10",
    name: "Olivia Williams",
    initials: "OW",
    position: "Outside Hitter",
    status: null,
    birthdate: "08/29/2009",
  },
  { id: "11", name: "Sophia Brown", initials: "SB", position: "Middle Blocker", status: null, birthdate: "10/17/2010" },
  { id: "12", name: "Isabella Garcia", initials: "IG", position: "Libero", status: "Invited", birthdate: "05/03/2011" },
  { id: "13", name: "Mia Davis", initials: "MD", position: "Opposite", status: null, birthdate: "07/09/2010" },
  {
    id: "14",
    name: "Charlotte Rodriguez",
    initials: "CR",
    position: "Right Side",
    status: null,
    birthdate: "03/21/2009",
  },
  { id: "15", name: "Amelia Martinez", initials: "AM", position: "Setter", status: null, birthdate: "11/16/2010" },
  {
    id: "16",
    name: "Harper Hernandez",
    initials: "HH",
    position: "Outside Hitter",
    status: null,
    birthdate: "01/08/2010",
  },
  { id: "17", name: "Evelyn Lopez", initials: "EL", position: "Middle Blocker", status: null, birthdate: "06/24/2009" },
  { id: "18", name: "Abigail Gonzalez", initials: "AG", position: "Libero", status: null, birthdate: "09/11/2010" },
  {
    id: "19",
    name: "Emily Wilson",
    initials: "EW",
    position: "Defensive Specialist",
    status: null,
    birthdate: "04/07/2011",
  },
  {
    id: "20",
    name: "Elizabeth Anderson",
    initials: "EA",
    position: "Outside Hitter",
    status: "Invited",
    birthdate: "12/19/2009",
  },
  { id: "21", name: "Sofia Thomas", initials: "ST", position: "Setter", status: null, birthdate: "02/26/2010" },
  { id: "22", name: "Avery Taylor", initials: "AT", position: "Middle Blocker", status: null, birthdate: "08/13/2010" },
  { id: "23", name: "Ella Jackson", initials: "EJ", position: "Right Side", status: null, birthdate: "10/30/2009" },
  {
    id: "24",
    name: "Scarlett Martin",
    initials: "SM",
    position: "Outside Hitter",
    status: null,
    birthdate: "05/15/2010",
  },
  { id: "25", name: "Grace Lee", initials: "GL", position: "Libero", status: null, birthdate: "07/02/2011" },
  {
    id: "26",
    name: "Chloe Thompson",
    initials: "CT",
    position: "Opposite",
    status: "Declined",
    birthdate: "03/28/2010",
  },
  { id: "27", name: "Victoria White", initials: "VW", position: "Setter", status: null, birthdate: "11/05/2009" },
  { id: "28", name: "Riley Harris", initials: "RH", position: "Outside Hitter", status: null, birthdate: "01/22/2010" },
  { id: "29", name: "Aria Sanchez", initials: "AS", position: "Middle Blocker", status: null, birthdate: "06/09/2010" },
  { id: "30", name: "Lily Clark", initials: "LC", position: "Libero", status: null, birthdate: "09/17/2009" },
  { id: "31", name: "Aubrey Lewis", initials: "AL", position: "Right Side", status: null, birthdate: "04/25/2011" },
  {
    id: "32",
    name: "Zoey Robinson",
    initials: "ZR",
    position: "Outside Hitter",
    status: "Invited",
    birthdate: "12/03/2009",
  },
  { id: "33", name: "Penelope Walker", initials: "PW", position: "Setter", status: null, birthdate: "02/11/2010" },
  { id: "34", name: "Layla Young", initials: "LY", position: "Middle Blocker", status: null, birthdate: "08/28/2010" },
  { id: "35", name: "Natalie Allen", initials: "NA", position: "Opposite", status: null, birthdate: "10/14/2009" },
  { id: "36", name: "Hannah King", initials: "HK", position: "Outside Hitter", status: null, birthdate: "05/21/2010" },
  { id: "37", name: "Brooklyn Wright", initials: "BW", position: "Libero", status: null, birthdate: "07/08/2011" },
  {
    id: "38",
    name: "Addison Scott",
    initials: "AS",
    position: "Defensive Specialist",
    status: null,
    birthdate: "03/16/2010",
  },
  { id: "39", name: "Leah Torres", initials: "LT", position: "Setter", status: null, birthdate: "11/23/2009" },
  {
    id: "40",
    name: "Savannah Nguyen",
    initials: "SN",
    position: "Outside Hitter",
    status: null,
    birthdate: "01/10/2010",
  },
  {
    id: "41",
    name: "Audrey Hill",
    initials: "AH",
    position: "Middle Blocker",
    status: "Invited",
    birthdate: "06/27/2010",
  },
  { id: "42", name: "Claire Flores", initials: "CF", position: "Right Side", status: null, birthdate: "09/04/2009" },
  { id: "43", name: "Skylar Green", initials: "SG", position: "Opposite", status: null, birthdate: "04/12/2011" },
  { id: "44", name: "Bella Adams", initials: "BA", position: "Outside Hitter", status: null, birthdate: "12/29/2009" },
  { id: "45", name: "Aaliyah Nelson", initials: "AN", position: "Libero", status: null, birthdate: "02/17/2010" },
  { id: "46", name: "Anna Baker", initials: "AB", position: "Setter", status: null, birthdate: "08/05/2010" },
  {
    id: "47",
    name: "Samantha Hall",
    initials: "SH",
    position: "Middle Blocker",
    status: null,
    birthdate: "10/22/2009",
  },
  {
    id: "48",
    name: "Caroline Rivera",
    initials: "CR",
    position: "Outside Hitter",
    status: "Declined",
    birthdate: "05/09/2010",
  },
  { id: "49", name: "Kennedy Campbell", initials: "KC", position: "Right Side", status: null, birthdate: "07/26/2011" },
  { id: "50", name: "Violet Mitchell", initials: "VM", position: "Libero", status: null, birthdate: "03/04/2010" },
  { id: "51", name: "Stella Carter", initials: "SC", position: "Opposite", status: null, birthdate: "11/11/2009" },
  { id: "52", name: "Maya Roberts", initials: "MR", position: "Setter", status: null, birthdate: "01/28/2010" },
  { id: "53", name: "Lucy Turner", initials: "LT", position: "Outside Hitter", status: null, birthdate: "06/15/2010" },
  {
    id: "54",
    name: "Paisley Phillips",
    initials: "PP",
    position: "Middle Blocker",
    status: "Invited",
    birthdate: "09/22/2009",
  },
  { id: "55", name: "Everly Campbell", initials: "EC", position: "Libero", status: null, birthdate: "04/30/2011" },
  {
    id: "56",
    name: "Madelyn Parker",
    initials: "MP",
    position: "Defensive Specialist",
    status: null,
    birthdate: "12/07/2009",
  },
  {
    id: "57",
    name: "Kinsley Evans",
    initials: "KE",
    position: "Outside Hitter",
    status: null,
    birthdate: "02/23/2010",
  },
  { id: "58", name: "Naomi Edwards", initials: "NE", position: "Setter", status: null, birthdate: "08/10/2010" },
  {
    id: "59",
    name: "Elena Collins",
    initials: "EC",
    position: "Middle Blocker",
    status: null,
    birthdate: "10/27/2009",
  },
  { id: "60", name: "Hazel Stewart", initials: "HS", position: "Right Side", status: null, birthdate: "05/14/2010" },
  {
    id: "61",
    name: "Aurora Morris",
    initials: "AM",
    position: "Outside Hitter",
    status: null,
    birthdate: "07/01/2011",
  },
  { id: "62", name: "Savannah Rogers", initials: "SR", position: "Opposite", status: null, birthdate: "03/19/2010" },
  { id: "63", name: "Brooklyn Reed", initials: "BR", position: "Libero", status: null, birthdate: "11/26/2009" },
  { id: "64", name: "Bella Cook", initials: "BC", position: "Setter", status: "Invited", birthdate: "01/13/2010" },
  {
    id: "65",
    name: "Autumn Morgan",
    initials: "AM",
    position: "Outside Hitter",
    status: null,
    birthdate: "06/30/2010",
  },
  { id: "66", name: "Piper Bell", initials: "PB", position: "Middle Blocker", status: null, birthdate: "09/07/2009" },
  { id: "67", name: "Ruby Murphy", initials: "RM", position: "Libero", status: null, birthdate: "04/24/2011" },
  { id: "68", name: "Serenity Bailey", initials: "SB", position: "Right Side", status: null, birthdate: "12/01/2009" },
  {
    id: "69",
    name: "Willow Rivera",
    initials: "WR",
    position: "Outside Hitter",
    status: null,
    birthdate: "02/18/2010",
  },
  { id: "70", name: "Daisy Cooper", initials: "DC", position: "Setter", status: null, birthdate: "08/06/2010" },
  {
    id: "71",
    name: "Ivy Richardson",
    initials: "IR",
    position: "Middle Blocker",
    status: null,
    birthdate: "10/23/2009",
  },
  { id: "72", name: "Genesis Cox", initials: "GC", position: "Opposite", status: "Declined", birthdate: "05/10/2010" },
  {
    id: "73",
    name: "Jasmine Howard",
    initials: "JH",
    position: "Outside Hitter",
    status: null,
    birthdate: "07/27/2011",
  },
  { id: "74", name: "Melody Ward", initials: "MW", position: "Libero", status: null, birthdate: "03/05/2010" },
  {
    id: "75",
    name: "Harmony Torres",
    initials: "HT",
    position: "Defensive Specialist",
    status: null,
    birthdate: "11/12/2009",
  },
]

// Create initialAthletes with registrations assigned
const initialAthletes = assignRegistrations(initialAthletesData)

type TeamAssignment = {
  [teamId: string]: {
    [slotIndex: number]: string // athlete id
  }
}

const getStatusBadgeStyle = (status: AthleteStatus) => {
  switch (status) {
    case "Assigned":
      return { bg: "bg-muted", text: "text-foreground" }
    case "Invited":
      return { bg: "bg-[#fff9e6]", text: "text-[#705c00]" }
    case "Accepted":
      return { bg: "bg-[#e7f3fd]", text: "text-[#0c4897]" }
    case "Rostered":
      return { bg: "bg-[#f5fcde]", text: "text-[#476600]" }
    case "Declined":
      return { bg: "bg-[#ffefed]", text: "text-destructive" }
    default:
      return null
  }
}

export default function AssignAthletesPage() {
  const [seasonExpanded, setSeasonExpanded] = useState(true)
  const [season2025Expanded, setSeason2025Expanded] = useState(true)
  const [maleExpanded, setMaleExpanded] = useState(true)
  const [femaleExpanded, setFemaleExpanded] = useState(true)
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [athleteFilterOpen, setAthleteFilterOpen] = useState(false)
  const [selectedSeasons, setSelectedSeasons] = useState<Set<string>>(new Set(["U13-Black"]))
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set())

  // ADDED separate selection states for different contexts
  const [mainContentSelectedAthletes, setMainContentSelectedAthletes] = useState<Set<string>>(new Set())
  const [sidebarSelectedAthletes, setSidebarSelectedAthletes] = useState<Set<string>>(new Set())

  const [selectedAthleteForDrawer, setSelectedAthleteForDrawer] = useState<Athlete | null>(null)

  const [teamAssignments, setTeamAssignments] = useState<TeamAssignment>({})
  const [athleteStatuses, setAthleteStatuses] = useState<{ [athleteId: string]: AthleteStatus }>({})
  const [draggedAthletes, setDraggedAthletes] = useState<string[]>([])
  const [dragOverSlot, setDragOverSlot] = useState<{ teamId: string; slotIndex: number } | null>(null)
  const [dragOverCollapsedTeam, setDragOverCollapsedTeam] = useState<string | null>(null)
  const [dragOverTeamContainer, setDragOverTeamContainer] = useState<string | null>(null)
  // ADDED state to track drag position for badge display

  const [filtersApplied, setFiltersApplied] = useState(false)

  const [viewMode, setViewMode] = useState<"grid" | "list">("list")

  const [athleteSortOrder, setAthleteSortOrder] = useState<"asc" | "desc">("asc")

  const [athleteFilterSeasonExpanded, setAthleteFilterSeasonExpanded] = useState(true)
  const [athleteFilterProgramExpanded, setAthleteFilterProgramExpanded] = useState(true)

  const [ageRangeMin, setAgeRangeMin] = useState<string>("10")
  const [ageRangeMax, setAgeRangeMax] = useState<string>("20")
  const [selectedAthleteFilterGender, setSelectedAthleteFilterGender] = useState<string | null>(null)

  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [selectedTeamsForInvite, setSelectedTeamsForInvite] = useState<Set<string>>(
    new Set(teams.slice(0, 5).map((t) => t.id)),
  )

  const [selectedProgram, setSelectedProgram] = useState<string>("")
  const [selectedRegistration, setSelectedRegistration] = useState<Set<string>>(new Set())

  const seasonItems = [
    "U13-Black",
    "U13-Red",
    "U13-Gold",
    "U14-Black",
    "U14-Red",
    "U14-Gold",
    "U15-Black",
    "U15-Red",
    "U15-Gold",
    "U16-Black",
    "U16-Red",
    "U17-Black",
    "U17-Red",
  ]

  const programOptions = [
    "2025-2026 Open Gym (Aug 1 - May 31)",
    "2025-2026 Fall Open Gym (Sept 15 - Nov 30)",
    "2025-2026 Winter Open Gym (Dec 1 - Feb 28)",
    "2025-2026 Open Gym Fall (Sept 1 - Nov 15)",
  ]

  const ageOptions = ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]

  const activeFiltersCount = selectedSeasons.size

  const athleteFilterCount =
    (ageRangeMin !== "10" || ageRangeMax !== "20" ? 1 : 0) + (selectedAthleteFilterGender ? 1 : 0)

  const getAssignedAthleteIds = () => {
    const assignedIds = new Set<string>()
    Object.values(teamAssignments).forEach((slots) => {
      Object.values(slots).forEach((athleteId) => {
        assignedIds.add(athleteId)
      })
    })
    return assignedIds
  }

  const getTeamStats = (teamId: string) => {
    const slots = teamAssignments[teamId] || {}
    const athleteIds = Object.values(slots)

    const stats = {
      rostered: 0,
      assigned: 0,
      invited: 0,
      declined: 0,
    }

    athleteIds.forEach((athleteId) => {
      const status = athleteStatuses[athleteId]
      if (status === "Rostered") stats.rostered++
      else if (status === "Assigned") stats.assigned++
      else if (status === "Invited") stats.invited++
      else if (status === "Declined") stats.declined++
    })

    return stats
  }

  const assignedAthleteIds = getAssignedAthleteIds()
  const availableAthletes = initialAthletes.filter((athlete) => !assignedAthleteIds.has(athlete.id))

  const [athleteSearchQuery, setAthleteSearchQuery] = useState("")
  const [teamSearchQuery, setTeamSearchQuery] = useState("")

  const searchedAthletes =
    !selectedProgram || selectedRegistration.size === 0
      ? []
      : availableAthletes
          .filter((athlete) => {
            // Filter by registration - athlete must have at least one matching registration
            const hasMatchingRegistration = Array.from(selectedRegistration).some((reg) =>
              athlete.registrations.includes(reg)
            )
            return hasMatchingRegistration && athlete.name.toLowerCase().includes(athleteSearchQuery.toLowerCase())
          })
          .sort((a, b) => {
            if (athleteSortOrder === "asc") {
              return a.name.localeCompare(b.name)
            } else {
              return b.name.localeCompare(a.name)
            }
          })
          .slice(0, filtersApplied ? 20 : undefined)

  const handleDragStart = (e: React.DragEvent, athleteId: string) => {
    const isSidebarSelected = sidebarSelectedAthletes.has(athleteId)
    const isMainContentSelected = mainContentSelectedAthletes.has(athleteId)

    let athletesToDrag: string[]

    if (isSidebarSelected) {
      // Dragging from sidebar: use sidebar selections
      athletesToDrag = Array.from(sidebarSelectedAthletes)
    } else if (isMainContentSelected) {
      // Dragging from main content: use main content selections
      athletesToDrag = Array.from(mainContentSelectedAthletes)
    } else {
      // Not selected: just drag the single athlete
      athletesToDrag = [athleteId]
    }

    setDraggedAthletes(athletesToDrag)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", athletesToDrag.join(","))
  }

  const handleDragEnd = () => {
    setDraggedAthletes([])
    setDragOverSlot(null)
    setDragOverCollapsedTeam(null)
    setDragOverTeamContainer(null)
    setMainContentSelectedAthletes(new Set())
    setSidebarSelectedAthletes(new Set())
  }

  const handleDragOver = (e: React.DragEvent, teamId: string, slotIndex: number) => {
    e.preventDefault()
    e.stopPropagation() // Stop propagation to prevent container handler from firing
    e.dataTransfer.dropEffect = "move"
    setDragOverSlot({ teamId, slotIndex })
    setDragOverTeamContainer(null) // Clear container hover when over specific slot
  }

  const handleDragLeave = () => {
    setDragOverSlot(null)
  }

  const handleDrop = (e: React.DragEvent, teamId: string, slotIndex: number) => {
    e.preventDefault()
    e.stopPropagation() // Stop propagation to prevent container handler from firing

    const athleteIds = draggedAthletes

    if (athleteIds.length === 0) return

    const newAssignments = { ...teamAssignments }
    const newStatuses = { ...athleteStatuses }

    // Remove athletes from their current positions
    athleteIds.forEach((athleteId) => {
      Object.keys(newAssignments).forEach((teamKey) => {
        Object.keys(newAssignments[teamKey]).forEach((slotKey) => {
          if (newAssignments[teamKey][Number(slotKey)] === athleteId) {
            delete newAssignments[teamKey][Number(slotKey)]
          }
        })
      })
    })

    if (!newAssignments[teamId]) {
      newAssignments[teamId] = {}
    }

    let currentSlot = slotIndex
    athleteIds.forEach((athleteId) => {
      // Find next available slot
      while (
        newAssignments[teamId][currentSlot] !== undefined &&
        currentSlot < teams.find((t) => t.id === teamId)!.slots
      ) {
        currentSlot++
      }
      if (currentSlot < teams.find((t) => t.id === teamId)!.slots) {
        newAssignments[teamId][currentSlot] = athleteId
        newStatuses[athleteId] = "Assigned"
        currentSlot++
      }
    })

    setTeamAssignments(newAssignments)
    setAthleteStatuses(newStatuses)
    setDraggedAthletes([])
    setDragOverSlot(null)

    // Clear selection after drop
    setMainContentSelectedAthletes(new Set())
    setSidebarSelectedAthletes(new Set())
  }

  const removeAthleteFromSlot = (teamId: string, slotIndex: number) => {
    const athleteId = teamAssignments[teamId]?.[slotIndex]
    const newAssignments = { ...teamAssignments }
    if (newAssignments[teamId]) {
      delete newAssignments[teamId][slotIndex]
    }

    if (athleteId) {
      const newStatuses = { ...athleteStatuses }
      delete newStatuses[athleteId]
      setAthleteStatuses(newStatuses)
    }

    setTeamAssignments(newAssignments)
  }

  const toggleAthleteFilterGender = (gender: string) => {
    setSelectedAthleteFilterGender(selectedAthleteFilterGender === gender ? null : gender)
  }

  const clearAthleteFilters = () => {
    setAgeRangeMin("10")
    setAgeRangeMax("20")
    setSelectedAthleteFilterGender(null)
    setFiltersApplied(false)
  }

  const clearFilters = () => {
    setSelectedSeasons(new Set())
  }

  const toggleSeason = (season: string) => {
    const newSelected = new Set(selectedSeasons)
    if (newSelected.has(season)) {
      newSelected.delete(season)
    } else {
      newSelected.add(season)
    }
    setSelectedSeasons(newSelected)
  }

  const toggleTeam = (teamId: string) => {
    const newExpandedTeams = new Set(expandedTeams)
    if (newExpandedTeams.has(teamId)) {
      newExpandedTeams.delete(teamId)
    } else {
      newExpandedTeams.add(teamId)
    }
    setExpandedTeams(newExpandedTeams)
  }

  const toggleTeamForInvite = (teamId: string) => {
    const newSelected = new Set(selectedTeamsForInvite)
    if (newSelected.has(teamId)) {
      newSelected.delete(teamId)
    } else {
      newSelected.add(teamId)
    }
    setSelectedTeamsForInvite(newSelected)
  }

  const filteredTeams = teams.filter((team) => {
    if (selectedSeasons.size === 0) return false
    const matchesSeason = selectedSeasons.has(team.name)
    
    if (teamSearchQuery === "") {
      return matchesSeason
    }
    
    const searchLower = teamSearchQuery.toLowerCase()
    const matchesTeamName = team.name.toLowerCase().includes(searchLower)
    
    // Check if any assigned athlete matches the search
    const teamSlots = teamAssignments[team.id] || {}
    const assignedAthleteIds = Object.values(teamSlots)
    const matchesAthlete = assignedAthleteIds.some((athleteId) => {
      const athlete = initialAthletes.find((a) => a.id === athleteId)
      return athlete && athlete.name.toLowerCase().includes(searchLower)
    })
    
    return matchesSeason && (matchesTeamName || matchesAthlete)
  })

  // Auto-expand teams when search matches an athlete in a collapsed team
  useEffect(() => {
    if (teamSearchQuery === "") return

    const searchLower = teamSearchQuery.toLowerCase()
    const teamsToExpand = new Set<string>()

    // Check all teams that match the season filter
    teams
      .filter((team) => selectedSeasons.has(team.name))
      .forEach((team) => {
        // Check if team has an athlete matching the search
        const teamSlots = teamAssignments[team.id] || {}
        const assignedAthleteIds = Object.values(teamSlots)
        const hasMatchingAthlete = assignedAthleteIds.some((athleteId) => {
          const athlete = initialAthletes.find((a) => a.id === athleteId)
          return athlete && athlete.name.toLowerCase().includes(searchLower)
        })

        // If athlete matches and team is collapsed, expand it
        if (hasMatchingAthlete && !expandedTeams.has(team.id)) {
          teamsToExpand.add(team.id)
        }
      })

    // Expand all matching teams at once
    if (teamsToExpand.size > 0) {
      setExpandedTeams((prev) => {
        const newExpanded = new Set(prev)
        teamsToExpand.forEach((teamId) => newExpanded.add(teamId))
        return newExpanded
      })
    }
  }, [teamSearchQuery, teamAssignments, selectedSeasons, expandedTeams])

  // COMBINED selection states for drag operations
  const selectedAthletes = new Set([...mainContentSelectedAthletes, ...sidebarSelectedAthletes])

  // CLEAR selection states when selecting in main content
  const toggleMainContentAthleteSelection = (athleteId: string) => {
    setSidebarSelectedAthletes(new Set())

    const newSelected = new Set(mainContentSelectedAthletes)
    if (newSelected.has(athleteId)) {
      newSelected.delete(athleteId)
    } else {
      newSelected.add(athleteId)
    }
    setMainContentSelectedAthletes(newSelected)
  }

  // CLEAR selection states when selecting in sidebar
  const toggleSidebarAthleteSelection = (athleteId: string) => {
    setMainContentSelectedAthletes(new Set())

    const newSelected = new Set(sidebarSelectedAthletes)
    if (newSelected.has(athleteId)) {
      newSelected.delete(athleteId)
    } else {
      newSelected.add(athleteId)
    }
    setSidebarSelectedAthletes(newSelected)
  }

  const handleCollapsedTeamDragOver = (e: React.DragEvent, teamId: string) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = "move"
    setDragOverCollapsedTeam(teamId)
  }

  const handleCollapsedTeamDrop = (e: React.DragEvent, teamId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const athleteIds = draggedAthletes

    if (athleteIds.length === 0) return

    const newAssignments = { ...teamAssignments }
    const newStatuses = { ...athleteStatuses }

    // Remove athletes from their current positions
    athleteIds.forEach((athleteId) => {
      Object.keys(newAssignments).forEach((teamKey) => {
        Object.keys(newAssignments[teamKey]).forEach((slotKey) => {
          if (newAssignments[teamKey][Number(slotKey)] === athleteId) {
            delete newAssignments[teamKey][Number(slotKey)]
          }
        })
      })
    })

    if (!newAssignments[teamId]) {
      newAssignments[teamId] = {}
    }

    const team = teams.find((t) => t.id === teamId)
    if (!team) return

    // Find first available slot
    let currentSlot = 0
    athleteIds.forEach((athleteId) => {
      // Find next available slot
      while (newAssignments[teamId][currentSlot] !== undefined && currentSlot < team.slots) {
        currentSlot++
      }
      if (currentSlot < team.slots) {
        newAssignments[teamId][currentSlot] = athleteId
        newStatuses[athleteId] = "Assigned"
        currentSlot++
      }
    })

    setTeamAssignments(newAssignments)
    setAthleteStatuses(newStatuses)
    setDraggedAthletes([])
    setDragOverCollapsedTeam(null)

    // Expand the team to show the assignment
    const newExpandedTeams = new Set(expandedTeams)
    newExpandedTeams.add(teamId)
    setExpandedTeams(newExpandedTeams)

    // Clear selection after drop
    setMainContentSelectedAthletes(new Set())
    setSidebarSelectedAthletes(new Set())
  }

  const handleCollapsedTeamDragLeave = () => {
    setDragOverCollapsedTeam(null)
  }

  const handleTeamContainerDragOver = (e: React.DragEvent, teamId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverTeamContainer(teamId)
  }

  const handleTeamContainerDragLeave = (e: React.DragEvent) => {
    // Only clear if we're actually leaving the container (not entering a child)
    if (e.currentTarget === e.target) {
      setDragOverTeamContainer(null)
    }
  }

  const handleTeamContainerDrop = (e: React.DragEvent, teamId: string) => {
    e.preventDefault()

    const athleteIds = draggedAthletes

    if (athleteIds.length === 0) return

    const newAssignments = { ...teamAssignments }
    const newStatuses = { ...athleteStatuses }

    // Remove athletes from their current positions
    athleteIds.forEach((athleteId) => {
      Object.keys(newAssignments).forEach((teamKey) => {
        Object.keys(newAssignments[teamKey]).forEach((slotKey) => {
          if (newAssignments[teamKey][Number(slotKey)] === athleteId) {
            delete newAssignments[teamKey][Number(slotKey)]
          }
        })
      })
    })

    if (!newAssignments[teamId]) {
      newAssignments[teamId] = {}
    }

    const team = teams.find((t) => t.id === teamId)
    if (!team) return

    // Find first available slot
    let currentSlot = 0
    athleteIds.forEach((athleteId) => {
      // Find next available slot
      while (newAssignments[teamId][currentSlot] !== undefined && currentSlot < team.slots) {
        currentSlot++
      }
      if (currentSlot < team.slots) {
        newAssignments[teamId][currentSlot] = athleteId
        newStatuses[athleteId] = "Assigned"
        currentSlot++
      }
    })

    setTeamAssignments(newAssignments)
    setAthleteStatuses(newStatuses)
    setDraggedAthletes([])
    setDragOverTeamContainer(null)

    // Clear selection after drop
    setMainContentSelectedAthletes(new Set())
    setSidebarSelectedAthletes(new Set())
  }

  const handleMainContentClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setMainContentSelectedAthletes(new Set())
      setSidebarSelectedAthletes(new Set())
    }
  }

  const handleRightSidebarClick = () => {
    // Currently main content doesn't have a separate selection state
    // but this handler is here for future use if needed
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--u-color-base-background)' }}>
      {/* Header - Removed border-b to eliminate the line */}
      <header className="py-2.5" style={{ backgroundColor: 'var(--u-color-base-background)' }}>
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="text-foreground rounded">
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <h1 className="text-foreground font-semibold text-lg">Assign Athletes</h1>

            <div className="flex items-center gap-3">
              <Button onClick={() => setInviteModalOpen(true)} className="bg-muted-foreground hover:bg-foreground text-primary-foreground gap-2 rounded">
                <Send className="h-4 w-4" />
                Send Invitations
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded">Save</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto px-4" style={{ backgroundColor: 'var(--u-color-base-background)' }}>
        <div className="flex h-[calc(100vh-80px)] overflow-hidden relative gap-4">
          {/* Left Sidebar - Filters */}
          <aside
            className={`bg-card rounded overflow-hidden transition-all duration-300 ease-in-out ${
              sidebarVisible ? "w-[300px]" : "w-0"
            }`}
          >
            <div
              className={`p-6 w-[300px] transition-opacity duration-300 overflow-y-auto h-full px-4 py-4 ${sidebarVisible ? "opacity-100" : "opacity-0"}`}
            >
              <h2 className="text-card-foreground font-semibold mb-2">Teams</h2>

              {/* Season Filter */}
              <div>
                <button
                  className="flex items-center gap-2 text-card-foreground text-sm py-1 w-full px-2"
                  onClick={() => setSeason2025Expanded(!season2025Expanded)}
                >
                  {season2025Expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  <span>2025-2026</span>
                </button>
                {season2025Expanded && (
                      <div className="ml-6 space-y-2 mt-1">
                        <div>
                          <button
                            className="flex items-center gap-2 text-card-foreground text-sm py-1 w-full px-2"
                            onClick={() => setMaleExpanded(!maleExpanded)}
                          >
                            {maleExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                            <span>Male</span>
                          </button>
                          {maleExpanded && (
                            <div className="ml-6 space-y-1 mt-1">
                              {teams
                                .filter((team) => team.gender === "Male")
                                .map((team) => (
                                  <button
                                    key={team.name}
                                    onClick={() => toggleSeason(team.name)}
                                    className={`text-card-foreground text-sm py-1 px-2 rounded w-full text-left flex items-center justify-between ${
                                      selectedSeasons.has(team.name) ? "bg-muted" : "hover:bg-muted/50"
                                    }`}
                                  >
                                    <span>{team.name}</span>
                                    {selectedSeasons.has(team.name) && <Check className="h-4 w-4" />}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <button
                            className="flex items-center gap-2 text-card-foreground text-sm py-1 w-full px-2"
                            onClick={() => setFemaleExpanded(!femaleExpanded)}
                          >
                            {femaleExpanded ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                            <span>Female</span>
                          </button>
                          {femaleExpanded && (
                            <div className="ml-6 space-y-1 mt-1">
                              {teams
                                .filter((team) => team.gender === "Female")
                                .map((team) => (
                                  <button
                                    key={team.name}
                                    onClick={() => toggleSeason(team.name)}
                                    className={`text-card-foreground text-sm py-1 px-2 rounded w-full text-left flex items-center justify-between ${
                                      selectedSeasons.has(team.name) ? "bg-muted" : "hover:bg-muted/50"
                                    }`}
                                  >
                                    <span>{team.name}</span>
                                    {selectedSeasons.has(team.name) && <Check className="h-4 w-4" />}
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
              </div>
            </div>
          </aside>

          {/* Center Content Area - Removed bg-white, border, and rounded-lg to make it blend with page background */}
          <main className="flex-1 overflow-hidden flex flex-col" onClick={handleMainContentClick}>
            {/* Toolbar container - sticky at top */}
            <div className="bg-card rounded p-4 mb-4 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:bg-transparent rounded"
                  onClick={() => setSidebarVisible(!sidebarVisible)}
                >
                  <Filter className="h-5 w-5" />
                </Button>
                <Input
                  type="text"
                  placeholder="Search for..."
                  value={teamSearchQuery}
                  onChange={(e) => setTeamSearchQuery(e.target.value)}
                  className="flex-1 border-border text-foreground placeholder:text-muted-foreground rounded"
                />
                <div className="flex items-center bg-card border border-border rounded p-1 py-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={`h-8 w-8 rounded ${
                      viewMode === "grid"
                        ? "bg-muted text-foreground hover:bg-muted"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={`h-8 w-8 rounded ${
                      viewMode === "list"
                        ? "bg-muted text-foreground hover:bg-muted"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {/* Team cards - each in separate white box */}
              {filteredTeams.length > 0 ? (
                <div className={`${viewMode === "grid" ? "grid grid-cols-2 gap-3" : "space-y-3"}`}>
                  {filteredTeams.map((team) => {
                    const stats = getTeamStats(team.id)
                    const isCollapsedDragTarget = !expandedTeams.has(team.id) && dragOverCollapsedTeam === team.id
                    const isContainerDragTarget = expandedTeams.has(team.id) && dragOverTeamContainer === team.id

                    return (
                      <div key={team.id} className="rounded bg-card p-4">
                        <button
                          onClick={() => toggleTeam(team.id)}
                          onDragOver={
                            !expandedTeams.has(team.id) ? (e) => handleCollapsedTeamDragOver(e, team.id) : undefined
                          }
                          onDrop={!expandedTeams.has(team.id) ? (e) => handleCollapsedTeamDrop(e, team.id) : undefined}
                          onDragLeave={!expandedTeams.has(team.id) ? handleCollapsedTeamDragLeave : undefined}
                          className={`w-full transition-colors rounded ${
                            isCollapsedDragTarget ? "bg-muted/50" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <h3 className="text-card-foreground font-semibold mb-2">{team.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>
                                  Rostered <span className="font-bold">{stats.rostered}</span>
                                </span>
                                <span>
                                  Assigned <span className="font-bold">{stats.assigned}</span>
                                </span>
                                <span>
                                  Invited <span className="font-bold">{stats.invited}</span>
                                </span>
                                <span>
                                  Declined <span className="font-bold">{stats.declined}</span>
                                </span>
                              </div>
                            </div>
                            {expandedTeams.has(team.id) ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </button>

                        {expandedTeams.has(team.id) && (
                          <div
                            className={`border border-dashed border-border rounded mt-4 p-4 transition-colors py-0 px-0 ${
                              isContainerDragTarget ? "bg-muted/30" : ""
                            }`}
                            onDragOver={(e) => handleTeamContainerDragOver(e, team.id)}
                            onDragLeave={handleTeamContainerDragLeave}
                            onDrop={(e) => handleTeamContainerDrop(e, team.id)}
                          >
                            {(() => {
                              const teamSlots = teamAssignments[team.id] || {}
                              const filledSlotIndices = Object.keys(teamSlots)
                                .map(Number)
                                .sort((a, b) => a - b)

                              // Render filled slots
                              const filledSlots = filledSlotIndices.map((slotIndex) => {
                                const assignedAthleteId = teamSlots[slotIndex]
                                const assignedAthlete = assignedAthleteId
                                  ? initialAthletes.find((a) => a.id === assignedAthleteId)
                                  : null
                                const isDropTarget =
                                  dragOverSlot?.teamId === team.id && dragOverSlot?.slotIndex === slotIndex
                                const athleteStatus = assignedAthleteId ? athleteStatuses[assignedAthleteId] : null
                                const statusStyle = athleteStatus ? getStatusBadgeStyle(athleteStatus) : null

                                return (
                                  <div
                                    key={slotIndex}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, assignedAthleteId)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={(e) => handleDragOver(e, team.id, slotIndex)}
                                    onDragLeave={handleDragLeave}
                                    onDrop={(e) => handleDrop(e, team.id, slotIndex)}
                                    className={`px-4 py-3 border-b border-dotted border-border transition-colors cursor-move ${
                                      isDropTarget ? "bg-muted/50" : ""
                                    }`}
                                  >
                                    {assignedAthlete && (
                                      <div className="flex items-center gap-3">
                                        <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                        <div className="relative flex items-center justify-center flex-shrink-0">
                                          <input
                                            type="checkbox"
                                            checked={mainContentSelectedAthletes.has(assignedAthleteId)}
                                            onChange={() => toggleMainContentAthleteSelection(assignedAthleteId)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="appearance-none w-5 h-5 border-2 border-border rounded-full cursor-pointer checked:bg-[var(--u-color-emphasis-background-contrast)] checked:border-[var(--u-color-emphasis-background-contrast)] transition-colors flex items-center justify-center"
                                          />
                                          {mainContentSelectedAthletes.has(assignedAthleteId) && (
                                            <Check className="absolute h-3 w-3 text-white pointer-events-none" />
                                          )}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-primary-foreground text-xs font-semibold flex-shrink-0">
                                          {assignedAthlete.initials}
                                        </div>
                                        <div className="flex-1 flex items-center justify-between gap-2">
                                          <div className="flex flex-col">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedAthleteForDrawer(assignedAthlete)
                                              }}
                                              className="text-card-foreground text-sm font-medium hover:text-[var(--u-color-emphasis-background-contrast)] transition-colors text-left"
                                            >
                                              {assignedAthlete.name}
                                            </button>
                                            <span className="text-muted-foreground text-xs">{assignedAthlete.birthdate}</span>
                                          </div>
                                        </div>
                                        {statusStyle && athleteStatus && (
                                          <span
                                            className={`${statusStyle.bg} ${statusStyle.text} text-sm px-3 py-1 rounded font-medium`}
                                          >
                                            {athleteStatus}
                                          </span>
                                        )}
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                          onClick={() => removeAthleteFromSlot(team.id, slotIndex)}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )
                              })

                              const nextSlotIndex =
                                filledSlotIndices.length > 0 ? Math.max(...filledSlotIndices) + 1 : 0
                              const isEmptySlotDropTarget =
                                dragOverSlot?.teamId === team.id && dragOverSlot?.slotIndex === nextSlotIndex

                              const emptySlot = (
                                <div
                                  key="empty-slot"
                                  onDragOver={(e) => handleDragOver(e, team.id, nextSlotIndex)}
                                  onDragLeave={handleDragLeave}
                                  onDrop={(e) => handleDrop(e, team.id, nextSlotIndex)}
                                  className={`px-4 py-3 border-b border-dotted border-border last:border-b-0 transition-colors ${
                                    isEmptySlotDropTarget ? "bg-muted/50" : ""
                                  }`}
                                >
                                  <span className="text-muted-foreground text-sm">Open</span>
                                </div>
                              )

                              return [emptySlot, ...filledSlots]
                            })()}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[calc(100%-80px)]">
                  <p className="text-muted-foreground text-center">Filter your teams to start team assignments</p>
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="w-[400px] bg-card rounded overflow-hidden flex flex-col" onClick={handleRightSidebarClick}>
            <div className="flex-shrink-0 px-4 py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-card-foreground font-semibold">Athletes</h2>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <select
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 border border-border rounded text-foreground text-sm bg-card focus:outline-none focus:ring-2 focus:ring-[var(--u-color-emphasis-background-contrast)] focus:border-transparent"
                  >
                    <option value="">Program</option>
                    {programOptions.map((program) => (
                      <option key={program} value={program}>
                        {program}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        disabled={!selectedProgram}
                        className="w-full pl-3 pr-8 py-2 border border-border rounded text-foreground text-sm bg-card focus:outline-none focus:ring-2 focus:ring-[var(--u-color-emphasis-background-contrast)] focus:border-transparent disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-left flex items-center justify-between"
                      >
                        <span className={selectedRegistration.size === 0 ? "text-muted-foreground" : ""}>
                          {selectedRegistration.size === 0
                            ? "Registration"
                            : selectedRegistration.size === 1
                              ? Array.from(selectedRegistration)[0]
                              : `${selectedRegistration.size} selected`}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[400px] p-2" align="start">
                      <div className="space-y-2">
                        {registrationOptions.map((registration) => {
                          const isSelected = selectedRegistration.has(registration)
                          return (
                            <button
                              key={registration}
                              onClick={() => {
                                const newSelected = new Set(selectedRegistration)
                                if (isSelected) {
                                  newSelected.delete(registration)
                                } else {
                                  newSelected.add(registration)
                                }
                                setSelectedRegistration(newSelected)
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted rounded text-sm text-left"
                            >
                              <div className="relative flex items-center justify-center flex-shrink-0">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => {}}
                                  className="appearance-none w-4 h-4 border-2 border-border rounded cursor-pointer checked:bg-[var(--u-color-emphasis-background-contrast)] checked:border-[var(--u-color-emphasis-background-contrast)] transition-colors"
                                />
                                {isSelected && <Check className="absolute h-3 w-3 text-white pointer-events-none" />}
                              </div>
                              <span className="text-foreground">{registration}</span>
                            </button>
                          )
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-center mb-4 gap-0">
                <Input
                  type="text"
                  placeholder="Search for..."
                  value={athleteSearchQuery}
                  onChange={(e) => setAthleteSearchQuery(e.target.value)}
                  className="flex-1 border-border text-foreground placeholder:text-muted-foreground rounded"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground hover:bg-transparent rounded"
                  onClick={() => setAthleteSortOrder(athleteSortOrder === "asc" ? "desc" : "asc")}
                  title={athleteSortOrder === "asc" ? "Sort A-Z" : "Sort Z-A"}
                >
                  <ArrowUpDown className="h-5 w-5" />
                </Button>
                <Sheet open={athleteFilterOpen} onOpenChange={setAthleteFilterOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground hover:bg-transparent relative rounded"
                    >
                      <Filter className="h-5 w-5" />
                      {athleteFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-[var(--u-color-emphasis-background-contrast)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {athleteFilterCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>

                  <SheetContent className="w-[380px] sm:max-w-[380px] bg-card flex flex-col">
                    <SheetHeader className="flex-shrink-0">
                      <SheetTitle className="text-card-foreground text-left">Filter Athletes by</SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-y-auto mt-6 pr-2">
                      <div className="space-y-6">
                        {/* Active Filters */}
                        {athleteFilterCount > 0 && (
                          <div className="flex items-center justify-between pb-4 border-b border-border">
                            <div className="flex items-center gap-2">
                              <ChevronDown className="h-4 w-4 text-foreground" />
                              <span className="text-foreground text-sm font-medium">
                                {athleteFilterCount} Active Filter{athleteFilterCount !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <button onClick={clearAthleteFilters} className="text-[var(--u-color-emphasis-background-contrast)] text-sm hover:underline">
                              Clear
                            </button>
                          </div>
                        )}

                        <div>
                          <label className="text-sm text-card-foreground font-medium mb-3 block">Age Range</label>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <label className="text-xs text-muted-foreground mb-1 block">Min Age</label>
                                <Input
                                  type="number"
                                  value={ageRangeMin}
                                  onChange={(e) => setAgeRangeMin(e.target.value)}
                                  min="10"
                                  max="20"
                                  className="w-full"
                                />
                              </div>
                              <div className="flex-1">
                                <label className="text-xs text-muted-foreground mb-1 block">Max Age</label>
                                <Input
                                  type="number"
                                  value={ageRangeMax}
                                  onChange={(e) => setAgeRangeMax(e.target.value)}
                                  min="10"
                                  max="20"
                                  className="w-full"
                                />
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Showing athletes aged {ageRangeMin} to {ageRangeMax}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-border" />

                        {/* Gender Filter */}
                        <div>
                          <label className="text-sm text-card-foreground font-medium mb-3 block">Gender</label>
                          <div className="space-y-2">
                            {["Male", "Female"].map((gender) => (
                              <button
                                key={gender}
                                onClick={() => toggleAthleteFilterGender(gender)}
                                className={`text-foreground text-sm py-2 px-3 rounded w-full text-left flex items-center justify-between ${
                                  selectedAthleteFilterGender === gender
                                    ? "bg-border"
                                    : "bg-muted hover:bg-border/50"
                                }`}
                              >
                                <span>{gender}</span>
                                {selectedAthleteFilterGender === gender && <Check className="h-4 w-4" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 pt-4 border-t border-border mt-4">
                      <div className="flex gap-3">
                        <Button
                          onClick={() => setAthleteFilterOpen(false)}
                          variant="outline"
                          className="flex-1 border-border text-foreground hover:bg-muted"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => {
                            setFiltersApplied(true)
                            setAthleteFilterOpen(false)
                          }}
                          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          Get Athletes
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 px-4 pb-4">
              {searchedAthletes.length > 0 ? (
                searchedAthletes.map((athlete) => (
                  <div
                    key={athlete.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, athlete.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => toggleSidebarAthleteSelection(athlete.id)}
                    className={`flex items-center gap-3 p-3 bg-card border border-border rounded hover:bg-muted/50 transition-colors cursor-pointer ${
                      draggedAthletes.includes(athlete.id) ? "opacity-50" : ""
                    }`}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="relative flex items-center justify-center flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={sidebarSelectedAthletes.has(athlete.id)}
                        onChange={() => toggleSidebarAthleteSelection(athlete.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="appearance-none w-5 h-5 border-2 border-border rounded-full cursor-pointer checked:bg-[var(--u-color-emphasis-background-contrast)] checked:border-[var(--u-color-emphasis-background-contrast)] transition-colors flex items-center justify-center"
                      />
                      {sidebarSelectedAthletes.has(athlete.id) && (
                        <Check className="absolute h-3 w-3 text-white pointer-events-none" />
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-primary-foreground text-xs font-semibold flex-shrink-0">
                      {athlete.initials}
                    </div>
                    <div className="flex-1 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedAthleteForDrawer(athlete)
                          }}
                          className="text-card-foreground text-sm font-medium hover:text-[var(--u-color-emphasis-background-contrast)] transition-colors text-left"
                        >
                          {athlete.name}
                        </button>
                        <span className="text-muted-foreground text-xs">{athlete.birthdate}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <p className="text-card-foreground font-medium mb-1">No Athletes</p>
                    <p className="text-muted-foreground text-sm">Choose program and registration to get athletes.</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Sheet open={!!selectedAthleteForDrawer} onOpenChange={(open) => !open && setSelectedAthleteForDrawer(null)}>
        <SheetContent className="w-[400px] sm:max-w-[400px] bg-card flex flex-col p-0">
          {selectedAthleteForDrawer && (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-primary-foreground text-sm font-semibold">
                    {selectedAthleteForDrawer.initials}
                  </div>
                  <h3 className="text-card-foreground font-semibold">{selectedAthleteForDrawer.name}</h3>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border flex gap-3 mt-auto">
                <Button
                  onClick={() => setSelectedAthleteForDrawer(null)}
                  variant="outline"
                  className="flex-1 border-border text-foreground hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">Save</Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent className="max-w-[600px] p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="text-card-foreground text-xl font-semibold">Invite Athletes</DialogTitle>
          </DialogHeader>

          <div className="px-6 py-6">
            <p className="text-card-foreground text-base mb-4">Choose which teams you would like to send invitations to.</p>

            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {teams.map((team) => {
                const isSelected = selectedTeamsForInvite.has(team.id)
                return (
                  <button
                    key={team.id}
                    onClick={() => toggleTeamForInvite(team.id)}
                    className="w-full flex items-center justify-between py-2 px-4 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <span className="text-foreground font-medium text-base">{team.name}</span>
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isSelected ? "bg-primary" : "border-2 border-border"
                      }`}
                    >
                      {isSelected && <Check className="h-4 w-4 text-white" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
            <Button
              onClick={() => setInviteModalOpen(false)}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // TODO: Implement next step (send invitations)
                console.log("Selected teams for invite:", Array.from(selectedTeamsForInvite))
                setInviteModalOpen(false)
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
