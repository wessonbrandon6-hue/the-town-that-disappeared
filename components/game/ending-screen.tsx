import Image from "next/image"
import { RotateCcw } from "lucide-react"
import { type EndingId, CLUES, ENDINGS, QUESTIONS } from "@/lib/game-data"
import { cn } from "@/lib/utils"

interface EndingScreenProps {
  ending: EndingId
  score: number
  cluesFound: number
  onRestart: () => void
}

const ENDING_IMAGE: Record<EndingId, string> = {
  remembered: "/images/title.png",
  echoes: "/images/square.png",
  forgotten: "/images/belfry.png",
  darkness: "/images/chapel.png",
}

export function EndingScreen({ ending, score, cluesFound, onRestart }: EndingScreenProps) {
  const data = ENDINGS[ending]
  const good = ending === "remembered"

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-16">
      <Image
        src={ENDING_IMAGE[ending] || "/placeholder.svg"}
        alt=""
        fill
        priority
        sizes="100vw"
        className={cn("object-cover", good ? "opacity-50 saturate-100" : "opacity-25 grayscale")}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />

      <div className="relative z-10 flex max-w-2xl flex-col gap-6">
        <p className={cn("rise font-mono text-xs uppercase tracking-[0.4em]", good ? "text-primary" : "text-accent")}>
          {data.kicker}
        </p>
        <h1
          className={cn(
            "rise text-balance font-serif text-5xl leading-none md:text-7xl [animation-delay:200ms]",
            good ? "lantern-glow text-primary" : "text-foreground",
          )}
        >
          {data.title}
        </h1>
        <div className="flex flex-col gap-4">
          {data.text.map((paragraph, i) => (
            <p
              key={i}
              className="rise text-pretty font-serif text-lg leading-relaxed text-foreground/85 md:text-xl"
              style={{ animationDelay: `${600 + i * 700}ms` }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <dl
          className="rise mt-4 flex flex-wrap gap-x-10 gap-y-3 border-t border-border pt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground"
          style={{ animationDelay: `${600 + data.text.length * 700}ms` }}
        >
          <div>
            <dt>Clues found</dt>
            <dd className="mt-1 text-lg text-foreground">
              {cluesFound}/{Object.keys(CLUES).length}
            </dd>
          </div>
          {ending !== "darkness" && (
            <div>
              <dt>Truths spoken</dt>
              <dd className="mt-1 text-lg text-foreground">
                {score}/{QUESTIONS.length}
              </dd>
            </div>
          )}
        </dl>

        <button
          type="button"
          onClick={onRestart}
          className="rise inline-flex items-center gap-3 self-start border border-primary/50 px-6 py-3 font-mono text-xs uppercase tracking-[0.3em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ animationDelay: `${900 + data.text.length * 700}ms` }}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Return to Marrow Falls
        </button>
      </div>
    </main>
  )
}
