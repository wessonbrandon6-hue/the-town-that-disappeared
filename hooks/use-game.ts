"use client"

import { useReducer } from "react"
import {
  type ClueId,
  type EndingId,
  type ItemId,
  type LocationId,
  CLUES,
  ITEMS,
  LOCATION_MAP,
  QUESTIONS,
  SEARCH_COST,
  STARTING_OIL,
} from "@/lib/game-data"

export type Phase = "title" | "playing" | "reckoning" | "ending"

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
  searched: string[]
  clues: ClueId[]
  items: ItemId[]
  visited: LocationId[]
  discovery: Discovery | null
  ending: EndingId | null
  score: number
}

type Action =
  | { type: "start" }
  | { type: "travel"; to: LocationId }
  | { type: "search"; spotId: string }
  | { type: "climb" }
  | { type: "answer"; answers: Record<string, string> }
  | { type: "restart" }

const initialState: GameState = {
  phase: "title",
  location: "square",
  oil: STARTING_OIL,
  maxOil: STARTING_OIL,
  searched: [],
  clues: [],
  items: [],
  visited: ["square"],
  discovery: null,
  ending: null,
  score: 0,
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "start":
      return { ...initialState, phase: "playing" }

    case "restart":
      return initialState

    case "travel": {
      const target = LOCATION_MAP[action.to]
      if (target.requires && !state.items.includes(target.requires)) {
        return { ...state, discovery: { key: Date.now(), text: target.lockedText ?? "The way is shut." } }
      }
      return {
        ...state,
        location: action.to,
        visited: state.visited.includes(action.to) ? state.visited : [...state.visited, action.to],
        discovery: null,
      }
    }

    case "search": {
      const location = LOCATION_MAP[state.location]
      const spot = location.spots.find((s) => s.id === action.spotId)
      const searchKey = `${state.location}:${action.spotId}`
      if (!spot || state.searched.includes(searchKey) || state.oil <= 0) return state

      const oil = Math.min(state.maxOil + 6, Math.max(0, state.oil - SEARCH_COST + (spot.oilChange ?? 0)))
      const clues = spot.clue && !state.clues.includes(spot.clue) ? [...state.clues, spot.clue] : state.clues
      const items = spot.item && !state.items.includes(spot.item) ? [...state.items, spot.item] : state.items

      const foundParts: string[] = []
      if (spot.clue) foundParts.push(`Journal: ${CLUES[spot.clue].title}`)
      if (spot.item) foundParts.push(`Taken: ${ITEMS[spot.item].name}`)
      if (spot.oilChange && spot.oilChange > 0) foundParts.push(`Lantern refilled (+${spot.oilChange})`)
      if (spot.oilChange && spot.oilChange < 0) foundParts.push(`The flame shrinks (${spot.oilChange})`)

      const next: GameState = {
        ...state,
        oil,
        clues,
        items,
        searched: [...state.searched, searchKey],
        discovery: { key: Date.now(), text: spot.text, found: foundParts.join(" · ") || undefined },
      }

      if (oil <= 0) return { ...next, phase: "ending", ending: "darkness" }
      return next
    }

    case "climb": {
      if (state.location !== "chapel" || !state.items.includes("belfryKey")) return state
      return { ...state, phase: "reckoning", discovery: null }
    }

    case "answer": {
      const score = QUESTIONS.filter((q) => action.answers[q.id] === q.answer).length
      const hasRegister = state.items.includes("register")
      let ending: EndingId = "forgotten"
      if (score === QUESTIONS.length && hasRegister) ending = "remembered"
      else if (score >= 3) ending = "echoes"
      return { ...state, phase: "ending", ending, score }
    }
  }
}

export function useGame() {
  return useReducer(reducer, initialState)
}
