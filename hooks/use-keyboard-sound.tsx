import { useEffect } from "react";

// Extend the Window interface to include webkitAudioContext
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export function useKeyboardSoundEffect() {
  useEffect(() => {
    // Safely choose AudioContext implementation
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      console.warn("Web Audio API is not supported in this browser.");
      return;
    }

    const context = new AudioCtx();

    const playKeySound = () => {
      if (context.state === "suspended") {
        context.resume().catch((err) => console.error("Failed to resume AudioContext", err));
      }

      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.frequency.value = 800 + Math.random() * 400;
      oscillator.type = "square";

      gainNode.gain.setValueAtTime(0.1, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

      oscillator.start();
      oscillator.stop(context.currentTime + 0.1);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        playKeySound();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
      context.close();
    };
  }, []);
}
