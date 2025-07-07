"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Play, Cpu, Zap, Code } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"

export default function CyberHero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const [typedText, setTypedText] = useState("")
  const [clientShapes, setClientShapes] = useState<Array<{ id: number; size: number; left: string; top: string }>>([])
  const fullText = "NEURAL INTERFACE ACTIVATED"

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1))
        i++
      } else {
        clearInterval(timer)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [])

  // Generate client-side shapes to avoid hydration mismatch
  useEffect(() => {
    const shapes = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      size: 100 + i * 50,
      left: `${20 + (i % 4) * 20}%`,
      top: `${20 + Math.floor(i / 4) * 40}%`,
    }))
    setClientShapes(shapes)
  }, [])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Geometric shapes */}
      <motion.div style={{ y, opacity }} className="absolute inset-0">
        <div className="relative w-full h-full">
          {/* Floating 3D Cards */}
          {clientShapes.map((shape) => (
            <motion.div
              key={shape.id}
              className="absolute border border-green-500/30"
              style={{
                width: `${shape.size}px`,
                height: `${shape.size}px`,
                left: shape.left,
                top: shape.top,
              }}
              animate={{
                rotateX: [0, 360],
                rotateY: [0, 180],
                rotateZ: [0, 90],
              }}
              transition={{
                duration: 10 + shape.id * 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <div className="w-full h-full border border-green-500/20 rotate-45" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-8">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="tracking-tight text-7xl md:text-9xl font-bold mb-8 leading-none relative mt-24"
        >
          <span className="text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.5)] mr-2">CYBER</span>
          {/* <br/> */}
          <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">TYPE</span>

          {/* Holographic effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/20 to-transparent animate-pulse" />
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mb-12"
        >
          <div className="text-xl md:text-2xl text-green-300 mb-4 font-mono">{">"} {typedText}</div>
          <div className="text-lg text-green-400/80 max-w-3xl mx-auto leading-relaxed">
            {"Enter the matrix of reverse typing. Train your brain's neural pathways through advanced cognitive algorithms and cybernetic enhancement protocols."}
          </div>
        </motion.div>

        {/* Cyber buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <Link href="/typing">
            <motion.button
              className="group relative px-8 py-4 bg-green-500/20 border-2 border-green-500 text-green-400 font-mono text-lg font-bold overflow-hidden"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34,197,94,0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-green-500/30 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <div className="relative flex items-center gap-3">
                <Play className="w-6 h-6" />
                [INIT] START_PROTOCOL
                <Cpu className="w-6 h-6 animate-spin" />
              </div>
            </motion.button>
          </Link>

          <motion.button
            className="group relative px-8 py-4 border-2 border-green-500/50 text-green-400/70 font-mono text-lg font-bold hover:border-green-500 hover:text-green-400 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Code className="w-6 h-6 inline mr-3" />
            [INFO] VIEW_DOCS
          </motion.button>
        </motion.div>

        {/* System stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { label: "ACTIVE_NODES", value: "47,293", icon: Zap },
            { label: "PROTOCOLS_RUN", value: "2,847,392", icon: Cpu },
            { label: "SUCCESS_RATE", value: "94.7%", icon: Code },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center border border-green-500/30 bg-black/50 p-4 relative overflow-hidden group"
              whileHover={{ borderColor: "rgba(34,197,94,0.8)" }}
            >
              <div className="absolute inset-0 bg-green-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <stat.icon className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400 font-mono">{stat.value}</div>
              <div className="text-xs text-green-400/60 font-mono">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
