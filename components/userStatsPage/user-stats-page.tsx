"use client"

import { motion } from "framer-motion"
import { Zap, Target, Trophy, Calendar, TrendingUp, Activity, Award, Clock } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { useState, useEffect } from "react"
import CyberMatrixLoading from "../cyber-matrix-loading"
import { useUser } from '@/context/UserContext'
import Image from 'next/image';
import { UserWithStats } from "@/types/user"
import { TypingStats, Achievement } from "@/lib/types"

// Types for chart and activity data
interface WpmDataItem {
  session: number;
  wpm: number;
  accuracy: number;
}

interface SkillDataItem {
  skill: string;
  value: number;
}

interface RecentActivityItem {
  time: string;
  action: string;
  result: string;
}

export default function UserStatsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useUser()
  const [userOverview, setUserOverview] = useState<UserWithStats | null>(null)

  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    setError(null)
    fetch(`/api/users/overview?userId=${encodeURIComponent(user.id)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch user stats")
        const data = await res.json()
        setUserOverview(data.user)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [user?.id])

  // Use userOverview if available, else fallback to context user
  const displayUser: UserWithStats | null = userOverview

  // Prepare stats and chart data from displayUser.stats
  const stats: TypingStats[] = displayUser?.stats || []
  const bestWpm = user?.bestWpm ?? 0
  const avgAccuracy = (user?.bestAccuracy || 0)
  const streak = user?.streak || 1
  const wpmData: WpmDataItem[] = stats.map((s, i) => ({ session: i + 1, wpm: s.wpm, accuracy: s.accuracy }))
  const skillData: SkillDataItem[] = [
    { skill: "Speed", value: bestWpm },
    { skill: "Accuracy", value: Number(avgAccuracy) },
    { skill: "Consistency", value: stats.length ? Math.round(100 - (Math.max(...stats.map((s) => s.wpm)) - Math.min(...stats.map((s) => s.wpm)))) : 0 },
    { skill: "Focus", value: 80 },
    { skill: "Endurance", value: stats.length },
    { skill: "Adaptability", value: 75 },
  ]
  const achievements: Achievement[] = displayUser?.achievements ?? []

  // Prepare recent activity from stats (latest 5)
  const recentActivity: RecentActivityItem[] = stats.slice(-5).reverse().map((s) => ({
    time: new Date(s.createdAt).toLocaleString(),
    action: `Completed speed test`,
    result: `${s.wpm} WPM, ${s.accuracy}% accuracy`,
  }))

  if (loading) return <CyberMatrixLoading text="LOADING USER STATS" />
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>
  if (!displayUser) return null

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 px-4 relative"
    >
      <div className="container mx-auto max-w-7xl">
        {/* User profile header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Image
            src={user?.image ?? "/placeholder-user.jpg"}
            alt={displayUser?.username ?? "User avatar"}
            className="rounded-full object-cover mx-auto border-2 border-green-400 shadow mb-4"
            width={96}    // w-24 = 6 * 16px = 96px
            height={96}   // h-24 = 96px
          />
          <h1 className="text-4xl font-bold text-green-400 drop-shadow-[0_0_20px_rgba(34,197,94,0.5)] mb-2">
            {displayUser?.username}
          </h1>
          <div className="text-green-300 font-mono text-lg">LEVEL.{displayUser?.level} | {displayUser?.country ?? 'XX'}</div>
        </motion.div>

        {/* Stats overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Zap, label: "BEST_WPM", value: bestWpm, color: "text-yellow-400" },
            { icon: Target, label: "AVG_ACCURACY", value: `${avgAccuracy}%`, color: "text-green-400" },
            { icon: Trophy, label: "RANK", value: user?.rank == -1 ? 'N/A' : user?.rank, color: "text-purple-400" },
            { icon: Calendar, label: "STREAK", value: `${streak}d`, color: "text-blue-400" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/90 border border-green-500/50 rounded-lg p-6 text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-green-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative z-10">
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-3xl font-bold text-green-400 font-mono mb-2">{stat.value}</div>
                <div className="text-green-400/60 text-sm font-mono">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* WPM Progress */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/90 border border-green-500/50 rounded-lg p-6"
          >
            <h3 className="text-xl font-bold text-green-400 mb-4 font-mono flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              WPM_PROGRESSION
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={wpmData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#00ff0030" />
                <XAxis dataKey="session" stroke="#00ff0060" />
                <YAxis stroke="#00ff0060" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.9)",
                    border: "1px solid rgba(0,255,0,0.5)",
                    borderRadius: "8px",
                    color: "#00ff00",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="wpm"
                  stroke="#00ff00"
                  strokeWidth={2.5}
                  dot={{ fill: "#00ff00", r: 4, stroke: "#00ff00", strokeWidth: 1 }}
                  activeDot={{ fill: "#00ff00", r: 6, stroke: "#00ff00", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Skill Radar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/90 border border-green-500/50 rounded-lg p-6"
          >
            <h3 className="text-xl font-bold text-green-400 mb-4 font-mono flex items-center gap-2">
              <Activity className="w-5 h-5" />
              SKILL_ANALYSIS
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillData}>
                <PolarGrid stroke="#00ff0030" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: "#00ff0080", fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#00ff0060", fontSize: 10 }} />
                <Radar name="Skills" dataKey="value" stroke="#00ff00" fill="#00ff0020" strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/90 border border-green-500/50 rounded-lg p-6 mb-12"
        >
          <h3 className="text-xl font-bold text-green-400 mb-6 font-mono flex items-center gap-2">
            <Award className="w-5 h-5" />
            ACHIEVEMENTS_UNLOCKED
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement: Achievement, index: number) => {
              const unlocked = Boolean(achievement.unlockedAt);
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className={`p-4 rounded-lg border transition-all duration-300 ${unlocked
                    ? "border-green-500/50 bg-green-500/10 hover:bg-green-500/20"
                    : "border-green-500/20 bg-black/50 opacity-50"
                    }`}
                >
                  <div className="text-center">
                    <Award className="text-green-400 w-8 h-8 mx-auto mb-2" />
                    <div className="text-green-400 font-mono font-bold text-sm mb-1">{achievement.title}</div>
                    <div className="text-green-400/60 text-xs">{achievement.description}</div>
                    {unlocked && <div className="mt-2 text-green-400 text-xs font-mono">✓ UNLOCKED</div>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-black/90 border border-green-500/50 rounded-lg p-6"
        >
          <h3 className="text-xl font-bold text-green-400 mb-6 font-mono flex items-center gap-2">
            <Clock className="w-5 h-5" />
            RECENT_ACTIVITY
          </h3>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <div className="text-green-400/60 font-mono text-center">No recent activity found.</div>
            ) : (
              recentActivity.map((activity: RecentActivityItem, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-green-500/20 rounded-lg hover:bg-green-500/5 transition-colors"
                >
                  <div>
                    <div className="text-green-400 font-mono text-sm">{activity.action}</div>
                    <div className="text-green-400/60 text-xs">{activity.result}</div>
                  </div>
                  <div className="text-green-400/40 text-xs font-mono">{activity.time}</div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
