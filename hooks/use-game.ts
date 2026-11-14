"use client"

import { useReducer } from "react"
import {
  type ClueId,
  type EndingId,
  type ItemId,
  type LocationId,
  type Supplies,
  type SupplyId,
  CLUES,
  DRAFT_DAMAGE,
  DREAD_MAX,
  FLAME_DRAIN_PER_SECOND,
  FLAME_MAX,
  ITEMS,
  LIGHTER_SUCCESS,
  LOCATION_MAP,
  MATCH_FLAME,
  QUESTIONS,
  SEARCH_COST,
  STARTING_OIL,
  STARTING_SUPPLIES,
  SUPPLY_LABELS,
  TORCH_SECONDS,
} from "@/lib/game-data"

export type Phase = "title" | "playing" | "reckoning" | "ending"
export type LightSource = "lighter" | "match" | "torch"

export interface Discovery {
  key: number
  text: string
  found?: string
}

export interface GameState {
  phase: Phase
  location: LocationId
  oil: number
  maxOil: number
  flame: number
  torchTime: number
  dread: number
  supplies: Supplies
  searched: string[]
  clues: ClueId[]
  items: ItemId[]
  visited: LocationId[]
  discovery: Discovery | null
  relightNotice: Discovery | null
  ending: EndingId | null
  score: number
}

type Action =
  | { type: "start" }
  | { type: "tick" }
  | { type: "travel"; to: LocationId; roll: number }
  | { type: "search"; spotId: string }
  | { type: "relight"; source: LightSource; roll: number }
  | { type: "climb" }
  | { type: "answer"; answers: Record<string, string> }
  | { type: "restart" }

const initialState: GameState = {
  phase: "title",
  location: "square",
  oil: STARTING_OIL,
  maxOil: STARTING_OIL,
  flame: FLAME_MAX,
  torchTime: 0,
  dread: 0,
  supplies: STARTING_SUPPLIES,
  searched: [],
  clues: [],
  items: [],
  visited: ["square"],
  discovery: null,
  relightNotice: null,
  ending: null,
  score: 0,
}

let noticeKey = 0
const notice = (text: string, found?: string): Discovery => ({ key: ++noticeKey, text, found })

const SOURCE_SUPPLY: Record<LightSource, SupplyId> = { lighter: "fluid", match: "matches", torch: "torches" }

