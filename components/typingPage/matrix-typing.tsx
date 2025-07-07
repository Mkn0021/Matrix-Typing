"use client"

import { shortWords, mediumWords, longWords } from "@/lib/google-words-lists"
import { useUser } from '@/context/UserContext';
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Timer, Target, Zap, RotateCcw, Settings, Play, Trophy } from "lucide-react"

interface TypingStats {
  wpm: number
  accuracy: number
  timeElapsed: number
  wordsCompleted: number
  correctChars: number
  totalChars: number
}

type GameMode = "time" | "words"

interface GameResult {
  wpm: number
  accuracy: number
  timeElapsed: number
  wordsCompleted: number
  mode: GameMode
  target: number
}

export default function MatrixTyping() {
  const [words, setWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [stats, setStats] = useState<TypingStats>({
    wpm: 0,
    accuracy: 100,
    timeElapsed: 0,
    wordsCompleted: 0,
    correctChars: 0,
    totalChars: 0,
  })
  const [startTime, setStartTime] = useState<number | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [gameMode, setGameMode] = useState<GameMode>("time")
  const [timeLimit, setTimeLimit] = useState(30)
  const [wordLimit, setWordLimit] = useState(20)
  const [showSettings, setShowSettings] = useState(false)
  const [gameResult, setGameResult] = useState<GameResult | null>(null)
  const [isGameFinished, setIsGameFinished] = useState(false)
  const { refreshUser } = useUser()



  const reverseWord = (word: string) => word.split("").reverse().join("")

  const generateWords = useCallback(() => {
    const shuffled = [...shortWords, ...mediumWords, ...longWords].sort(() => Math.random() - 0.5)
    const wordCount = gameMode === "words" ? wordLimit : 50
    const newWords = shuffled.slice(0, wordCount)
    setWords(newWords)
  }, [gameMode, wordLimit])

  useEffect(() => {
    generateWords()
  }, [generateWords])

  const finishGame = useCallback(() => {
    setIsActive(false)
    setIsGameFinished(true)
    const finalWpm = startTime ? Math.round((stats.wordsCompleted / ((Date.now() - startTime) / 1000)) * 60) : 0
    const finalAccuracy = stats.totalChars > 0 ? Math.round((stats.correctChars / stats.totalChars) * 100) : 100

    setGameResult({
      wpm: finalWpm,
      accuracy: finalAccuracy,
      timeElapsed: stats.timeElapsed,
      wordsCompleted: stats.wordsCompleted,
      mode: gameMode,
      target: gameMode === "time" ? timeLimit : wordLimit,
    })
  }, [startTime, stats.wordsCompleted, stats.totalChars, stats.correctChars, stats.timeElapsed, gameMode, timeLimit, wordLimit])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isActive && startTime && !isGameFinished) {
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000
        const wpm = Math.round((stats.wordsCompleted / elapsed) * 60)
        const accuracy = stats.totalChars > 0 ? Math.round((stats.correctChars / stats.totalChars) * 100) : 100

        setStats((prev) => ({
          ...prev,
          timeElapsed: elapsed,
          wpm: wpm || 0,
          accuracy,
        }))

        // Check if time limit reached (for time mode)
        if (gameMode === "time" && elapsed >= timeLimit) {
          finishGame()
        }
      }, 100)
    }
    return () => clearInterval(interval)
  }, [
    isActive,
    startTime,
    stats.wordsCompleted,
    stats.correctChars,
    stats.totalChars,
    gameMode,
    timeLimit,
    isGameFinished,
    finishGame,
  ])

  // Check if word limit reached (for words mode)
  useEffect(() => {
    if (gameMode === "words" && stats.wordsCompleted >= wordLimit && !isGameFinished) {
      finishGame()
    }
  }, [stats.wordsCompleted, gameMode, wordLimit, isGameFinished, finishGame])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isGameFinished) return

    const value = e.target.value

    if (!isActive && value.length > 0) {
      setIsActive(true)
      setStartTime(Date.now())
    }

    setUserInput(value)

    if (value.endsWith(" ")) {
      const typedWord = value.trim()
      const currentWord = words[currentWordIndex]
      const reversedWord = reverseWord(currentWord)

      const newCorrectChars = typedWord === reversedWord ? stats.correctChars + typedWord.length : stats.correctChars
      const newTotalChars = stats.totalChars + typedWord.length
      const newWordsCompleted = typedWord === reversedWord ? stats.wordsCompleted + 1 : stats.wordsCompleted

      setStats((prev) => ({
        ...prev,
        correctChars: newCorrectChars,
        totalChars: newTotalChars,
        wordsCompleted: newWordsCompleted,
      }))

      // For time mode, generate new word if we're running out
      if (gameMode === "time" && currentWordIndex >= words.length - 5) {
        const moreWords = [...shortWords, ...mediumWords, ...longWords].sort(() => Math.random() - 0.5).slice(0, 20)
        setWords((prev) => [...prev, ...moreWords])
      }

      setCurrentWordIndex((prev) => prev + 1)
      setUserInput("")
    }
  }

  const resetTest = () => {
    setCurrentWordIndex(0)
    setUserInput("")
    setStats({ wpm: 0, accuracy: 100, timeElapsed: 0, wordsCompleted: 0, correctChars: 0, totalChars: 0 })
    setStartTime(null)
    setIsActive(false)
    setIsGameFinished(false)
    setGameResult(null)
    generateWords()
  }

  const getCurrentWordStatus = () => {
    if (!words[currentWordIndex]) return []
    const currentWord = reverseWord(words[currentWordIndex])
    const typed = userInput.replace(" ", "")

    return currentWord.split("").map((char, index) => {
      if (index < typed.length) {
        return {
          char,
          status: typed[index] === char ? "correct" : "incorrect",
        }
      }
      return { char, status: "pending" }
    })
  }

  const getTimeRemaining = () => {
    if (gameMode === "words") return null
    return Math.max(0, timeLimit - stats.timeElapsed)
  }

  const getWordsRemaining = () => {
    if (gameMode === "time") return null
    return Math.max(0, wordLimit - stats.wordsCompleted)
  }

  // Submit gameResult to backend when it is set
  useEffect(() => {
    if (gameResult) {
      // Ensure correct types for game submit API
      const payload = {
        wpm: Number(gameResult.wpm),
        accuracy: Number(gameResult.accuracy),
        timeElapsed: Number(gameResult.timeElapsed),
        wordsCompleted: Number(gameResult.wordsCompleted),
        mode: String(gameResult.mode),
      }
      fetch('/api/game/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          // Optionally handle response
          // console.log('Game submit:', data)
          if (data.success) {
            refreshUser()
          } else {
            console.error('Game submit failed:', data.error)
          }
        })
        .catch((err) => {
          console.error('Game submit error:', err)
        })
    }
  }, [gameResult, refreshUser])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 px-4 relative"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Game Mode Settings */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 bg-black/90 border border-green-500/50 rounded-lg p-6"
            >
              <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">GAME_SETTINGS</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-green-400 font-mono text-sm mb-2">MODE:</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGameMode("time")}
                      className={`px-4 py-2 font-mono text-sm transition-colors ${gameMode === "time"
                        ? "bg-green-500/20 text-green-400 border border-green-500"
                        : "bg-green-500/5 text-green-400/60 border border-green-500/30 hover:text-green-400"
                        }`}
                    >
                      TIME_MODE
                    </button>
                    <button
                      onClick={() => setGameMode("words")}
                      className={`px-4 py-2 font-mono text-sm transition-colors ${gameMode === "words"
                        ? "bg-green-500/20 text-green-400 border border-green-500"
                        : "bg-green-500/5 text-green-400/60 border border-green-500/30 hover:text-green-400"
                        }`}
                    >
                      WORDS_MODE
                    </button>
                  </div>
                </div>

                <div>
                  {gameMode === "time" ? (
                    <>
                      <label className="block text-green-400 font-mono text-sm mb-2">TIME_LIMIT:</label>
                      <div className="flex gap-2">
                        {[15, 30, 60, 120].map((time) => (
                          <button
                            key={time}
                            onClick={() => setTimeLimit(time)}
                            className={`px-3 py-2 font-mono text-sm transition-colors ${timeLimit === time
                              ? "bg-green-500/20 text-green-400 border border-green-500"
                              : "bg-green-500/5 text-green-400/60 border border-green-500/30 hover:text-green-400"
                              }`}
                          >
                            {time}s
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <label className="block text-green-400 font-mono text-sm mb-2">WORD_COUNT:</label>
                      <div className="flex gap-2">
                        {[10, 20, 50, 100].map((count) => (
                          <button
                            key={count}
                            onClick={() => setWordLimit(count)}
                            className={`px-3 py-2 font-mono text-sm transition-colors ${wordLimit === count
                              ? "bg-green-500/20 text-green-400 border border-green-500"
                              : "bg-green-500/5 text-green-400/60 border border-green-500/30 hover:text-green-400"
                              }`}
                          >
                            {count}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats display */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: Timer,
              label: gameMode === "time" ? "TIME_LEFT" : "TIME",
              value:
                gameMode === "time"
                  ? `${Math.floor(getTimeRemaining()! / 60)}:${(getTimeRemaining()! % 60).toFixed(0).padStart(2, "0")}`
                  : `${Math.floor(stats.timeElapsed / 60)}:${(stats.timeElapsed % 60).toFixed(0).padStart(2, "0")}`,
            },
            { icon: Zap, label: "WPM", value: stats.wpm },
            { icon: Target, label: "ACC", value: `${stats.accuracy}%` },
            {
              icon: Trophy,
              label: gameMode === "words" ? "WORDS_LEFT" : "WORDS",
              value: gameMode === "words" ? getWordsRemaining() : stats.wordsCompleted,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/80 border border-green-500/50 rounded-lg p-4 text-center"
            >
              <stat.icon className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-400 font-mono">{stat.value}</div>
              <div className="text-green-400/60 text-sm font-mono">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Main typing interface */}
        <div className="bg-black/90 border border-green-500/50 rounded-lg p-8 relative overflow-hidden">
          {/* Scanning lines */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-green-500/50"
            animate={{ y: [0, 300, 0] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          {/* Words display */}
          <div className="mb-8 min-h-[120px] flex flex-wrap gap-4 justify-center items-center">
            {words.slice(currentWordIndex, currentWordIndex + 6).map((word, index) => (
              <motion.div
                key={`${word}-${currentWordIndex + index}`}
                initial={{ opacity: 0, scale: 0.8, rotateX: -90 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`text-2xl font-mono px-4 py-2 border rounded-lg transition-all duration-300 ${index === 0
                  ? "border-green-500 text-green-400 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  : "border-green-500/30 text-green-400/60"
                  }`}
              >
                {word}
              </motion.div>
            ))}
          </div>

          {/* Current word breakdown */}
          {words[currentWordIndex] && !isGameFinished && (
            <div className="mb-8 text-center">
              <div className="text-green-400/60 font-mono text-sm mb-3">
                {">"} TARGET_SEQUENCE: {words[currentWordIndex]} → {reverseWord(words[currentWordIndex])}
              </div>
              <div className="text-3xl font-mono flex justify-center gap-1 mb-4">
                {getCurrentWordStatus().reverse().map((item, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 border rounded transition-all duration-200 ${item.status === "correct"
                      ? "text-green-400 border-green-500 bg-green-500/20"
                      : item.status === "incorrect"
                        ? "text-red-400 border-red-500 bg-red-500/20"
                        : "text-green-400/40 border-green-500/30"
                      }`}
                  >
                    {item.char}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Input terminal */}
          {!isGameFinished && (
            <div className="relative mb-6">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-400 font-mono">{">"}</div>
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="w-full bg-black border-2 border-green-500/50 rounded-lg pl-12 pr-6 py-4 text-xl font-mono text-green-400 placeholder-green-400/40 focus:outline-none focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all duration-200"
                placeholder="ENTER_REVERSED_SEQUENCE..."
                autoFocus
                disabled={isGameFinished}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-6 bg-green-400 animate-pulse" />
              </div>
            </div>
          )}

          {/* Control panel */}
          <div className="flex justify-center gap-4">
            <motion.button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 px-6 py-3 border border-green-500/50 text-green-400 hover:bg-green-500/10 transition-colors font-mono"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="w-4 h-4" />
              [S] SETTINGS
            </motion.button>

            <motion.button
              onClick={resetTest}
              className="flex items-center gap-2 px-6 py-3 border border-green-500/50 text-green-400 hover:bg-green-500/10 transition-colors font-mono"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="w-4 h-4" />
              [R] RESET_PROTOCOL
            </motion.button>
          </div>
        </div>

        {/* Game Result Modal */}
        <AnimatePresence>
          {gameResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                className="bg-black/95 border border-green-500/50 rounded-lg p-8 max-w-md w-full mx-4 shadow-[0_0_50px_rgba(34,197,94,0.3)]"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-6xl mb-4"
                  >
                    🏆
                  </motion.div>

                  <h2 className="text-3xl font-bold text-green-400 mb-2 font-mono">MISSION_COMPLETE</h2>
                  <div className="text-green-300/80 font-mono text-sm mb-6">NEURAL_PROTOCOL_EXECUTED</div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-yellow-400 font-mono">{gameResult.wpm}</div>
                      <div className="text-green-400/60 text-xs font-mono">WPM</div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400 font-mono">{gameResult.accuracy}%</div>
                      <div className="text-green-400/60 text-xs font-mono">ACCURACY</div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-400 font-mono">{gameResult.wordsCompleted}</div>
                      <div className="text-green-400/60 text-xs font-mono">WORDS</div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-400 font-mono">
                        {Math.floor(gameResult.timeElapsed / 60)}:
                        {(gameResult.timeElapsed % 60).toFixed(0).padStart(2, "0")}
                      </div>
                      <div className="text-green-400/60 text-xs font-mono">TIME</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      onClick={resetTest}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500/20 border border-green-500 text-green-400 hover:bg-green-500/30 transition-colors font-mono"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Play className="w-4 h-4" />
                      RETRY_MISSION
                    </motion.button>

                    <motion.button
                      onClick={() => setGameResult(null)}
                      className="flex-1 px-6 py-3 border border-green-500/50 text-green-400/70 hover:text-green-400 hover:border-green-500/70 transition-colors font-mono"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      CLOSE
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
