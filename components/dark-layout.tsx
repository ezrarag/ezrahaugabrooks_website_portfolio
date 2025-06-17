"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

interface DarkLayoutProps {
  children: ReactNode
  title: string
  description: string
}

export function DarkLayout({ children, title, description }: DarkLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 py-6"
      >
        <div className="flex items-center justify-between">
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold"
              style={{ direction: "rtl" }}
            >
              עזרה
            </motion.div>
          </Link>

          <div className="flex items-center gap-6">
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              LinkedIn
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Twitter
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Behance
            </motion.a>
          </div>
        </div>
      </motion.header>

      {/* Back Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="container mx-auto px-6 mb-8"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="container mx-auto px-6 mb-12"
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-6">{title}</h1>
        <p className="text-xl text-gray-400 max-w-3xl">{description}</p>
      </motion.div>

      {/* Content */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="container mx-auto px-6 pb-20"
      >
        {children}
      </motion.main>

      {/* Footer CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="container mx-auto px-6 py-20 text-center"
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
          Curious about what we can <span className="text-gray-500">create together?</span>
          <br />
          Let's bring something extraordinary <span className="text-gray-500">to life!</span>
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-black font-medium rounded hover:bg-gray-100 transition-colors"
          >
            Get in Touch
          </motion.button>

          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">Available For Work</span>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.0 }}
        className="border-t border-gray-800"
      >
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <div className="space-y-1">
              <div>+81 (0)90 1234 5678</div>
              <div>info@עזרה.online</div>
            </div>

            <div className="text-center">
              <div>Designed & Developed</div>
              <div>by Ezra Haugabrooks</div>
            </div>

            <div className="text-right">
              <div>All rights reserved,</div>
              <div style={{ direction: "rtl" }}>עזרה ©2024</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 1.2 }}
            className="h-full bg-white"
          />
        </div>
      </motion.footer>
    </div>
  )
}
