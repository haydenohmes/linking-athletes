"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to program page on mount
    router.push("/program")
  }, [router])

  return (
    <div className="bg-[#0f1215] flex items-center justify-center min-h-screen">
      <div className="text-[#c0c6cd]">Redirecting...</div>
    </div>
  )
}



