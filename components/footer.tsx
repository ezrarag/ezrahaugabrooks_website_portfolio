"use client"

import { Button } from "@/components/ui/button"

interface FooterProps {
  onAuthClick: () => void
}

export function Footer({ onAuthClick }: FooterProps) {
  const links = [
    { name: "Contact", href: "#contact" },
    { name: "Resume", href: "#resume" },
    { name: "BEAM Think Tank", href: "#beam" },
    { name: "ReadyAimGo", href: "#readyaimgo" },
    { name: "Music Portfolio", href: "#music" },
    { name: "Developer Tools", href: "#tools" },
  ]

  return (
    <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center gap-6">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-slate-400 hover:text-gold-400 transition-colors text-sm"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onAuthClick}
              className="border-gold-400 text-gold-400 hover:bg-gold-400 hover:text-slate-900"
            >
              Log In
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onAuthClick}
              className="bg-gold-400 text-slate-900 hover:bg-gold-500"
            >
              Register
            </Button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700/50 text-center text-slate-500 text-sm">
          <p>&copy; 2024 Portfolio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
