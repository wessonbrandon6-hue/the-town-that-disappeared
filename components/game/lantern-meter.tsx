import { Droplet, Flame, FlameKindling, Sparkles, Zap } from "lucide-react"
import type { Supplies } from "@/lib/game-data"
import { FLAME_MAX, LOW_FLAME } from "@/lib/game-data"
import { cn } from "@/lib/utils"

interface LanternMeterProps {
  oil: number
  maxOil: number
  flame: number
  torchTime: number
  supplies: Supplies
}

export function LanternMeter({ oil, maxOil, flame, torchTime, supplies }: LanternMeterProps) {
  const flameRatio = flame / FLAME_MAX
  const oilRatio = Math.min(1, oil / maxOil)
  const out = flame <= 0
  const lowFlame = !out && flame <= LOW_FLAME && torchTime === 0
  const lowOil = oil <= 3

  const status = out ? "Out" : torchTime > 0 ? `Torch ${torchTime}s` : lowFlame ? "Guttering" : "Burning"

  return (
    <section aria-labelledby="lantern-heading" className="border border-border bg-card/70 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h2 id="lantern-heading" className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Lantern
        </h2>
        <span
          className={cn(
            "font-mono text-xs uppercase tracking-widest",
            out || lowFlame ? "text-destructive" : torchTime > 0 ? "text-accent" : "text-primary",
          )}
        >
          {status}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Flame
          aria-hidden="true"
          className={cn(
            "h-6 w-6 shrink-0 transition-opacity duration-1000",
            out ? "text-muted-foreground" : lowFlame ? "flicker-fast text-destructive" : "flicker text-primary",
          )}
          style={{ opacity: out ? 0.25 : 0.4 + flameRatio * 0.6 }}
        />
        <div className="flex-1">
          <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <span>Flame</span>
            <span className="tabular-nums">{Math.ceil(flame)}%</span>
          </div>
          <div
            role="meter"
            aria-label="Lantern flame"
            aria-valuemin={0}
            aria-valuemax={FLAME_MAX}
            aria-valuenow={Math.ceil(flame)}
            className="mt-1 h-1.5 overflow-hidden bg-muted"
          >
            <div
              className={cn(
                "h-full transition-all duration-1000 ease-linear",
                lowFlame ? "bg-destructive" : torchTime > 0 ? "bg-accent" : "bg-primary",
              )}
              style={{ width: `${flameRatio * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <Droplet
          aria-hidden="true"
          className={cn("h-6 w-6 shrink-0", lowOil ? "text-destructive" : "text-primary/80")}
        />
        <div className="flex-1">
          <div className="flex justify-between font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            <span>Oil</span>
            <span className="tabular-nums">{oil}</span>
          </div>
          <div
            role="meter"
            aria-label="Lantern oil remaining"
            aria-valuemin={0}
            aria-valuemax={maxOil}
            aria-valuenow={oil}
            className="mt-1 h-1.5 overflow-hidden bg-muted"
          >
            <div
              className={cn("h-full transition-all duration-700", lowOil ? "bg-destructive" : "bg-primary/70")}
              style={{ width: `${oilRatio * 100}%` }}
            />
          </div>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3" aria-label="Fire supplies">
        <SupplyChip icon={<Zap className="h-3.5 w-3.5" aria-hidden="true" />} label="Lighter" count={supplies.fluid} />
        <SupplyChip icon={<Sparkles className="h-3.5 w-3.5" aria-hidden="true" />} label="Matches" count={supplies.matches} />
        <SupplyChip icon={<FlameKindling className="h-3.5 w-3.5" aria-hidden="true" />} label="Torches" count={supplies.torches} />
      </ul>

      {lowFlame && (
        <p className="mt-3 font-serif text-sm italic text-destructive">
          {"The wick is burning down. When it goes, the dark comes in."}
        </p>
      )}
      {!out && lowOil && !lowFlame && (
        <p className="mt-3 font-serif text-sm italic text-destructive">{"Almost out of oil. Choose carefully."}</p>
      )}
    </section>
  )
}

function SupplyChip({ icon, label, count }: { icon: React.ReactNode; label: string; count: number }) {
  return (
    <li className={cn("flex flex-col gap-1", count === 0 && "opacity-40")}>
      <span className="flex items-center gap-1.5 text-primary">
        {icon}
        <span className="font-mono text-sm tabular-nums text-foreground">{count}</span>
      </span>
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
    </li>
  )
}
