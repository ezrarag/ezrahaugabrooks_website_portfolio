"use client"

import { useState } from "react"

interface EyeOfHorusProps {
  onSectionSelect: (section: string) => void
}

export function EyeOfHorus({ onSectionSelect }: EyeOfHorusProps) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)

  const sections = {
    brow: { name: "Developer", description: "Apps, Websites, Clients" },
    pupil: { name: "Linguist", description: "Language, Philosophy, Crypto Projects, Games" },
    tail: { name: "Music", description: "Compositions, Recordings, BEAM Projects" },
    teardrop: { name: "Educator", description: "Courses, Think Tank Work, University Roles" },
  }

  return (
    <div className="relative">
      <svg
        width="400"
        height="300"
        viewBox="0 0 400 300"
        className="eye-of-horus animate-blink"
        style={{ filter: "drop-shadow(0 0 30px rgba(255, 255, 255, 0.4))" }}
      >
        {/* Main eye outline - more ethereal */}
        <path
          d="M80 150 Q120 120 200 120 Q280 120 320 150 Q280 180 200 180 Q120 180 80 150 Z"
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="2"
          className="opacity-70"
        />

        {/* Upper eyebrow - Developer section */}
        <path
          d="M90 140 Q140 110 200 110 Q260 110 310 140"
          fill="none"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="3"
          strokeLinecap="round"
          className={`cursor-pointer transition-all duration-300 ${
            hoveredSection === "brow" ? "stroke-white drop-shadow-glow opacity-100" : "opacity-70"
          }`}
          onMouseEnter={() => setHoveredSection("brow")}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => onSectionSelect("developer")}
        />

        {/* Pupil - Linguist section */}
        <circle
          cx="200"
          cy="150"
          r="30"
          fill="rgba(255, 255, 255, 0.3)"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="2"
          className={`cursor-pointer transition-all duration-300 ${
            hoveredSection === "pupil" ? "fill-white/50 stroke-white drop-shadow-glow" : ""
          }`}
          style={{ transformOrigin: "200px 150px" }}
          onMouseEnter={() => setHoveredSection("pupil")}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => onSectionSelect("linguist")}
        />

        {/* Inner pupil */}
        <circle cx="200" cy="150" r="15" fill="rgba(0, 0, 0, 0.8)" />

        {/* Spiral tail - Music section */}
        <path
          d="M320 150 Q350 160 370 180 Q380 200 370 220 Q350 240 320 230 Q300 220 310 200 Q320 180 340 185 Q350 190 345 200 Q340 205 335 200"
          fill="none"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="3"
          strokeLinecap="round"
          className={`cursor-pointer transition-all duration-300 ${
            hoveredSection === "tail" ? "stroke-white drop-shadow-glow opacity-100" : "opacity-70"
          }`}
          onMouseEnter={() => setHoveredSection("tail")}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => onSectionSelect("music")}
        />

        {/* Lower teardrop/falcon mark - Educator section */}
        <path
          d="M180 180 Q170 200 175 220 Q180 240 190 235 Q200 230 195 215 Q190 200 185 190 Q180 185 180 180"
          fill="rgba(255, 255, 255, 0.6)"
          className={`cursor-pointer transition-all duration-300 ${
            hoveredSection === "teardrop" ? "fill-white drop-shadow-glow opacity-100" : "opacity-70"
          }`}
          onMouseEnter={() => setHoveredSection("teardrop")}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => onSectionSelect("educator")}
        />

        {/* Lower curved line extending from teardrop */}
        <path
          d="M190 235 Q210 245 230 240 Q250 235 260 245"
          fill="none"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="2"
          strokeLinecap="round"
          className={`cursor-pointer transition-all duration-300 ${
            hoveredSection === "teardrop" ? "stroke-white drop-shadow-glow opacity-100" : "opacity-70"
          }`}
          onMouseEnter={() => setHoveredSection("teardrop")}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => onSectionSelect("educator")}
        />

        {/* Diagonal line from eye to teardrop */}
        <path
          d="M160 170 L185 190"
          stroke="rgba(255, 255, 255, 0.8)"
          strokeWidth="2"
          strokeLinecap="round"
          className={`cursor-pointer transition-all duration-300 ${
            hoveredSection === "teardrop" ? "stroke-white drop-shadow-glow opacity-100" : "opacity-70"
          }`}
          onMouseEnter={() => setHoveredSection("teardrop")}
          onMouseLeave={() => setHoveredSection(null)}
          onClick={() => onSectionSelect("educator")}
        />

        {/* Eyelid for blinking animation */}
        <path d="M80 150 Q120 120 200 120 Q280 120 320 150" fill="black" className="eyelid opacity-0" />
      </svg>

      {hoveredSection && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-slate-800/90 border border-gold-400/50 rounded-lg p-4 text-center min-w-[200px] backdrop-blur-sm">
          <h3 className="text-gold-400 font-bold text-lg">{sections[hoveredSection as keyof typeof sections].name}</h3>
          <p className="text-slate-300 text-sm mt-1">{sections[hoveredSection as keyof typeof sections].description}</p>
        </div>
      )}

      <style jsx>{`
        .eye-of-horus {
          animation: blink 15s infinite;
        }
        
        @keyframes blink {
          0%, 98% { opacity: 1; }
          99%, 100% { opacity: 0.3; }
        }
        
        .eyelid {
          animation: eyelid-blink 15s infinite;
        }
        
        @keyframes eyelid-blink {
          0%, 98% { opacity: 0; }
          99%, 100% { opacity: 1; }
        }
        
        .drop-shadow-glow {
          filter: drop-shadow(0 0 15px currentColor);
        }
      `}</style>
    </div>
  )
}
