import React from "react"

export default function CyberMatrixLoading({ text = "LOADING", lines = 20, className = "" }: { text?: string, lines?: number, className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] ${className}`}>
      <div className="relative w-full flex flex-col items-center">
        <div className="absolute inset-0 z-0 animate-pulse pointer-events-none">
          <div className="w-full h-64 bg-black/90 rounded-lg overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-green-500/10 animate-pulse" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-mono text-green-400 text-4xl tracking-widest animate-pulse select-none">
                <span className="cyber-matrix-text">{text}</span>
              </div>
              <div className="mt-4 flex gap-1">
                {[...Array(lines)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-green-400/70 font-mono text-lg animate-bounce`}
                    style={{ animationDelay: `${i * 0.07}s`  }}
                    translate="no"
                  >
                    {String.fromCharCode(0x30A0 + ((i * 7) % 96))} 
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>{`
          .cyber-matrix-text {
            text-shadow: 0 0 10px #22c55e, 0 0 40px #22c55e44, 0 0 80px #22c55e22;
            letter-spacing: 0.2em;
          }
        `}</style>
      </div>
    </div>
  )
}
