"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Terminal, Zap, Trophy, BarChart3, User, LogIn, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useUser } from '@/context/UserContext';

export default function Navigation() {
  const [hovered, setHovered] = useState<string | null>(null)
  const pathname = usePathname()
  const [showUserCard, setShowUserCard] = useState(false)
  const [userCardRef, setUserCardRef] = useState<HTMLDivElement | null>(null)
  const { user, refreshUser } = useUser();



  const handleLogout = async () => {
    await signOut({ redirect: false })
    refreshUser()
    window.location.replace("/")
  }

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userCardRef && !userCardRef.contains(event.target as Node)) {
        setShowUserCard(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [userCardRef])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-sm border-b border-green-500/30"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <motion.div className="flex items-center gap-3 cursor-pointer" whileHover={{ scale: 1.05 }}>
              <Terminal className="w-8 h-8 text-green-400" />
              <span
                className="text-2xl font-bold text-green-400 glitch-text"
                data-glitch="R3V3RS3_TYP3"
              >
                R3V3RS3_TYP3
              </span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-6">
            {/* Always show these navigation options */}
            <Link href="/leaderboard">
              <motion.div
                className={`text-green-400/70 hover:text-green-400 transition-colors relative flex items-center gap-2 cursor-pointer ${pathname === "/leaderboard" ? "text-green-400" : ""
                  }`}
                onHoverStart={() => setHovered("leaderboard")}
                onHoverEnd={() => setHovered(null)}
                whileHover={{ scale: 1.1 }}
              >
                <Trophy className="w-4 h-4" />
                LEADERBOARD
                {(hovered === "leaderboard" || pathname === "/leaderboard") && (
                  <motion.div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-400" layoutId="underline" />
                )}
              </motion.div>
            </Link>

            {user ? (
              <>
                <div className="relative" ref={setUserCardRef}>
                  <motion.button
                    onClick={() => setShowUserCard(!showUserCard)}
                    className="flex items-center gap-3 px-4 py-2 border border-green-500/30 rounded hover:border-green-500/60 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <User className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-mono">{user.username}</span>
                    <motion.div
                      animate={{ rotate: showUserCard ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-green-400/60"
                    >
                      ▼
                    </motion.div>
                  </motion.button>

                  {/* Floating User Card */}
                  <AnimatePresence>
                    {showUserCard && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full right-0 mt-2 w-80 bg-black/95 border border-green-500/50 rounded-lg shadow-[0_0_30px_rgba(34,197,94,0.3)] backdrop-blur-sm z-50"
                      >
                        {/* Card Header */}
                        <div className="bg-green-500/10 border-b border-green-500/30 p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50">
                              <User className="w-6 h-6 text-green-400" />
                              {/* <img
                                src={user.image ?? "/default-avatar.png"}
                                alt={user.username}
                                className={`rounded-full object-cover mx-auto border-2 border-green-400 shadow w-12 h-12`}
                              /> */}
                            </div>
                            <div>
                              <div className="text-green-400 font-mono font-bold text-lg">{user.username}</div>
                              <div className="text-green-400/60 text-sm font-mono">
                                LVL.{user.level} | CYBER_OPERATIVE
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                              <div className="text-2xl font-bold text-green-400 font-mono">{user.rank == -1 ? 'N/A' : user.rank}</div>
                              <div className="text-green-400/60 text-xs font-mono">GLOBAL_RANK</div>
                            </div>
                            <div className="text-center p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                              <div className="text-2xl font-bold text-purple-400 font-mono">{user.totalTests}</div>
                              <div className="text-green-400/60 text-xs font-mono">TESTS_DONE</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="text-center p-2 bg-green-500/5 border border-green-500/20 rounded">
                              <div className="text-lg font-bold text-yellow-400 font-mono">{user.bestWpm ?? 0}</div>
                              <div className="text-green-400/60 text-xs font-mono">BEST_WPM</div>
                            </div>
                            <div className="text-center p-2 bg-green-500/5 border border-green-500/20 rounded">
                              <div className="text-lg font-bold text-green-400 font-mono">{user.bestAccuracy}</div>
                              <div className="text-green-400/60 text-xs font-mono">ACCURACY</div>
                            </div>
                            <div className="text-center p-2 bg-green-500/5 border border-green-500/20 rounded">
                              <div className="text-lg font-bold text-blue-400 font-mono">{user.streak ?? 1}</div>
                              <div className="text-green-400/60 text-xs font-mono">STREAK</div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2">
                            <Link href="/stats" onClick={() => setShowUserCard(false)}>
                              <motion.button
                                className="w-full flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 transition-colors font-mono text-sm rounded"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <BarChart3 className="w-4 h-4" />
                                VIEW_DETAILED_STATS
                              </motion.button>
                            </Link>

                            <motion.button
                              onClick={() => {
                                handleLogout()
                                setShowUserCard(false)
                              }}
                              className="w-full flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors font-mono text-sm rounded"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <LogOut className="w-4 h-4" />
                              DISCONNECT_NEURAL_LINK
                            </motion.button>
                          </div>
                        </div>

                        {/* Level Progress Bar */}
                        <div className="px-4 pb-4">
                          <div className="text-green-400/60 text-xs font-mono mb-2">LEVEL_PROGRESS</div>
                          <div className="bg-green-500/20 rounded-full h-2 overflow-hidden">
                            <motion.div
                              className="h-full bg-green-500"
                              initial={{ width: 0 }}
                              animate={{ width: `${(user.level % 10) * 10 + 35}%` }}
                              transition={{ duration: 1, delay: 0.2 }}
                            />
                          </div>
                          <div className="text-green-400/40 text-xs font-mono mt-1">
                            {Math.floor((user.level % 10) * 10 + 35)}% to next level
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <Link href="/auth">
                <motion.div
                  className={`text-green-400/70 hover:text-green-400 transition-colors relative flex items-center gap-2 cursor-pointer ${pathname === "/auth" ? "text-green-400" : ""
                    }`}
                  onHoverStart={() => setHovered("auth")}
                  onHoverEnd={() => setHovered(null)}
                  whileHover={{ scale: 1.1 }}
                >
                  <LogIn className="w-4 h-4" />
                  LOGIN
                  {(hovered === "auth" || pathname === "/auth") && (
                    <motion.div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-green-400" layoutId="underline" />
                  )}
                </motion.div>
              </Link>
            )}

            <Link href="/typing">
              <motion.button
                className="px-6 py-2 bg-green-500/20 border border-green-500 text-green-400 hover:bg-green-500/30 transition-colors relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="w-4 h-4 inline mr-2" />
                [ENTER] START
                <div className="absolute inset-0 bg-green-500/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
