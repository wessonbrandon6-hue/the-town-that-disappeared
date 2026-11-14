"use client"

import { useGame } from "@/hooks/use-game"
import { LOCATION_MAP } from "@/lib/game-data"
import { Atmosphere } from "./atmosphere"
import { TitleScreen } from "./title-screen"
import { LocationView } from "./location-view"
import { TownMap } from "./town-map"
import { Journal } from "./journal"
import { LanternMeter } from "./lantern-meter"
import { Reckoning } from "./reckoning"
import { EndingScreen } from "./ending-screen"

export function TownGame() {
  const [state, dispatch] = useGame()
  const darkness = state.phase === "playing" ? 1 - Math.min(1, state.oil / state.maxOil) : 0

  return (
    <>
      <Atmosphere darkness={darkness} whispers={state.phase === "playing" || state.phase === "reckoning"} />

      {state.phase === "title" && <TitleScreen onStart={() => dispatch({ type: "start" })} />}

      {state.phase === "playing" && (
        <div className="mx-auto flex min-h-dvh max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 lg:flex-row lg:gap-8 lg:py-10">
          <div className="flex-1">
            <LocationView
              location={LOCATION_MAP[state.location]}
              searched={state.searched}
              items={state.items}
              oil={state.oil}
              discovery={state.discovery}
              onSearch={(spotId) => dispatch({ type: "search", spotId })}
              onClimb={() => dispatch({ type: "climb" })}
            />
          </div>
          <aside className="flex flex-col gap-4 lg:sticky lg:top-10 lg:w-80 lg:self-start">
            <LanternMeter oil={state.oil} max={state.maxOil} />
            <TownMap
              current={state.location}
              visited={state.visited}
              items={state.items}
              searched={state.searched}
              onTravel={(to) => dispatch({ type: "travel", to })}
            />
            <Journal clues={state.clues} items={state.items} />
          </aside>
        </div>
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
