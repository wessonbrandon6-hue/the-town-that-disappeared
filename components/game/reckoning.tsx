"use client"

import Image from "next/image"
import { useState } from "react"
import { type ClueId, CLUES, QUESTIONS } from "@/lib/game-data"
import { cn } from "@/lib/utils"

interface ReckoningProps {
  clues: ClueId[]
  onAnswer: (answers: Record<string, string>) => void
}

export function Reckoning({ clues, onAnswer }: ReckoningProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const complete = QUESTIONS.every((q) => answers[q.id])

  return (
    <main className="relative min-h-dvh overflow-hidden">
      <Image src="/images/belfry.png" alt="" fill priority sizes="100vw" className="object-cover opacity-40 saturate-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 lg:flex-row lg:gap-14">
        <div className="flex-1">
          <p className="rise font-mono text-xs uppercase tracking-[0.4em] text-accent">The Belfry &middot; 3:33 AM</p>
          <h1 className="rise mt-3 text-balance font-serif text-5xl leading-none md:text-6xl [animation-delay:150ms]">
            The Quiet Man is <span className="italic text-accent ghost-glow">listening</span>
          </h1>
          <p className="rise mt-5 max-w-xl text-pretty font-serif text-lg leading-relaxed text-muted-foreground [animation-delay:300ms]">
            {
              "A tall shape of fog stands beneath the bell, holding a lantern that gives no light. It wears no face — only the outlines of faces it has taken. It speaks in two hundred voices: \"Tell me what you think you know.\""
            }
          </p>

          <form
            className="mt-10 flex flex-col gap-8"
            onSubmit={(e) => {
              e.preventDefault()
              if (complete) onAnswer(answers)
            }}
          >
            {QUESTIONS.map((q, index) => (
              <fieldset key={q.id} className="rise" style={{ animationDelay: `${450 + index * 120}ms` }}>
                <legend className="font-serif text-2xl text-foreground">
                  <span className="mr-3 font-mono text-sm text-primary">{`0${index + 1}`}</span>
                  {q.prompt}
                </legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((option) => {
                    const selected = answers[q.id] === option.id
                    return (
                      <label
                        key={option.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 border px-4 py-3 font-serif text-lg transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
                          selected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card/60 text-foreground/85 hover:border-primary/50",
                        )}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={option.id}
                          checked={selected}
                          onChange={() => setAnswers((a) => ({ ...a, [q.id]: option.id }))}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={cn(
                            "h-2.5 w-2.5 shrink-0 rotate-45 border",
                            selected ? "border-primary bg-primary" : "border-muted-foreground",
                          )}
                        />
                        {option.text}
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            ))}

            <button
              type="submit"
              disabled={!complete}
              className="self-start border border-primary bg-primary px-8 py-4 font-mono text-sm uppercase tracking-[0.3em] text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-30"
            >
              Speak the truth
            </button>
          </form>
        </div>

        <aside
          aria-labelledby="reckoning-journal"
          className="rise border border-border bg-card/70 p-5 backdrop-blur-sm lg:sticky lg:top-8 lg:w-80 lg:self-start [animation-delay:400ms]"
        >
          <h2 id="reckoning-journal" className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Your journal
          </h2>
          {clues.length === 0 ? (
            <p className="mt-3 font-serif italic text-muted-foreground">{"You came up here with nothing. Brave, or foolish."}</p>
          ) : (
            <ul className="mt-3 flex max-h-[70vh] flex-col gap-3 overflow-y-auto pr-1">
              {clues.map((id) => (
                <li key={id}>
                  <p className="font-serif leading-tight text-foreground">{CLUES[id].title}</p>
                  <p className="font-serif text-sm leading-snug text-muted-foreground">{CLUES[id].text}</p>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>
    </main>
  )
}
