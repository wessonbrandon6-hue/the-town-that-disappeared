"use client"

import { useEffect } from "react"
import { useGame } from "@/hooks/use-game"
import { LOCATION_MAP, LOW_FLAME } from "@/lib/game-data"
import { Atmosphere } from "./atmosphere"
import { TitleScreen } from "./title-screen"
import { LocationView } from "./location-view"
import { TownMap } from "./town-map"
import { Journal } from "./journal"
import { LanternMeter } from "./lantern-meter"
import { RelightPanel } from "./relight-panel"
import { Reckoning } from "./reckoning"
import { EndingScreen } from "./ending-screen"

export function TownGame() {
  const [state, dispatch] = useGame()
  const playing = state.phase === "playing"
  const lit = state.flame > 0

  useEffect(() => {
    if (!playing) return
    const interval = window.setInterval(() => dispatch({ type: "tick" }), 1000)
    return () => window.clearInterval(interval)
  }, [playing, dispatch])

  const lowFlameDarkness = lit && state.torchTime === 0 && state.flame < LOW_FLAME ? 1 - state.flame / LOW_FLAME : 0
  const oilDarkness = 1 - Math.min(1, state.oil / state.maxOil)
  const darkness = playing ? Math.min(1, lowFlameDarkness * 0.75 + oilDarkness * 0.4) : 0

  return (
    <>
      <Atmosphere
        darkness={darkness}
        blackout={playing && !lit}
        whispers={playing || state.phase === "reckoning"}
      />

      {state.phase === "title" && <TitleScreen onStart={() => dispatch({ type: "start" })} />}

      {playing && (
        <div className="mx-auto flex min-h-dvh max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 lg:flex-row lg:gap-8 lg:py-10">
          <div className="flex-1" inert={!lit || undefined}>
            <LocationView
              location={LOCATION_MAP[state.location]}
              searched={state.searched}
              items={state.items}
              oil={state.oil}
              lit={lit}
              discovery={state.discovery}
              onSearch={(spotId) => dispatch({ type: "search", spotId })}
              onClimb={() => dispatch({ type: "climb" })}
            />
          </div>
          <aside className="flex flex-col gap-4 lg:sticky lg:top-10 lg:w-80 lg:self-start" inert={!lit || undefined}>
            <LanternMeter
              oil={state.oil}
              maxOil={state.maxOil}
              flame={state.flame}
              torchTime={state.torchTime}
              supplies={state.supplies}
            />
            <TownMap
              current={state.location}
              visited={state.visited}
              items={state.items}
              searched={state.searched}
              onTravel={(to) => dispatch({ type: "travel", to, roll: Math.random() })}
            />
            <Journal clues={state.clues} items={state.items} />
          </aside>
        </div>
      )}

      {playing && !lit && (
        <RelightPanel
          supplies={state.supplies}
          dread={state.dread}
          notice={state.relightNotice}
          onRelight={(source) => dispatch({ type: "relight", source, roll: Math.random() })}
        />
      )}

      {state.phase === "reckoning" && (
        <Reckoning clues={state.clues} onAnswer={(answers) => dispatch({ type: "answer", answers })} />
      )}

      {state.phase === "ending" && state.ending && (
        <EndingScreen
          ending={state.ending}
          score={state.score}
          cluesFound={state.clues.length}
          onRestart={() => dispatch({ type: "restart" })}
        />
      )}
    </>
  )
}
