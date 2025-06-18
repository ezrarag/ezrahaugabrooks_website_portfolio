"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function ProfileSection() {
  const skills = [
    { name: "Developer", href: "/developer" },
    { name: "Linguist", href: "/linguist" },
    { name: "Musician", href: "/music" },
    { name: "Educator", href: "/educator" },
  ]

  return (
    <div className="space-y-8">
      {/* Profile Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex justify-end"
      >
        <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200">
          <img src="https://vybiefufnvfqvggaxcyy.supabase.co/storage/v1/object/public/avatars//IMG_7871.jpeg?height=200&width=200" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="space-y-6"
      >
        <p className="text-xl leading-relaxed">
          Hi, I’m a creative technologist and independent designer based in Atlanta, Georgia — blending minimal design with thoughtful interaction. Let’s build something meaningful.{" "}
          <motion.span className="underline decoration-2 underline-offset-4" whileHover={{ scale: 1.05 }}>
            Let's create!
          </motion.span>
        </p>

        {/* Skills/Expertise - Now with proper navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold">Expertise</h3>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <Link key={skill.name} href={skill.href}>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block px-4 py-2 bg-black text-white rounded-full text-sm font-medium cursor-pointer hover:bg-gray-800 transition-colors"
                >
                  {skill.name}
                </motion.span>
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
