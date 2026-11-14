"use client"

import Image from "next/image"
import { Search, Check, ArrowUp } from "lucide-react"
import type { Discovery } from "@/hooks/use-game"
import type { ItemId, Location } from "@/lib/game-data"
import { SEARCH_COST } from "@/lib/game-data"
import { Typewriter } from "./typewriter"
import { cn } from "@/lib/utils"

interface LocationViewProps {
  location: Location
  searched: string[]
  items: ItemId[]
  oil: number
  lit: boolean
  discovery: Discovery | null
  onSearch: (spotId: string) => void
  onClimb: () => void
}

export function LocationView({ location, searched, items, oil, lit, discovery, onSearch, onClimb }: LocationViewProps) {
  const isChapel = location.id === "chapel"
  const hasBelfryKey = items.includes("belfryKey")

  return (
    <article className="flex flex-col">
      <div className="relative aspect-[16/9] w-full overflow-hidden border border-border">
        <Image
          key={location.image}
          src={location.image || "/placeholder.svg"}
          alt={`${location.name}, shrouded in fog`}
          fill
          priority
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="rise object-cover saturate-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <header className="absolute inset-x-0 bottom-0 p-5 md:p-8">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-accent">
            {location.subtitle}
            {location.drain && location.drain > 1 && (
              <span className="ml-3 text-destructive">{`· Flame burns ${location.drain}x faster`}</span>
            )}
          </p>
          <h1 className="mt-1 text-balance font-serif text-4xl leading-none text-foreground md:text-6xl">
            {location.name}
          </h1>
        </header>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <Typewriter
          key={location.id}
          text={location.description}
          className="max-w-3xl cursor-default text-pretty font-serif text-lg leading-relaxed text-foreground/90 md:text-xl"
        />

        <div aria-live="polite" className="min-h-[1px]">
          {discovery && (
            <div key={discovery.key} className="rise max-w-3xl border-l-2 border-primary bg-primary/5 px-5 py-4">
              <p className="text-pretty font-serif text-lg italic leading-relaxed text-foreground">{discovery.text}</p>
              {discovery.found && (
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-primary">{discovery.found}</p>
              )}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Search</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {location.spots.map((spot) => {
              const done = searched.includes(`${location.id}:${spot.id}`)
              return (
                <li key={spot.id}>
                  <button
                    type="button"
                    disabled={done || oil <= 0 || !lit}
                    onClick={() => onSearch(spot.id)}
                    className={cn(
                      "flex h-full w-full items-start gap-3 border px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      done
                        ? "cursor-default border-border/50 text-muted-foreground"
                        : "border-border bg-card/60 text-foreground hover:border-primary/60 hover:bg-primary/10",
                    )}
                  >
                    {done ? (
                      <Check className="mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <Search className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    )}
                    <span className="flex-1">
                      <span className={cn("block font-serif text-lg leading-tight", done && "line-through decoration-border")}>
                        {spot.label}
                      </span>
                      <span className="mt-1 block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        {done ? "Searched" : `-${SEARCH_COST} oil`}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {isChapel && (
          <div className="flex flex-col items-start gap-3 border border-accent/40 bg-accent/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-serif text-lg italic text-foreground/90">
              {hasBelfryKey
                ? "The brass key fits the belfry door. Something waits above, and it already knows you're coming."
                : "A narrow door leads up to the bell tower. It is locked, and the lock is brass."}
            </p>
            <button
              type="button"
              disabled={!hasBelfryKey || !lit}
              onClick={onClimb}
              className="inline-flex shrink-0 items-center gap-2 border border-accent px-5 py-3 font-mono text-xs uppercase tracking-[0.25em] text-accent transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-accent"
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
              Climb to the belfry
            </button>
          </div>
        )}
      </div>
    </article>
  )
}
