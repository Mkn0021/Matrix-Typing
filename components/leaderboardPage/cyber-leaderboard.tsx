"use client"

import Image from 'next/image';
import { motion } from "framer-motion"
import { Zap, Target, Crown, Medal, Award } from "lucide-react"
import { useState, useEffect } from "react"
import CyberMatrixLoading from "../cyber-matrix-loading"
import { useUser } from '@/context/UserContext';
import { useGlobalMessage } from '@/components/global-message';
import { LeaderboardEntry } from '@/lib/types';

export default function CyberLeaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<"daily" | "weekly" | "monthly" | "alltime">("alltime")
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { showMessage } = useGlobalMessage();
  const { user } = useUser()


  useEffect(() => {
    let endpoint = "/api/leaderboard/alltime"
    if (selectedPeriod === "daily") endpoint = "/api/leaderboard/daily"
    else if (selectedPeriod === "weekly") endpoint = "/api/leaderboard/weekly"
    else if (selectedPeriod === "monthly") endpoint = "/api/leaderboard/monthly"
    setLoading(true)
    fetch(endpoint)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch leaderboard")
        const data = await res.json()
        // If API returns { scores: LeaderboardEntry[] }, extract scores
        setLeaderboardData(Array.isArray(data.scores) ? data.scores : data)
      })
      .catch((e) => showMessage({ type: 'error', message: e.message }))
      .finally(() => setLoading(false))
  }, [showMessage, selectedPeriod])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 3:
        return <Award className="w-6 h-6 text-orange-400" />
      default:
        return <span className="text-green-400 font-bold text-lg">#{rank}</span>
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 px-4 relative"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]">
            CYBER_LEADERBOARD
          </h1>
          <div className="text-green-300 font-mono text-lg">{" >"} TOP NEURAL INTERFACE OPERATORS</div>
        </motion.div>

        {/* Loading State - Cyber Matrix Style */}
        {loading ? (
          <CyberMatrixLoading />
        ) : (
          <>
            {/* Period selector */}
            <div className="flex justify-center mb-8">
              <div className="bg-black/80 border border-green-500/50 rounded-lg p-2 flex gap-2">
                {['daily', 'weekly', 'monthly', 'alltime'].map((period) => (
                  <motion.button
                    key={period}
                    onClick={() => setSelectedPeriod(period as 'daily' | 'weekly' | 'monthly' | 'alltime')}
                    className={`px-4 py-2 font-mono text-sm transition-colors ${selectedPeriod === period
                      ? "bg-green-500/20 text-green-400 border border-green-500/50"
                      : "text-green-400/60 hover:text-green-400"
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {period.toUpperCase()}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Top 3 podium */}
            <div className="grid grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              {leaderboardData.slice(0, 3).map((player, index) => (
                <motion.div
                  key={player.id || player.userId || index}
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className={`text-center ${index === 0 ? "order-2" : index === 1 ? "order-1" : "order-3"}`}
                >
                  <div
                    className={`bg-black/90 border-2 rounded-lg p-6 relative overflow-hidden ${index === 0
                      ? "border-yellow-500 shadow-[0_0_30px_rgba(255,215,0,0.3)] h-80"
                      : index === 1
                        ? "border-gray-400 shadow-[0_0_20px_rgba(192,192,192,0.3)] h-72 mt-8"
                        : "border-orange-500 shadow-[0_0_20px_rgba(255,165,0,0.3)] h-72 mt-8"
                      }`}
                  >
                    {/* Holographic effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/10 animate-pulse" />

                    <div className="relative z-10">
                      <Image
                        src={player.user.image || "/placeholder-user.jpg"}
                        alt={player.user.username}
                        width={index === 0 ? 60 : 44}   // w-16 = 64px, w-12 = 48px
                        height={index === 0 ? 60 : 44}  // same
                        className={`rounded-full object-cover mx-auto border-2 border-green-400 shadow mb-2`}
                      />
                      <div className="flex justify-center mb-3">{getRankIcon(player.rank!)}</div>
                      <div className="text-green-400 font-mono font-bold text-lg mb-2">{player.user.username}</div>
                      <div className="text-green-300 text-sm mb-4">
                        LVL.{player.user.level} | {player.user.country}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-green-400 font-mono">{player.wpm} WPM</span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Target className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 font-mono">{player.accuracy}%</span>
                        </div>
                        <div className="text-green-400/60 text-xs font-mono">{player.user.streak} day streak</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Full leaderboard */}
            <div className="bg-black/90 border border-green-500/50 rounded-lg overflow-hidden">
              <div className="bg-green-500/10 border-b border-green-500/30 p-4">
                <div className="grid grid-cols-7 place-items-center text-green-400 font-mono text-sm font-bold">
                  <div>RANK</div>
                  <div>OPERATOR</div>
                  <div>WPM</div>
                  <div>ACCURACY</div>
                  <div>LEVEL</div>
                  <div>STREAK</div>
                  <div>TESTS</div>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {leaderboardData.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="grid grid-cols-7 place-items-center p-4 border-b border-green-500/20 hover:bg-green-500/5 transition-colors text-center"
                  >
                    <div className="flex justify-center items-center">
                      {getRankIcon(player.rank!)}
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-green-400 font-mono font-bold">{player.user.username}</div>
                      <div className="text-green-400/60 text-xs">{player.user.country}</div>
                    </div>
                    <div className="text-green-400 font-mono font-bold">{player.wpm}</div>
                    <div className="text-green-400 font-mono">{player.accuracy}%</div>
                    <div className="text-green-400 font-mono">{player.user.level}</div>
                    <div className="text-green-400/80 font-mono text-sm">{player.user.streak}d</div>
                    <div className="text-green-400/60 font-mono text-sm">{player.user.totalTests}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Your rank */}
            {user?.rank !== undefined && user?.rank !== null && user?.rank !== -1 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-8 bg-green-500/10 border border-green-500/50 rounded-lg p-4"
              >
                <div className="text-center">
                  <div className="text-green-400 font-mono text-sm mb-2">{" >"} YOUR_CURRENT_RANK</div>
                  <div className="text-2xl font-bold text-green-400 font-mono">{user?.rank}</div>
                  <div className="text-green-400/60 text-sm font-mono">Keep training to climb the ranks!</div>
                </div>
              </motion.div>
            ) : (
              <div style={{ height: 48 }} />
            )}
          </>
        )}
      </div>
    </motion.section>
  )
}
