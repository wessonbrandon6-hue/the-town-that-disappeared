export type LocationId = "square" | "store" | "school" | "sheriff" | "manor" | "chapel"

export type ClueId =
  | "vigil"
  | "clock"
  | "candles"
  | "lesson"
  | "drawing"
  | "mine"
  | "bargain"
  | "pact"
  | "returned"
  | "ritual"
  | "register"

export type ItemId = "houseKey" | "belfryKey" | "register"

export interface Clue {
  id: ClueId
  title: string
  text: string
}

export interface Spot {
  id: string
  label: string
  text: string
  clue?: ClueId
  item?: ItemId
  oilChange?: number
}

export interface Location {
  id: LocationId
  name: string
  subtitle: string
  image: string
  description: string
  requires?: ItemId
  lockedText?: string
  spots: Spot[]
}

export const STARTING_OIL = 12
export const SEARCH_COST = 1

export const ITEMS: Record<ItemId, { name: string; text: string }> = {
  houseKey: {
    name: "Tarnished house key",
    text: "A heavy key on a tag stamped with a single letter: W.",
  },
  belfryKey: {
    name: "Brass belfry key",
    text: "Tagged in the sheriff's handwriting: CHAPEL BELFRY — DO NOT RING.",
  },
  register: {
    name: "Register of Souls",
    text: "Two hundred and twelve names. The ink thins every time you look away.",
  },
}

export const CLUES: Record<ClueId, Clue> = {
  vigil: {
    id: "vigil",
    title: "The Harvest Vigil",
    text: "Mayor Whitlock invited every resident to the chapel at midnight on October 31st. \"Bring nothing. Leave nothing.\"",
  },
  clock: {
    id: "clock",
    title: "Stopped at 3:33",
    text: "Every clock in Marrow Falls stopped at the same moment: 3:33 in the morning.",
  },
  candles: {
    id: "candles",
    title: "An odd purchase",
    text: "On October 30th, the Mayor bought thirteen candles, a sack of salt, and forty feet of rope.",
  },
  lesson: {
    id: "lesson",
    title: "The last lesson",
    text: "Miss Pruitt's final lesson: \"A town is only real while someone remembers it.\"",
  },
  drawing: {
    id: "drawing",
    title: "The Quiet Man",
    text: "A child drew a tall figure with a lantern, standing in fog. Caption: \"The Quiet Man wants to be remembered instead of us.\"",
  },
  mine: {
    id: "mine",
    title: "Ashby Mine collapse",
    text: "August 1953. Twelve men lost underground. Among them: Thomas Whitlock, nineteen — the Mayor's only son.",
  },
  bargain: {
    id: "bargain",
    title: "Scratched in the cell",
    text: "Sheriff Ada Crane's last words, carved into the bunk: \"He isn't grieving. He's bargaining.\"",
  },
  pact: {
    id: "pact",
    title: "The Mayor's letter",
    text: "\"To the Quiet: Take our names from the world's tongue. Let every map forget us. Only give me back my Thomas.\"",
  },
  returned: {
    id: "returned",
    title: "Something came home",
    text: "Fresh mud on a miner's boots by Thomas's door. The bed slept in. The deal was kept — in its way.",
  },
  ritual: {
    id: "ritual",
    title: "Thirteen candles",
    text: "A ring of thirteen candles burnt to nothing in the chapel aisle. The pews face the circle, not the altar.",
  },
  register: {
    id: "register",
    title: "The way back",
    text: "Penciled inside the register's cover: \"If the names are spoken aloud at 3:33, the Quiet must give them back.\"",
  },
}

