import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface LanternMeterProps {
  oil: number
  max: number
}

export function LanternMeter({ oil, max }: LanternMeterProps) {
  const ratio = Math.min(1, oil / max)
  const low = oil <= 3

  return (
    <section aria-labelledby="lantern-heading" className="border border-border bg-card/70 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h2 id="lantern-heading" className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Lantern
        </h2>
        <span className={cn("font-mono text-sm tabular-nums", low ? "text-destructive" : "text-primary")}>
          {oil} oil
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Flame
          aria-hidden="true"
          className={cn("h-6 w-6 shrink-0", low ? "flicker-fast text-destructive" : "flicker text-primary")}
          style={{ opacity: 0.35 + ratio * 0.65 }}
        />
        <div
          role="meter"
          aria-label="Lantern oil remaining"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={oil}
          className="h-1.5 flex-1 overflow-hidden bg-muted"
        >
          <div
            className={cn("h-full transition-all duration-700", low ? "bg-destructive" : "bg-primary")}
            style={{ width: `${ratio * 100}%` }}
          />
        </div>
      </div>
      {low && (
        <p className="mt-3 font-serif text-sm italic text-destructive">{"The flame is guttering. Choose carefully."}</p>
      )}
    </section>
  )
}
