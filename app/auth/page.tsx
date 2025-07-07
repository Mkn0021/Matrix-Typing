"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import LoginForm from "@/components/authPage/login-form"
import SignupForm from "@/components/authPage/signup-form"
import { useGlobalMessage } from '@/components/global-message';
import { useKeyboardSoundEffect } from "@/hooks/use-keyboard-sound"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const keyParam = searchParams?.get("key")
  const errorParam = searchParams?.get("error")
  const [isLogin, setIsLogin] = useState(() => keyParam !== "signup")
  const { showMessage } = useGlobalMessage();

  // Show global error if error param exists
  useEffect(() => {
    if (errorParam) {
      showMessage({ type: 'error', message: decodeURIComponent(errorParam) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorParam])

  // Update isLogin state based on key query parameter
  useEffect(() => {
    if (keyParam === "signup") {
      setIsLogin(false)
    } else {
      setIsLogin(true)
    }
  }, [keyParam])

  // Keyboard sound effects
  useKeyboardSoundEffect();

  return (
    <div className="pt-20 px-4 relative flex items-center justify-center min-h-screen">
      {/* Floating geometric shapes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute border border-green-500/20"
          style={{
            width: `${40 + i * 15}px`,
            height: `${40 + i * 15}px`,
            left: `${5 + (i % 4) * 25}%`,
            top: `${15 + Math.floor(i / 4) * 35}%`,
          }}
          animate={{
            rotateX: [0, 360],
            rotateY: [0, -180],
            rotateZ: [0, 180],
          }}
          transition={{
            duration: 20 + i * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}

      <div className="w-full max-w-md relative z-10">
        <AnimatePresence mode="wait">
          {isLogin ? (
            <LoginForm key="login" onSwitchToSignup={() => setIsLogin(false)} />
          ) : (
            <SignupForm key="signup" onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
