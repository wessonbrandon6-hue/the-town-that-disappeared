"use client"

import { useEffect, useRef } from "react"
import { FlameKindling, Sparkles, Zap } from "lucide-react"
import type { Discovery, LightSource } from "@/hooks/use-game"
import type { Supplies } from "@/lib/game-data"
import { DREAD_MAX, LIGHTER_SUCCESS, MATCH_FLAME, TORCH_SECONDS } from "@/lib/game-data"
import { cn } from "@/lib/utils"

interface RelightPanelProps {
  supplies: Supplies
  dread: number
  notice: Discovery | null
  onRelight: (source: LightSource) => void
}

export function RelightPanel({ supplies, dread, notice, onRelight }: RelightPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const dreadRatio = Math.min(1, dread / DREAD_MAX)
  const nothingLeft = supplies.fluid + supplies.matches + supplies.torches === 0

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  const options: {
    source: LightSource
    label: string
    detail: string
    count: number
    icon: React.ReactNode
  }[] = [
    {
      source: "lighter",
      label: "Flick the lighter",
      detail: `${Math.round(LIGHTER_SUCCESS * 100)}% chance · full flame`,
      count: supplies.fluid,
      icon: <Zap className="h-5 w-5" aria-hidden="true" />,
    },
    {
      source: "match",
      label: "Strike a match",
      detail: `Always lights · ${MATCH_FLAME}% flame`,
      count: supplies.matches,
      icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
    },
    {
      source: "torch",
      label: "Light a torch",
      detail: `Full flame · no burn for ${TORCH_SECONDS}s`,
      count: supplies.torches,
      icon: <FlameKindling className="h-5 w-5" aria-hidden="true" />,
    },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="relight-heading"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 md:bottom-8"
    >
      <div className={cn("rise w-full max-w-2xl border border-border bg-background/95 p-5 md:p-6", dreadRatio > 0.6 && "tremble")}>
        <h2
          id="relight-heading"
          ref={headingRef}
          tabIndex={-1}
          className="font-serif text-3xl leading-none text-foreground focus:outline-none md:text-4xl"
        >
          Your lantern has gone out
        </h2>

        <div aria-live="assertive" className="mt-3 min-h-[1.75rem]">
          {notice && (
            <p key={notice.key} className="rise font-serif text-lg italic text-foreground/80">
              {notice.text}
              {notice.found && (
                <span className="ml-2 font-mono text-xs not-italic uppercase tracking-widest text-destructive">
                  {notice.found}
                </span>
              )}
            </p>
          )}
        </div>

        <div className="mt-4">
          <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-destructive">
            <span>Something is coming closer</span>
            <span className="tabular-nums">{Math.max(0, DREAD_MAX - dread)}s</span>
          </div>
          <div
            role="meter"
            aria-label="The Quiet Man's approach"
            aria-valuemin={0}
            aria-valuemax={DREAD_MAX}
            aria-valuenow={dread}
            className="mt-1 h-1 overflow-hidden bg-muted"
          >
            <div className="h-full bg-destructive transition-all duration-1000 ease-linear" style={{ width: `${dreadRatio * 100}%` }} />
          </div>
        </div>

        {nothingLeft ? (
          <p className="mt-5 font-serif text-lg italic text-destructive">
            {"You pat your pockets. Nothing. No flint, no match, no flame. The dark has all the time in the world."}
          </p>
        ) : (
          <ul className="mt-5 grid gap-2 sm:grid-cols-3">
            {options.map((option) => (
              <li key={option.source}>
                <button
                  type="button"
                  disabled={option.count <= 0}
                  onClick={() => onRelight(option.source)}
                  className="flex h-full w-full flex-col items-start gap-2 border border-border bg-card/80 px-4 py-3 text-left transition-colors hover:border-primary/70 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-border disabled:hover:bg-card/80"
                >
                  <span className="flex w-full items-center justify-between text-primary">
                    {option.icon}
                    <span className="font-mono text-sm tabular-nums text-foreground">x{option.count}</span>
                  </span>
                  <span className="font-serif text-lg leading-tight text-foreground">{option.label}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {option.detail}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
