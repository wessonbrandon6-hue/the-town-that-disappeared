import { Lock } from "lucide-react"
import { type ItemId, type LocationId, LOCATIONS } from "@/lib/game-data"
import { cn } from "@/lib/utils"

interface TownMapProps {
  current: LocationId
  visited: LocationId[]
  items: ItemId[]
  searched: string[]
  onTravel: (id: LocationId) => void
}

export function TownMap({ current, visited, items, searched, onTravel }: TownMapProps) {
  return (
    <nav aria-labelledby="map-heading" className="border border-border bg-card/70 p-4 backdrop-blur-sm">
      <h2 id="map-heading" className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Marrow Falls
      </h2>
      <ul className="mt-3 flex flex-col">
        {LOCATIONS.map((location) => {
          const isCurrent = location.id === current
          const locked = location.requires ? !items.includes(location.requires) : false
          const remaining = location.spots.filter((s) => !searched.includes(`${location.id}:${s.id}`)).length
          return (
            <li key={location.id}>
              <button
                type="button"
                onClick={() => onTravel(location.id)}
                aria-current={isCurrent ? "location" : undefined}
                className={cn(
                  "group flex w-full items-center gap-3 border-l-2 py-2.5 pl-3 pr-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isCurrent
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-transparent text-foreground/80 hover:border-border hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <span className="flex-1">
                  <span className="block font-serif text-lg leading-tight">{location.name}</span>
                  <span className="block font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    {locked ? "Locked" : visited.includes(location.id) ? `${remaining} unsearched` : "Unexplored"}
                  </span>
                </span>
                {locked && <Lock className="h-4 w-4 text-muted-foreground" aria-label="Locked" />}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
