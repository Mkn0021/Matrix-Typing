"use client"

import { motion, useInView } from "framer-motion"
import { Brain, Zap, Shield, Cpu, Target, Database } from "lucide-react"
import { useRef } from "react"

const features = [
  {
    icon: Brain,
    title: "NEURAL_ENHANCEMENT",
    description: "Advanced cognitive training algorithms boost your mental processing speed by 340%",
    color: "from-purple-500 to-pink-500",
    glowColor: "rgba(168,85,247,0.5)",
  },
  {
    icon: Zap,
    title: "QUANTUM_SPEED",
    description: "Harness quantum computing principles to achieve superhuman typing velocities",
    color: "from-yellow-500 to-orange-500",
    glowColor: "rgba(245,158,11,0.5)",
  },
  {
    icon: Shield,
    title: "CYBER_DEFENSE",
    description: "Military-grade encryption protects your training data in our secure neural network",
    color: "from-blue-500 to-cyan-500",
    glowColor: "rgba(59,130,246,0.5)",
  },
  {
    icon: Cpu,
    title: "AI_ADAPTATION",
    description: "Machine learning algorithms adapt difficulty in real-time to optimize your growth",
    color: "from-green-500 to-emerald-500",
    glowColor: "rgba(34,197,94,0.5)",
  },
  {
    icon: Target,
    title: "PRECISION_MATRIX",
    description: "Nano-second accuracy tracking with holographic feedback visualization systems",
    color: "from-red-500 to-rose-500",
    glowColor: "rgba(239,68,68,0.5)",
  },
  {
    icon: Database,
    title: "DATA_NEXUS",
    description: "Connect to the global typing consciousness and share neural patterns worldwide",
    color: "from-indigo-500 to-purple-500",
    glowColor: "rgba(99,102,241,0.5)",
  },
]

export default function NeonFeatures() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" ref={ref} className="py-24 relative">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="text-green-400 font-mono text-sm mb-4">{">"} SYSTEM_CAPABILITIES</div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            ENHANCED
            <span className="text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]"> PROTOCOLS</span>
          </h2>
          <div className="text-xl text-green-300 max-w-3xl mx-auto font-mono">
            Military-grade typing enhancement technology powered by quantum neural networks
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group relative"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="bg-black/80 border border-green-500/30 rounded-lg p-6 h-full relative overflow-hidden backdrop-blur-sm group-hover:border-green-500/60 transition-all duration-300"
                style={{
                  boxShadow: `0 0 20px ${feature.glowColor}`,
                }}
              >
                {/* Animated background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} animate-pulse`} />
                </div>

                {/* Holographic lines */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center relative"
                      style={{ backgroundColor: feature.glowColor }}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                      <div
                        className="absolute inset-0 rounded-lg animate-ping"
                        style={{ backgroundColor: feature.glowColor }}
                      />
                    </div>
                    <div className="text-green-400 font-mono text-xs">[ACTIVE]</div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-green-400 font-mono">{feature.title}</h3>

                  <p className="text-green-300/80 leading-relaxed text-sm">{feature.description}</p>

                  {/* Progress bar */}
                  <div className="mt-4 bg-green-500/20 rounded-full h-1 overflow-hidden">
                    <motion.div
                      className="h-full bg-green-500"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${Math.random() * 40 + 60}%` } : {}}
                      transition={{ duration: 2, delay: index * 0.2 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
