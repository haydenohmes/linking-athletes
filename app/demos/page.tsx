"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { AddOrConnectAthleteDialog } from "@/components/add-or-connect-athlete-dialog"
import { SendLinkDialog } from "@/components/send-link-dialog"
import { ConnectionRequestSentDialog } from "@/components/connection-request-sent-dialog"
import Link from "next/link"

export default function DemosPage() {
  const [showDialog1, setShowDialog1] = React.useState(false)
  const [showDialog2, setShowDialog2] = React.useState(false)
  const [showDialog3, setShowDialog3] = React.useState(false)
  const [showDialog4, setShowDialog4] = React.useState(false)
  const [showDialog5, setShowDialog5] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [selectedOption, setSelectedOption] = React.useState<"connect" | "add">("connect")

  return (
    <div className="min-h-screen bg-[#191f24] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Figma Design Implementations</h1>
          <p className="text-gray-400 mb-4">Click the buttons below to view each design implementation.</p>
          <Link href="/program" className="text-blue-400 hover:underline">
            View Main Program Page (Design 1) →
          </Link>
        </div>

        <div className="space-y-4">
          <div className="bg-[#0f1215] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-2">Design 1: Main Program Page</h2>
            <p className="text-gray-400 mb-4">Full page with navbar, profile banner, program details, athletes, and registrations.</p>
            <Link href="/program">
              <Button>View Program Page</Button>
            </Link>
          </div>

          <div className="bg-[#0f1215] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-2">Design 2: Add or Connect Athlete</h2>
            <p className="text-gray-400 mb-4">Dialog with two options: Connect to Existing Athlete or Add New Athlete.</p>
            <Button onClick={() => setShowDialog1(true)}>Open Dialog</Button>
          </div>

          <div className="bg-[#0f1215] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-2">Design 3: Send Link (Empty State)</h2>
            <p className="text-gray-400 mb-4">Dialog with email input field in empty state.</p>
            <Button onClick={() => {
              setEmail("")
              setShowDialog2(true)
            }}>Open Dialog (Empty)</Button>
          </div>

          <div className="bg-[#0f1215] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-2">Design 4: Send Link (Filled State)</h2>
            <p className="text-gray-400 mb-4">Dialog with email input field filled with hayden.ohmes@hudl.com.</p>
            <Button onClick={() => {
              setEmail("hayden.ohmes@hudl.com")
              setShowDialog3(true)
            }}>Open Dialog (Filled)</Button>
          </div>

          <div className="bg-[#0f1215] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-2">Design 5: Connection Request Sent</h2>
            <p className="text-gray-400 mb-4">Confirmation dialog after sending connection request.</p>
            <Button onClick={() => setShowDialog4(true)}>Open Dialog</Button>
          </div>
        </div>
      </div>

      <AddOrConnectAthleteDialog
        open={showDialog1}
        onOpenChange={setShowDialog1}
        selectedOption={selectedOption}
        onOptionChange={setSelectedOption}
      />

      <SendLinkDialog
        open={showDialog2}
        onOpenChange={setShowDialog2}
        email={email}
        onEmailChange={setEmail}
      />

      <SendLinkDialog
        open={showDialog3}
        onOpenChange={setShowDialog3}
        email={email}
        onEmailChange={setEmail}
      />

      <ConnectionRequestSentDialog
        open={showDialog4}
        onOpenChange={setShowDialog4}
      />
    </div>
  )
}


