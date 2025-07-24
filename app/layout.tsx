import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/toast-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "עזרה",
  description: "Portfolio website with AI assistant - Developer, Linguist, Composer, Educator",
  keywords: ["portfolio", "developer", "linguist", "composer", "educator", "web development", "AI assistant"],
  authors: [{ name: "Ezra Haugabrooks" }],
  openGraph: {
    title: "עזרה - AI-Powered Portfolio",
    description: "Explore my work and chat with my AI assistant",
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
      <body className={inter.className}>
        {children}
        <ToastProvider />
      </body>
    </html>
  )
}
