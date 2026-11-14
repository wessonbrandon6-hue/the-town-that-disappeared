import Image from "next/image"
import { Flame } from "lucide-react"

interface TitleScreenProps {
  onStart: () => void
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
      <Image
        src="/images/title.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-50 saturate-50"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-8">
        <p className="rise font-mono text-xs uppercase tracking-[0.4em] text-accent">
          Marrow Falls &middot; Pop. 212 &middot; 1953
        </p>
        <h1 className="rise text-balance font-serif text-5xl leading-[0.95] text-foreground md:text-7xl lg:text-8xl [animation-delay:200ms]">
          The Town That <span className="flicker block italic text-primary lantern-glow">Disappeared</span>
        </h1>
        <p className="rise text-pretty font-serif text-lg leading-relaxed text-muted-foreground md:text-xl [animation-delay:500ms]">
          {
            "On Halloween night, every soul in Marrow Falls vanished. The mail stopped. The maps forgot. You've been sent to find out why — with nothing but a lantern and the oil inside it."
          }
        </p>

        <button
          type="button"
          onClick={onStart}
          className="rise group mt-2 inline-flex items-center gap-3 border border-primary/50 bg-primary/10 px-8 py-4 font-mono text-sm uppercase tracking-[0.3em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [animation-delay:800ms]"
        >
          <Flame className="h-4 w-4 flicker" aria-hidden="true" />
          Light the lantern
        </button>

        <ul className="rise mt-6 grid gap-3 text-left font-mono text-xs leading-relaxed text-muted-foreground sm:grid-cols-3 [animation-delay:1100ms]">
          <li className="border-l border-border pl-3">Every search burns oil. When the flame dies, so do you.</li>
          <li className="border-l border-border pl-3">Gather clues in your journal. Some doors need keys.</li>
          <li className="border-l border-border pl-3">Climb the belfry and speak the truth to the Quiet.</li>
        </ul>
      </div>
    </main>
  )
}
