"use client"

import { useEffect, useState } from "react"
import { WHISPERS } from "@/lib/game-data"

interface AtmosphereProps {
  darkness?: number
  whispers?: boolean
}

interface Whisper {
  id: number
  text: string
  top: number
  left: number
}

export function Atmosphere({ darkness = 0, whispers = false }: AtmosphereProps) {
  const [active, setActive] = useState<Whisper | null>(null)

  useEffect(() => {
    if (!whispers) return
    const interval = window.setInterval(() => {
      if (Math.random() > 0.55) return
      setActive({
        id: Date.now(),
        text: WHISPERS[Math.floor(Math.random() * WHISPERS.length)],
        top: 10 + Math.random() * 75,
        left: 5 + Math.random() * 70,
      })
    }, 7000)
    return () => window.clearInterval(interval)
  }, [whispers])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <div className="fog-layer absolute -inset-[20%]" />
      <div className="fog-layer fog-layer-slow absolute -inset-[20%] opacity-70" />
      <div className="grain absolute -inset-[50%] opacity-[0.07] mix-blend-overlay" />
      <div
        className="absolute inset-0 transition-[background] duration-1000"
        style={{
          background: `radial-gradient(ellipse at 50% 45%, transparent ${Math.max(15, 55 - darkness * 40)}%, hsl(200 28% 3% / ${0.55 + darkness * 0.4}) 100%)`,
        }}
      />
      {active && (
        <p
          key={active.id}
          className="whisper ghost-glow absolute font-serif text-lg italic text-accent md:text-2xl"
          style={{ top: `${active.top}%`, left: `${active.left}%` }}
        >
          {active.text}
        </p>
      )}
    </div>
  )
}
