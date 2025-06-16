"use client"

import { motion } from "framer-motion"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

export function ContactSection() {
  const [copied, setCopied] = useState(false)
  const email = "hello@yume.com"

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy email:", err)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.0 }}
      className="space-y-4"
    >
      <motion.div
        className="flex items-center gap-3 group cursor-pointer"
        onClick={copyEmail}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-lg font-medium">{email}</span>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
        </motion.div>
      </motion.div>

      {copied && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-sm text-green-600"
        >
          Email copied to clipboard!
        </motion.p>
      )}
    </motion.div>
  )
}
