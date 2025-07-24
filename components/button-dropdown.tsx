"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

interface DropdownItem {
  icon: string
  label: string
  onClick?: () => void
  href?: string
}

interface DropdownSection {
  title: string
  items: DropdownItem[]
}

interface ButtonDropdownProps {
  label: string
  sections: DropdownSection[]
}

export function ButtonDropdown({ label, sections }: ButtonDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleItemClick = (item: DropdownItem) => {
    if (item.onClick) {
      item.onClick()
    }
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ opacity: 0.7 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-light tracking-wide text-white"
      >
        {label}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50"
          >
            <div className="py-2">
              {sections.map((section, sectionIndex) => (
                <div key={section.title}>
                  {sectionIndex > 0 && <div className="border-t border-gray-800 my-2" />}

                  <div className="px-4 py-2">
                    <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">{section.title}</h4>
                    <div className="space-y-1">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex}>
                          {item.href ? (
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 px-2 py-2 text-sm text-white hover:bg-gray-800 rounded transition-colors"
                              onClick={() => setIsOpen(false)}
                            >
                              <span className="text-base">{item.icon}</span>
                              {item.label}
                            </Link>
                          ) : (
                            <button
                              onClick={() => handleItemClick(item)}
                              className="w-full flex items-center gap-3 px-2 py-2 text-sm text-white hover:bg-gray-800 rounded transition-colors text-left"
                            >
                              <span className="text-base">{item.icon}</span>
                              {item.label}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
