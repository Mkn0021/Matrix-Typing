"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

type GlobalMessage = {
  type: "error" | "success"
  message: string
}

interface GlobalMessageContextType {
  showMessage: (msg: GlobalMessage) => void
}

const GlobalMessageContext = createContext<GlobalMessageContextType | undefined>(undefined)

export function useGlobalMessage() {
  const ctx = useContext(GlobalMessageContext)
  if (!ctx) throw new Error("useGlobalMessage must be used within GlobalMessageProvider")
  return ctx
}

export function GlobalMessageProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<GlobalMessage | null>(null)

  const showMessage = (msg: GlobalMessage) => {
    setMsg(msg)
    setTimeout(() => setMsg(null), 3000)
  }

  return (
    <GlobalMessageContext.Provider value={{ showMessage }}>
      <AnimatePresence>
        {msg && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.4 }}
            className={`fixed top-20 right-0 z-[9999] px-6 py-3 rounded-lg font-mono text-center shadow-lg border
              ${msg.type === "error"
                ? "bg-red-500/10 border-red-500/40 text-red-400"
                : "bg-green-500/10 border-green-500/40 text-green-400"}
            `}
            style={{ minWidth: 280, maxWidth: 400 }}
          >
            {msg.type === "error" ? "[ERROR] " : "[SUCCESS] "}{msg.message}
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </GlobalMessageContext.Provider>
  )
}
