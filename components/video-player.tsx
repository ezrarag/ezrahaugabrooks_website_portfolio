"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Play, X, SkipBack, SkipForward } from "lucide-react"
import { useState } from "react"

export function VideoPlayer() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Video Player Trigger */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="fixed bottom-6 right-6"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        >
          <Play className="w-6 h-6 ml-1" />
        </motion.button>
      </motion.div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-black rounded-lg overflow-hidden max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <h3 className="text-white font-medium">Portfolio Showcase</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Content */}
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <Play className="w-12 h-12 mx-auto mb-2" />
                  <p>Video content will be loaded here</p>
                </div>
              </div>

              {/* Video Controls */}
              <div className="flex items-center justify-center gap-4 p-4 bg-gray-900">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <Play className="w-4 h-4 ml-0.5" />
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
