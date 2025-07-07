"use client"

import type React from "react"
import { motion } from "framer-motion"
import { User, Lock, Eye, EyeOff, Terminal } from "lucide-react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useUser } from '@/context/UserContext';
import { useGlobalMessage } from '@/components/global-message';

interface LoginFormProps {
  onSwitchToSignup: () => void
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { refreshUser } = useUser()
  const { showMessage } = useGlobalMessage()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      // Use NextAuth credentials provider (username or email allowed)
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      })
      if (res?.ok) {
        refreshUser()
        showMessage({ type: 'success', message: 'Login successful!' })
        router.push("/")
      } else {
        setError(res?.error || "Login failed")
      }
    } catch (err) {
      const errorMsg = (err instanceof Error) ? err.message : String(err)
      setError(errorMsg)
      showMessage({ type: 'error', message: errorMsg })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    await signIn("google", { callbackUrl: "/" })
    setIsGoogleLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, y: -50, rotateX: 15 }}
      transition={{ duration: 0.8 }}
      className="bg-black/90 border border-green-500/50 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.3)]"
    >
      {/* Terminal header */}
      <div className="bg-green-500/10 border-b border-green-500/30 p-4">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 bg-green-500 rounded-full" />
          </div>
          <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
            <Terminal className="w-4 h-4" />
            neural_login@reversetype:~$
          </div>
        </div>
      </div>

      <div className="p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-green-400 mb-2 font-mono">NEURAL_INTERFACE</h1>
          <div className="text-green-300/80 font-mono text-sm">{">"} AUTHENTICATION_REQUIRED</div>
        </motion.div>

        {/* Google Login Button */}
        <motion.button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full bg-white/10 border border-white/30 text-white py-3 rounded-lg font-mono font-bold hover:bg-white/20 transition-colors relative overflow-hidden group disabled:opacity-50 mb-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="absolute inset-0 bg-white/5 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
          <div className="relative flex items-center justify-center gap-3">
            {isGoogleLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                CONNECTING_TO_GOOGLE...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                [OAUTH] GOOGLE_NEURAL_LINK
              </>
            )}
          </div>
        </motion.button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-green-500/30" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black text-green-400/60 font-mono">OR_USE_MANUAL_AUTH</span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="w-full bg-red-500/10 border border-red-500/40 text-red-400 font-mono rounded-lg px-4 py-3 mb-2 text-center shadow-[0_0_10px_rgba(239,68,68,0.15)]"
            >
              [ERROR] {error}
            </motion.div>
          )}

          {/* Username field */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <label className="block text-green-400 font-mono text-sm mb-2">{">"} USERNAME:</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400/60" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/50 border border-green-500/50 rounded-lg pl-12 pr-4 py-3 text-green-400 font-mono placeholder-green-400/40 focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-200"
                placeholder="enter_username"
                required
              />
            </div>
          </motion.div>

          {/* Password field */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
            <label className="block text-green-400 font-mono text-sm mb-2">{">"} PASSWORD:</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-400/60" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-green-500/50 rounded-lg pl-12 pr-12 py-3 text-green-400 font-mono placeholder-green-400/40 focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-200"
                placeholder="enter_password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400/60 hover:text-green-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>

          {/* Login button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="w-full bg-green-500/20 border border-green-500 text-green-400 py-3 rounded-lg font-mono font-bold hover:bg-green-500/30 transition-colors relative overflow-hidden group disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-green-500/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            <div className="relative flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                  CONNECTING...
                </>
              ) : (
                "[ENTER] INITIATE_LOGIN"
              )}
            </div>
          </motion.button>
        </form>

        {/* Switch to signup */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-6 pt-6 border-t border-green-500/20"
        >
          <div className="text-green-400/60 font-mono text-sm mb-2">{">"} NEW_TO_THE_MATRIX?</div>
          <button
            onClick={onSwitchToSignup}
            className="text-green-400 hover:text-green-300 font-mono text-sm underline transition-colors"
          >
            [CREATE] NEW_NEURAL_LINK
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
