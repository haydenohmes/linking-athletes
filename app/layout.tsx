import type React from "react"
import type { Metadata } from "next"
import { Barlow, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
// Import only the design tokens - skip index.css (has global reset) and uniform-design-system.css (remote import)
import "@adam-porter/shared-uniform-styles/src/uniform-design-tokens.css"
import "./globals.css"

const _barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${_barlow.className}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
