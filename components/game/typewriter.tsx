"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TypewriterProps {
  text: string
  speed?: number
  className?: string
}

export function Typewriter({ text, speed = 18, className }: TypewriterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(text.length)
      return
    }
    setCount(0)
    const interval = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          window.clearInterval(interval)
          return c
        }
        return c + 1
      })
    }, speed)
    return () => window.clearInterval(interval)
  }, [text, speed])

  const done = count >= text.length

  return (
    <p className={cn("relative", className)} onClick={() => setCount(text.length)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.slice(0, count)}
        <span className="invisible">{text.slice(count)}</span>
        {!done && <span className="absolute ml-0.5 inline-block h-[1em] w-[2px] translate-y-1 bg-primary/70" />}
      </span>
    </p>
  )
}