function snuffed(state: GameState, text: string): GameState {
  return { ...state, flame: 0, torchTime: 0, dread: 0, relightNotice: notice(text) }
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "start":
      return { ...initialState, phase: "playing" }

    case "restart":
      return initialState

    case "tick": {
      if (state.phase !== "playing") return state

      if (state.flame > 0) {
        if (state.torchTime > 0) return { ...state, torchTime: state.torchTime - 1 }
        const drain = FLAME_DRAIN_PER_SECOND * (LOCATION_MAP[state.location].drain ?? 1)
        const flame = Math.max(0, state.flame - drain)
        if (flame === 0) return snuffed(state, "The flame shrinks to a blue bead, shivers, and goes out.")
        return { ...state, flame }
      }

      const dread = state.dread + 1
      if (dread >= DREAD_MAX) return { ...state, dread, phase: "ending", ending: "darkness" }
      return { ...state, dread }
    }

    case "relight": {
      if (state.flame > 0) return state
      const supply = SOURCE_SUPPLY[action.source]
      if (state.supplies[supply] <= 0) return state
      const supplies = { ...state.supplies, [supply]: state.supplies[supply] - 1 }

      if (action.source === "lighter" && action.roll > LIGHTER_SUCCESS) {
        return {
          ...state,
          supplies,
          relightNotice: notice("The wheel rasps. Sparks scatter and die. Nothing catches.", "The lighter failed"),
        }
      }

      const lit = { ...state, supplies, dread: 0, relightNotice: null }
      if (action.source === "torch") {
        return {
          ...lit,
          flame: FLAME_MAX,
          torchTime: TORCH_SECONDS,
          discovery: notice(
            "You strike the torch. It roars alight, throwing hard orange light across everything — and for a moment, the shapes at the edges of the room flinch away.",
            `Torchlight: the lantern won't burn down for ${TORCH_SECONDS}s`,
          ),
        }
      }
      if (action.source === "match") {
        return {
          ...lit,
          flame: MATCH_FLAME,
          discovery: notice(
            "The match flares. You cup it close and coax the wick back to life. A weak flame, but a flame.",
            "Lantern relit",
          ),
        }
      }
      return {
        ...lit,
        flame: FLAME_MAX,
        discovery: notice("The lighter catches. You touch it to the wick and the dark steps back.", "Lantern relit"),
      }
    }

    case "travel": {
      const target = LOCATION_MAP[action.to]
      if (target.requires && !state.items.includes(target.requires)) {
        return { ...state, discovery: notice(target.lockedText ?? "The way is shut.") }
      }
      const moved: GameState = {
        ...state,
        location: action.to,
        visited: state.visited.includes(action.to) ? state.visited : [...state.visited, action.to],
        discovery: null,
      }

      const lit = state.flame > 0 && state.torchTime === 0
      if (lit && target.draftChance && action.roll < target.draftChance) {
        const flame = Math.max(0, state.flame - DRAFT_DAMAGE)
        if (flame === 0) return snuffed(moved, "A cold draft slides through the doorway and pinches your flame out.")
        return {
          ...moved,
          flame,
          discovery: notice("A cold draft slides through the doorway. Your flame bends almost flat.", `Flame -${DRAFT_DAMAGE}`),
        }
      }
      return moved
    }

    case "search": {
      const location = LOCATION_MAP[state.location]
      const spot = location.spots.find((s) => s.id === action.spotId)
      const searchKey = `${state.location}:${action.spotId}`
      if (!spot || state.searched.includes(searchKey) || state.oil <= 0 || state.flame <= 0) return state

      const oil = Math.min(state.maxOil + 8, Math.max(0, state.oil - SEARCH_COST + (spot.oilChange ?? 0)))
      const clues = spot.clue && !state.clues.includes(spot.clue) ? [...state.clues, spot.clue] : state.clues
      const items = spot.item && !state.items.includes(spot.item) ? [...state.items, spot.item] : state.items
      const supplies = { ...state.supplies }
      for (const [id, amount] of Object.entries(spot.supplies ?? {}) as [SupplyId, number][]) {
        supplies[id] += amount
      }

      const foundParts: string[] = []
      if (spot.clue) foundParts.push(`Journal: ${CLUES[spot.clue].title}`)
      if (spot.item) foundParts.push(`Taken: ${ITEMS[spot.item].name}`)
      for (const [id, amount] of Object.entries(spot.supplies ?? {}) as [SupplyId, number][]) {
        foundParts.push(`+${amount} ${amount === 1 ? SUPPLY_LABELS[id].one : SUPPLY_LABELS[id].many}`)
      }
      if (spot.oilChange && spot.oilChange > 0) foundParts.push(`Oil +${spot.oilChange}`)
      if (spot.oilChange && spot.oilChange < 0) foundParts.push(`Oil ${spot.oilChange}`)

      const flame = Math.max(0, Math.min(FLAME_MAX, state.flame + (spot.flameChange ?? 0)))
      if (spot.flameChange && flame > 0) foundParts.push(`Flame ${spot.flameChange}`)

      const next: GameState = {
        ...state,
        oil,
        flame,
        clues,
        items,
        supplies,
        searched: [...state.searched, searchKey],
        discovery: notice(spot.text, foundParts.join(" · ") || undefined),
      }

      if (oil <= 0) return { ...next, phase: "ending", ending: "darkness" }
      if (flame === 0) return snuffed(next, "Your lantern is out. Somewhere close, something exhales.")
      return next
    }

    case "climb": {
      if (state.location !== "chapel" || !state.items.includes("belfryKey") || state.flame <= 0) return state
      return { ...state, phase: "reckoning", discovery: null }
    }

    case "answer": {
      const score = QUESTIONS.filter((q) => action.answers[q.id] === q.answer).length
      const hasRegister = state.items.includes("register")
      let ending: EndingId = "forgotten"
      if (score === QUESTIONS.length && hasRegister) ending = "remembered"
      else if (score >= QUESTIONS.length - 2) ending = "echoes"
      return { ...state, phase: "ending", ending, score }
    }
  }
}

export function useGame() {
  return useReducer(reducer, initialState)
}
