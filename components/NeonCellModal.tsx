import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Branch {
  id: string;
  title: string;
  content: string;
}

interface NeonCellModalProps {
  open: boolean;
  onClose: () => void;
  entry: {
    id: string;
    title: string;
    linguistRoot: string;
    branches: Branch[];
  };
}

export const NeonCellModal: React.FC<NeonCellModalProps> = ({ open, onClose, entry }) => {
  const [activeBranch, setActiveBranch] = useState(entry.branches[0]?.id || "");
  const modalRef = useRef<HTMLDivElement>(null);

  // Trap focus in modal
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  // Neon color palette
  const neonColors = [
    "from-purple-500 via-pink-500 to-cyan-400",
    "from-cyan-400 via-purple-500 to-pink-500",
    "from-pink-500 via-cyan-400 to-purple-500",
    "from-purple-400 via-cyan-400 to-pink-400",
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        aria-modal="true"
        role="dialog"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative bg-[#181825] rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-8 flex flex-col items-center border border-cyan-400/30"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-cyan-300 hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-full p-1"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold text-cyan-300 mb-2 text-center drop-shadow-neon">{entry.title}</h2>

          {/* Neon Network Layout */}
          <div className="relative flex flex-col items-center w-full mt-4">
            {/* Central Linguist Breakdown */}
            <motion.div
              className="z-10 bg-[#232336] border-2 border-cyan-400/40 rounded-full px-8 py-6 shadow-lg text-center text-lg font-semibold text-white neon-glow"
              initial={{ boxShadow: "0 0 0px #67e8f9" }}
              animate={{ boxShadow: "0 0 32px #67e8f9, 0 0 8px #a21caf" }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            >
              <span className="block text-cyan-300 text-base font-bold mb-2 tracking-wide">Linguist Breakdown</span>
              <span className="text-white/90 text-base font-normal">{entry.linguistRoot}</span>
            </motion.div>

            {/* Neon Branch Nodes (Tabs) */}
            <div className="relative flex flex-wrap justify-center items-center gap-6 mt-8">
              {entry.branches.map((branch, i) => (
                <motion.button
                  key={branch.id}
                  onClick={() => setActiveBranch(branch.id)}
                  className={`relative px-5 py-3 rounded-full font-semibold text-white bg-gradient-to-r ${neonColors[i % neonColors.length]} shadow-lg border-2 border-cyan-400/40 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200
                    ${activeBranch === branch.id ? "ring-2 ring-pink-400 scale-105" : "opacity-80"}
                  `}
                  whileHover={{ scale: 1.08, boxShadow: "0 0 24px #f472b6, 0 0 8px #67e8f9" }}
                  animate={{
                    scale: [1, 1.04, 1],
                    boxShadow: [
                      "0 0 16px #a21caf, 0 0 4px #67e8f9",
                      "0 0 32px #f472b6, 0 0 8px #67e8f9",
                      "0 0 16px #a21caf, 0 0 4px #67e8f9",
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  tabIndex={0}
                  aria-selected={activeBranch === branch.id}
                  aria-controls={`branch-panel-${branch.id}`}
                >
                  {branch.title}
                </motion.button>
              ))}
            </div>

            {/* Branch Content */}
            <div className="mt-8 w-full max-w-xl mx-auto bg-[#232336] rounded-xl border border-cyan-400/20 p-6 shadow-inner min-h-[120px]">
              {entry.branches.map((branch) => (
                <AnimatePresence key={branch.id}>
                  {activeBranch === branch.id && (
                    <motion.div
                      id={`branch-panel-${branch.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.3 }}
                      className="text-white/90 text-base"
                    >
                      {branch.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// TailwindCSS neon glow utility (add to your global CSS if needed):
// .drop-shadow-neon {
//   filter: drop-shadow(0 0 8px #67e8f9) drop-shadow(0 0 16px #a21caf);
// }
// .neon-glow {
//   box-shadow: 0 0 32px #67e8f9, 0 0 8px #a21caf;
// } 