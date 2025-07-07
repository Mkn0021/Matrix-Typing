"use client"

import MatrixTyping from "@/components/typingPage/matrix-typing"
import { useKeyboardSoundEffect } from "@/hooks/use-keyboard-sound"

export default function TypingPage() {
  // Keyboard sound effects
  useKeyboardSoundEffect();

  return <MatrixTyping />
}