export const LOCATIONS: Location[] = [
  {
    id: "square",
    name: "Town Square",
    subtitle: "Where the road ends",
    image: "/images/square.png",
    description:
      "The fog is thick enough to taste. Laundry still hangs between the houses. A dry fountain sits at the heart of the square, and above it the tower clock has stopped. No birds. No wind. Marrow Falls is holding its breath.",
    spots: [
      {
        id: "board",
        label: "Read the notice board",
        text: "Most posters have faded to blank paper. One is fresh, as if pinned this morning.",
        clue: "vigil",
      },
      {
        id: "clock",
        label: "Study the tower clock",
        text: "The hands haven't moved. You check your own watch. It has stopped too.",
        clue: "clock",
      },
      {
        id: "fountain",
        label: "Search the dry fountain",
        text: "Among the pennies and a child's ribbon, your fingers close on something cold and heavy.",
        item: "houseKey",
      },
    ],
  },
  {
    id: "store",
    name: "General Store",
    subtitle: "Open, and empty",
    image: "/images/store.png",
    description:
      "The bell over the door doesn't ring when you push it. Shelves are fully stocked. The register drawer hangs open, untouched. Whoever left here left in a hurry — or didn't leave at all.",
    spots: [
      {
        id: "counter",
        label: "Check behind the counter",
        text: "A tin of lamp oil, unopened. You refill your lantern and the shadows draw back a little.",
        oilChange: 6,
      },
      {
        id: "ledger",
        label: "Read the credit ledger",
        text: "The last entry is in a trembling hand. The name at the top of the page: E. Whitlock.",
        clue: "candles",
      },
      {
        id: "backroom",
        label: "Open the back room",
        text: "Footprints in the flour dust lead in. None lead out. You close the door gently, as if something might be sleeping.",
      },
    ],
  },
  {
    id: "school",
    name: "Schoolhouse",
    subtitle: "Class dismissed",
    image: "/images/school.png",
    description:
      "Twenty small desks. Twenty small coats on twenty hooks. The chalkboard has been wiped clean except for one line, which no one seems to have been able to erase.",
    spots: [
      {
        id: "chalkboard",
        label: "Read the chalkboard",
        text: "The chalk is pressed so hard into the slate it has scored it.",
        clue: "lesson",
      },
      {
        id: "drawings",
        label: "Look at the drawings",
        text: "Most are crayon houses and dogs. One is different. Every child drew the same figure.",
        clue: "drawing",
      },
      {
        id: "desk",
        label: "Open the teacher's desk",
        text: "Graded papers, all marked with an A. The children's names on them have faded to nothing.",
      },
    ],
  },
  {
    id: "sheriff",
    name: "Sheriff's Office",
    subtitle: "Duty unfinished",
    image: "/images/sheriff.png",
    description:
      "A cup of coffee sits on the desk, a skin of dust on its surface. The cell door hangs open. Sheriff Ada Crane's hat is still on its peg.",
    spots: [
      {
        id: "reports",
        label: "Read the incident reports",
        text: "A thick file is pinned under the coffee cup. The mine. Always the mine.",
        clue: "mine",
      },
      {
        id: "cell",
        label: "Inspect the open cell",
        text: "Someone locked themselves in from the inside. Words are gouged into the wooden bunk.",
        clue: "bargain",
      },
      {
        id: "keys",
        label: "Search the key cabinet",
        text: "Every hook is empty but one. The key hangs alone, as if waiting for you specifically.",
        item: "belfryKey",
      },
    ],
  },
  {
    id: "manor",
    name: "Whitlock House",
    subtitle: "The Mayor's residence",
    image: "/images/manor.png",
    requires: "houseKey",
    lockedText: "The Whitlock front door is locked. The brass plate is engraved with a single letter: W.",
    description:
      "The house is warm. That's the first wrong thing. A fire has burned down to embers in the study grate, and somewhere upstairs a floorboard settles under a weight you can't see.",
    spots: [
      {
        id: "study",
        label: "Search the study desk",
        text: "A letter, never sent. Addressed to no one. It is the Mayor's handwriting.",
        clue: "pact",
      },
      {
        id: "bedroom",
        label: "Enter Thomas's room",
        text: "The photograph on the dresser shows a smiling young miner. His boots by the door are still wet.",
        clue: "returned",
      },
      {
        id: "mirror",
        label: "Look into the mirror",
        text: "Your reflection blinks a moment after you do. Then it smiles. You stumble back and your lantern gutters.",
        oilChange: -2,
      },
    ],
  },
  {
    id: "chapel",
    name: "Chapel of St. Brigid",
    subtitle: "Where they all went",
    image: "/images/chapel.png",
    description:
      "Every pew is full of coats, hats, and shoes — arranged as though their owners stepped out of them mid-hymn. The air is thick with old wax. Above you, the bell tower creaks.",
    spots: [
      {
        id: "aisle",
        label: "Examine the aisle",
        text: "Salt has been poured in a wide ring. Inside it, thirteen puddles of hardened wax.",
        clue: "ritual",
      },
      {
        id: "lectern",
        label: "Open the register at the lectern",
        text: "A parish Register of Souls. Every resident of Marrow Falls is listed. You take it with you.",
        clue: "register",
        item: "register",
      },
      {
        id: "pews",
        label: "Search the pews",
        text: "In a breast pocket: a church bulletin. The hymn numbers are all 333. Someone has written \"forgive me\" in the margin.",
      },
    ],
  },
]

