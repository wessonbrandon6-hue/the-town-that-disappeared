import { KeyRound, BookOpen } from "lucide-react"
import { type ClueId, type ItemId, CLUES, ITEMS } from "@/lib/game-data"

interface JournalProps {
  clues: ClueId[]
  items: ItemId[]
}

const TOTAL_CLUES = Object.keys(CLUES).length

export function Journal({ clues, items }: JournalProps) {
  return (
    <section aria-labelledby="journal-heading" className="border border-border bg-card/70 p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <h2 id="journal-heading" className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Journal
        </h2>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {clues.length}/{TOTAL_CLUES} clues
        </span>
      </div>

      {items.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2 border-b border-border pb-3">
          {items.map((id) => (
            <li key={id} className="flex items-start gap-2">
              {id === "register" ? (
                <BookOpen className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              ) : (
                <KeyRound className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              )}
              <div>
                <p className="font-serif text-base leading-tight text-accent">{ITEMS[id].name}</p>
                <p className="font-serif text-sm italic leading-snug text-muted-foreground">{ITEMS[id].text}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {clues.length === 0 ? (
        <p className="mt-3 font-serif text-sm italic text-muted-foreground">
          {"Blank pages. Search the town to fill them."}
        </p>
      ) : (
        <ol className="mt-3 flex max-h-[40vh] flex-col gap-3 overflow-y-auto pr-1">
          {[...clues].reverse().map((id) => (
            <li key={id} className="rise">
              <p className="font-serif text-base leading-tight text-foreground">{CLUES[id].title}</p>
              <p className="font-serif text-sm leading-snug text-muted-foreground">{CLUES[id].text}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
