import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "עזרה",
  description:
    "Portfolio website with framer motion - Developer, Linguist, Composer, Educator",
  keywords: ["portfolio", "developer", "linguist", "composer", "educator", "web development"],
  authors: [{ name: "Portfolio Owner" }],
  openGraph: {
    title: "Portfolio - Eye of Horus Navigation",
    description: "Explore my work through the mystical Eye of Horus navigation",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
