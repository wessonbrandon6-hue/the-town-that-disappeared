"use client"

import { useEffect, useRef, useState } from "react"
import { DARK_WHISPERS, WHISPERS } from "@/lib/game-data"

interface AtmosphereProps {
  /** 0 = full light, 1 = as dark as it gets while the lantern is still lit. */
  darkness?: number
  /** The lantern is out: the screen fades to black except for a faint circle where you look. */
  blackout?: boolean
  whispers?: boolean
}

interface Whisper {
  id: number
  text: string
  top: number
  left: number
}

export function Atmosphere({ darkness = 0, blackout = false, whispers = false }: AtmosphereProps) {
  const [active, setActive] = useState<Whisper | null>(null)
  const blackoutRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!whispers) return
    const pool = blackout ? DARK_WHISPERS : WHISPERS
    const interval = window.setInterval(
      () => {
        if (!blackout && Math.random() > 0.55) return
        setActive({
          id: Date.now(),
          text: pool[Math.floor(Math.random() * pool.length)],
          top: 10 + Math.random() * 55,
          left: 5 + Math.random() * 70,
        })
      },
      blackout ? 2600 : 7000,
    )
    return () => window.clearInterval(interval)
  }, [whispers, blackout])

  useEffect(() => {
    const node = blackoutRef.current
    if (!node) return
    const onMove = (event: PointerEvent) => {
      node.style.setProperty("--mx", `${event.clientX}px`)
      node.style.setProperty("--my", `${event.clientY}px`)
    }
    window.addEventListener("pointermove", onMove)
    return () => window.removeEventListener("pointermove", onMove)
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <div className="fog-layer absolute -inset-[20%]" />
      <div className="fog-layer fog-layer-slow absolute -inset-[20%] opacity-70" />
      <div className="grain absolute -inset-[50%] opacity-[0.07] mix-blend-overlay" />
      <div
        className="absolute inset-0 transition-[background] duration-1000"
        style={{
          background: `radial-gradient(ellipse at 50% 45%, transparent ${Math.max(10, 55 - darkness * 45)}%, hsl(200 28% 3% / ${0.55 + darkness * 0.4}) 100%)`,
        }}
      />
      <div
        ref={blackoutRef}
        className="absolute inset-0 transition-opacity ease-in"
        style={{
          opacity: blackout ? 1 : darkness * 0.35,
          transitionDuration: blackout ? "3500ms" : "1000ms",
          background:
            "radial-gradient(circle at var(--mx, 50%) var(--my, 40%), hsl(200 28% 3% / 0.35) 0, hsl(200 28% 3% / 0.9) 140px, hsl(200 30% 2% / 0.985) 340px)",
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
