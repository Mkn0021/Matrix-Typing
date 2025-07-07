"use client"

import { useState, useEffect, ReactNode } from "react"
import { motion } from "framer-motion"

export default function MatrixBackground({ children }: { children: ReactNode }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [glitchEffect, setGlitchEffect] = useState(false)
  const [RandomjapaneseWord, setRandomjapaneseWord] = useState<string | null>(null)
  const [rainPositions, setRainPositions] = useState<number[]>([])


  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchEffect(true)
      setTimeout(() => setGlitchEffect(false), 200)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setRandomjapaneseWord(Array.from({ length: 20 }, () => String.fromCharCode(0x30a0 + Math.random() * 96)).join(""));
  }, []);

  useEffect(() => {
    // Generate random left positions for rain drops on client only
    setRainPositions(Array.from({ length: 50 }, () => Math.random() * 100))
  }, [])

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden relative">
      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-pulse" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff00 2px, #00ff00 4px)",
            animation: "scanlines 0.1s linear infinite",
          }}
        />
      </div>

      {/* Matrix rain background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {rainPositions.map((left, i) => (
          <motion.div
            key={i}
            className="absolute text-green-500/30 text-xs font-mono"
            style={{
              left: `${left}%`,
              top: `-10%`,
            }}
            animate={{
              y: ["0vh", "110vh"],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
              delay: Math.random() * 5,
            }}
            translate="no"
          >
            {RandomjapaneseWord}
          </motion.div>
        ))}
      </div>

      {/* Cursor follower */}
      <motion.div
        className="fixed w-4 h-4 bg-blue-500/20 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      <div className={`relative z-10 ${glitchEffect ? "animate-glitch" : ""}`}>
        {children}
      </div>

      <style jsx>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        .animate-glitch {
          animation: glitch 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}
