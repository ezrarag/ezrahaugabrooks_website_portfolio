"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

const nameVariations = [
  "עזרה",
  "HELP",
  "01000101 01011010 01010010 01000001", // Binary for EZRA
  "457A7261", // Hex for EZRA
  "ע׳ ז׳ ר׳ ה׳", // Gematria spelling
  "EZRA",
]

export function AnimatedName() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState(nameVariations[0])
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % nameVariations.length)
        setDisplayText(nameVariations[(currentIndex + 1) % nameVariations.length])
        setIsTransitioning(false)
      }, 400) // Half of transition duration
    }, 2500)

    return () => clearInterval(interval)
  }, [currentIndex])

  const getTextSize = (text: string) => {
    if (text.includes("01000101")) return "text-3xl md:text-5xl" // Binary - smaller
    if (text === "457A7261") return "text-4xl md:text-6xl" // Hex - medium
    if (text === "עזרה") return "text-6xl md:text-8xl" // Hebrew - large
    if (text.includes("ע׳")) return "text-4xl md:text-6xl" // Gematria - medium
    if (text === "HELP") return "text-6xl md:text-8xl" // HELP - large
    if (text === "EZRA") return "text-6xl md:text-8xl" // EZRA - large
    return "text-6xl md:text-8xl" // Default
  }

  const getLetterSpacing = (text: string) => {
    if (text.includes("01000101")) return "tracking-wider" // Binary needs more spacing
    if (text === "457A7261") return "tracking-widest" // Hex needs most spacing
    if (text.includes("ע׳")) return "tracking-wide" // Gematria needs some spacing
    return "tracking-tight" // Default
  }

  const getDirection = (text: string) => {
    // Hebrew text should be right-to-left
    if (text === "עזרה" || text.includes("ע׳")) return "rtl"
    return "ltr"
  }

  const getTextColor = (text: string) => {
    // Add subtle color variations for different types
    if (text === "457A7261") return "text-blue-900" // Hex - blue tint
    if (text.includes("01000101")) return "text-green-900" // Binary - green tint
    if (text === "HELP") return "text-red-900" // HELP - red tint
    return "text-black" // Default
  }

  // Split text into characters, handling spaces and special characters
  const getCharacters = (text: string) => {
    if (text.includes("01000101")) {
      // For binary, split by spaces to keep binary groups together
      return text.split(" ")
    }
    return text.split("")
  }

  const characters = getCharacters(displayText)

  return (
    <div className="relative h-[200px] md:h-[300px] flex items-center justify-center overflow-hidden">
      <motion.h1
        className={`
          ${getTextSize(displayText)} 
          ${getLetterSpacing(displayText)}
          ${getTextColor(displayText)}
          font-bold leading-none text-center flex flex-wrap justify-center items-center gap-1
        `}
        style={{
          direction: getDirection(displayText),
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        {characters.map((char, index) => (
          <motion.span
            key={`${currentIndex}-${index}`}
            className="inline-block"
            initial={{
              opacity: 0,
              y: 20,
              rotateX: -90,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -20,
              rotateX: 90,
              scale: 0.8,
            }}
            transition={{
              delay: index * 0.05, // Stagger each character
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            whileHover={{
              scale: 1.1,
              color: "#6b7280",
              rotateY: 10,
              transition: { duration: 0.2 },
            }}
          >
            {char === " " ? "\u00A0" : char} {/* Non-breaking space for regular spaces */}
          </motion.span>
        ))}
      </motion.h1>

      {/* Character morphing effect overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle background animation */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(0,0,0,0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(0,0,0,0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 20%, rgba(0,0,0,0.05) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, rgba(0,0,0,0.05) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Progress indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {nameVariations.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${index === currentIndex ? "bg-black" : "bg-gray-300"}`}
            animate={{
              scale: index === currentIndex ? 1.2 : 1,
              opacity: index === currentIndex ? 1 : 0.5,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gray-400 rounded-full opacity-20"
            animate={{
              x: [0, Math.random() * 400],
              y: [0, Math.random() * 300],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