export const LOCATION_MAP = Object.fromEntries(LOCATIONS.map((l) => [l.id, l])) as Record<LocationId, Location>

export interface Question {
  id: string
  prompt: string
  options: { id: string; text: string }[]
  answer: string
}

export const QUESTIONS: Question[] = [
  {
    id: "who",
    prompt: "Who opened the door to the Quiet?",
    options: [
      { id: "crane", text: "Sheriff Ada Crane" },
      { id: "whitlock", text: "Mayor Edmund Whitlock" },
      { id: "pruitt", text: "Miss Pruitt, the schoolteacher" },
      { id: "children", text: "The children of Marrow Falls" },
    ],
    answer: "whitlock",
  },
  {
    id: "what",
    prompt: "What did he offer in the bargain?",
    options: [
      { id: "gold", text: "The gold left in the Ashby Mine" },
      { id: "soul", text: "His own soul" },
      { id: "memory", text: "The town itself — erased from the world's memory" },
      { id: "children", text: "The town's children" },
    ],
    answer: "memory",
  },
  {
    id: "why",
    prompt: "What did he ask for in return?",
    options: [
      { id: "son", text: "His son Thomas, back from the mine" },
      { id: "power", text: "Power over the whole valley" },
      { id: "youth", text: "To never grow old" },
      { id: "revenge", text: "Revenge on the mining company" },
    ],
    answer: "son",
  },
  {
    id: "how",
    prompt: "How is the bargain broken?",
    options: [
      { id: "ring", text: "Ring the bell thirteen times" },
      { id: "burn", text: "Burn the chapel to the ground" },
      { id: "leave", text: "Leave, and never speak of this place" },
      { id: "names", text: "Speak every name aloud at 3:33" },
    ],
    answer: "names",
  },
]

export type EndingId = "remembered" | "echoes" | "forgotten" | "darkness"

export const ENDINGS: Record<EndingId, { title: string; kicker: string; text: string[] }> = {
  remembered: {
    kicker: "The true ending",
    title: "The Town Remembered",
    text: [
      "The tower clock lurches forward to 3:33. You open the register and begin to read.",
      "Ada Crane. Harriet Pruitt. Edmund Whitlock. Thomas Whitlock. Two hundred and twelve names, and with each one the fog thins, and a light comes on somewhere below.",
      "The Quiet Man lowers his lantern. Without a single name to wear, he is only mist, and the wind takes him.",
      "When the bell finally rings, it rings once — the ordinary way — and Marrow Falls wakes up on the morning of November 1st, 1953, as though it had only slept late.",
    ],
  },
  echoes: {
    kicker: "A partial ending",
    title: "Echoes in the Fog",
    text: [
      "You speak what you know, but the truth is not quite whole, and the Quiet hears the gaps.",
      "Some lights return to the windows below. Others stay dark. A few names slide off the register like rain off glass and are gone for good.",
      "You leave at dawn. Years later, you will find Marrow Falls on an old map — smaller than you remember, and missing streets you swear you walked.",
    ],
  },
  forgotten: {
    kicker: "A bad ending",
    title: "You Were Never Here",
    text: [
      "Your answers come out wrong, and the Quiet Man steps closer, lantern raised to your face.",
      "He studies you the way you studied the town: carefully, collecting details. Your name. Your mother's name. The street you grew up on.",
      "Somewhere far away, your desk is cleared. Your mail is returned. Nobody remembers sending you to Marrow Falls — because nobody remembers you at all.",
    ],
  },
  darkness: {
    kicker: "The lantern fails",
    title: "The Dark Keeps What It Takes",
    text: [
      "The flame shrinks to a bead, then to nothing.",
      "In the black, the fog presses close and you hear them at last — two hundred and twelve voices, whispering your name so they won't forget it.",
      "By morning, there is one more coat on the chapel pews.",
    ],
  },
}

export const WHISPERS = [
  "...do you remember us?",
  "...say my name...",
  "...it's 3:33 again...",
  "...he only wanted his boy back...",
  "...don't look in the mirror...",
  "...we're still here...",
  "...ring it and we're gone forever...",
  "...the Quiet is listening...",
]
