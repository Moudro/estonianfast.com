import { TOTAL_DAYS } from "@/lib/progress";
const WORDS_PER_DAY = 12;

export type DayLesson = {
  dayNumber: number;
  weekLabel: string;
  title: string;
  subtitle: string;
  estimatedTime: string;
  goal: string;
  lesson: string[];
  practice: string[];
  coreWords: Array<{ et: string; en: string }>;
  speakPrompt: string;
  speakGlossary?: Array<{ et: string; en: string }>;
  review: string[];
};

const WEEK_THEMES = [
  {
    label: "Week 1",
    range: [1, 7] as const,
    focus: "Foundations and sound mapping"
  },
  {
    label: "Week 2",
    range: [8, 14] as const,
    focus: "Core utility language"
  },
  {
    label: "Week 3",
    range: [15, 21] as const,
    focus: "Structured speaking"
  },
  {
    label: "Week 4",
    range: [22, 30] as const,
    focus: "Fluency consolidation"
  }
];

const DAY_FOCUS = [
  "Identity reset and pronunciation baselines",
  "Sound contrast and phrase rhythm",
  "Core greetings and social openers",
  "High-frequency verbs in present tense",
  "Question patterns for everyday use",
  "Practical listening chunks",
  "Week 1 integration",
  "80/20 vocabulary expansion",
  "Useful sentence frames",
  "Transaction language",
  "Navigation and location language",
  "Requests and clarifications",
  "Listening compression drills",
  "Week 2 integration",
  "Output-first speaking routines",
  "Partitive and genitive in context",
  "Time, schedule, and planning language",
  "Work and productivity conversations",
  "Correction loops and error logs",
  "Shadowing for natural rhythm",
  "Week 3 integration",
  "Conversation under light pressure",
  "Topic switching with confidence",
  "Listening speed adaptation",
  "Personal storytelling",
  "Service and travel scenarios",
  "Real-world simulation sets",
  "Self-correction and resilience",
  "Final integration sprint",
  "Performance review and next 30 days"
] as const;

const CORE_80_20_WORDS: Array<{ et: string; en: string }> = [
  { et: "ma", en: "I" },
  { et: "sa", en: "you (singular)" },
  { et: "ta", en: "he / she" },
  { et: "me", en: "we" },
  { et: "te", en: "you (plural/formal)" },
  { et: "nad", en: "they" },
  { et: "on", en: "is / are" },
  { et: "ei", en: "no / not" },
  { et: "jah", en: "yes" },
  { et: "see", en: "this / it" },
  { et: "need", en: "these" },
  { et: "mis", en: "what" },
  { et: "kes", en: "who" },
  { et: "kus", en: "where" },
  { et: "millal", en: "when" },
  { et: "miks", en: "why" },
  { et: "kuidas", en: "how" },
  { et: "siin", en: "here" },
  { et: "seal", en: "there" },
  { et: "nüüd", en: "now" },
  { et: "täna", en: "today" },
  { et: "homme", en: "tomorrow" },
  { et: "eile", en: "yesterday" },
  { et: "kohe", en: "immediately" },
  { et: "vara", en: "early" },
  { et: "hilja", en: "late" },
  { et: "ja", en: "and" },
  { et: "või", en: "or" },
  { et: "aga", en: "but" },
  { et: "sest", en: "because" },
  { et: "ka", en: "also" },
  { et: "väga", en: "very" },
  { et: "ainult", en: "only" },
  { et: "alati", en: "always" },
  { et: "tihti", en: "often" },
  { et: "mõnikord", en: "sometimes" },
  { et: "kunagi", en: "ever / never" },
  { et: "hea", en: "good" },
  { et: "halb", en: "bad" },
  { et: "suur", en: "big" },
  { et: "väike", en: "small" },
  { et: "uus", en: "new" },
  { et: "vana", en: "old" },
  { et: "lihtne", en: "easy" },
  { et: "raske", en: "hard / difficult" },
  { et: "kiire", en: "fast" },
  { et: "aeglane", en: "slow" },
  { et: "inimene", en: "person" },
  { et: "sõber", en: "friend" },
  { et: "pere", en: "family" },
  { et: "laps", en: "child" },
  { et: "töö", en: "work" },
  { et: "kodu", en: "home" },
  { et: "kool", en: "school" },
  { et: "linn", en: "city" },
  { et: "küla", en: "village" },
  { et: "riik", en: "country" },
  { et: "eesti", en: "Estonian / Estonia" },
  { et: "inglise", en: "English" },
  { et: "keel", en: "language" },
  { et: "nimi", en: "name" },
  { et: "telefon", en: "phone" },
  { et: "number", en: "number" },
  { et: "aadress", en: "address" },
  { et: "vesi", en: "water" },
  { et: "kohv", en: "coffee" },
  { et: "tee", en: "tea" },
  { et: "piim", en: "milk" },
  { et: "leib", en: "bread" },
  { et: "toit", en: "food" },
  { et: "hommikusöök", en: "breakfast" },
  { et: "lõuna", en: "lunch" },
  { et: "õhtusöök", en: "dinner" },
  { et: "restoran", en: "restaurant" },
  { et: "pood", en: "store" },
  { et: "turg", en: "market" },
  { et: "hind", en: "price" },
  { et: "raha", en: "money" },
  { et: "odav", en: "cheap" },
  { et: "kallis", en: "expensive" },
  { et: "auto", en: "car" },
  { et: "buss", en: "bus" },
  { et: "rong", en: "train" },
  { et: "lennuk", en: "plane" },
  { et: "jaam", en: "station" },
  { et: "tänav", en: "street" },
  { et: "vasak", en: "left" },
  { et: "parem", en: "right" },
  { et: "otse", en: "straight" },
  { et: "sisse", en: "in / inside" },
  { et: "välja", en: "out / outside" },
  { et: "lähedal", en: "near" },
  { et: "kaugel", en: "far" },
  { et: "tere", en: "hello" },
  { et: "aitäh", en: "thank you" },
  { et: "palun", en: "please / you're welcome" },
  { et: "head aega", en: "goodbye" },
  { et: "ma ei saa aru", en: "I don't understand" },
  { et: "palun korrake", en: "please repeat" },
  { et: "räägin", en: "I speak" },
  { et: "õppima", en: "to learn" },
  { et: "kuulama", en: "to listen" },
  { et: "vaatama", en: "to watch" },
  { et: "lugema", en: "to read" },
  { et: "kirjutama", en: "to write" },
  { et: "tegema", en: "to do / make" },
  { et: "minema", en: "to go" },
  { et: "tulema", en: "to come" },
  { et: "olema", en: "to be" },
  { et: "saama", en: "to get / can" },
  { et: "tahtma", en: "to want" },
  { et: "andma", en: "to give" },
  { et: "võtma", en: "to take" },
  { et: "ostma", en: "to buy" },
  { et: "müüma", en: "to sell" },
  { et: "sööma", en: "to eat" },
  { et: "jooma", en: "to drink" },
  { et: "elama", en: "to live" },
  { et: "töötama", en: "to work" },
  { et: "küsima", en: "to ask" },
  { et: "vastama", en: "to answer" },
  { et: "aitama", en: "to help" },
  { et: "ootama", en: "to wait" },
  { et: "avama", en: "to open" },
  { et: "sulgema", en: "to close" },
  { et: "algama", en: "to start" },
  { et: "lõpetama", en: "to finish" },
  { et: "proovima", en: "to try" },
  { et: "teadma", en: "to know" },
  { et: "aru saama", en: "to understand" },
  { et: "meeldima", en: "to like" },
  { et: "armastama", en: "to love" },
  { et: "vaja", en: "need (required)" },
  { et: "võimalik", en: "possible" },
  { et: "probleem", en: "problem" },
  { et: "lahendus", en: "solution" },
  { et: "küsimus", en: "question" },
  { et: "vastus", en: "answer" },
  { et: "eesmärk", en: "goal" }
];

const DAY_OVERRIDES: Partial<Record<number, Partial<DayLesson>>> = {
  1: {
    subtitle: "Quick start: greet, introduce yourself, ask one question",
    estimatedTime: "20–25 min",
    goal: "Finish Day 1 with a clear 20-second Estonian self-introduction you can say without notes.",
    coreWords: [
      { et: "tere", en: "hello" },
      { et: "aitäh", en: "thank you" },
      { et: "palun", en: "please / you're welcome" },
      { et: "ma", en: "I" },
      { et: "olen", en: "am (I am)" },
      { et: "mul", en: "for me (in this phrase: I am doing)" },
      { et: "sul", en: "for you (in this phrase: you are doing)" },
      { et: "läheb", en: "goes / is going" },
      { et: "hästi", en: "well" },
      { et: "ei", en: "no / not" },
      { et: "jah", en: "yes" },
      { et: "kuidas", en: "how" }
    ],
    lesson: [
      "Learn the 12 words in 3 small sets of 4.",
      "Say each word once slowly and once at normal speed.",
      "Build two lines: \"Tere, ma olen ___.\" and \"Kuidas sul läheb?\""
    ],
    practice: [
      "Complete one full Practice Lab round (listen -> repeat -> type).",
      "Record one 20-second self-introduction (replace ___ with your name).",
      "Replay once and fix one unclear word."
    ],
    speakPrompt: "Tere! Ma olen ___. Mul läheb hästi. Kuidas sul läheb? Aitäh!",
    speakGlossary: [
      { et: "Tere!", en: "Hello!" },
      { et: "Ma olen ___.", en: "I am ___." },
      { et: "olen", en: "means \"am\" (first person of olema = to be)." },
      { et: "Mul läheb hästi.", en: "I am doing well." },
      { et: "Kuidas sul läheb?", en: "How are you?" },
      { et: "Aitäh!", en: "Thank you!" }
    ],
    review: [
      "Recall the 12 words without notes.",
      "Repeat your speak prompt once at normal speed.",
      "Do one final 60-second repeat before sleep."
    ]
  }
};

function weekForDay(dayNumber: number) {
  return WEEK_THEMES.find((week) => dayNumber >= week.range[0] && dayNumber <= week.range[1]) ?? WEEK_THEMES[3];
}

function coreWordsForDay(dayNumber: number, wordsPerDay = WORDS_PER_DAY) {
  const size = CORE_80_20_WORDS.length;
  if (size === 0) return [];
  const start = ((dayNumber - 1) * wordsPerDay) % size;
  const words: Array<{ et: string; en: string }> = [];

  for (let offset = 0; words.length < wordsPerDay && offset < size * 2; offset += 1) {
    const candidate = CORE_80_20_WORDS[(start + offset) % size];
    if (candidate?.et && candidate?.en) {
      words.push(candidate);
    }
  }

  return words;
}

function buildDay(dayNumber: number): DayLesson {
  const week = weekForDay(dayNumber);
  const focus = DAY_FOCUS[dayNumber - 1] ?? "Structured language execution";
  const override = DAY_OVERRIDES[dayNumber];

  const baseDay: DayLesson = {
    dayNumber,
    weekLabel: week.label,
    title: `Day ${dayNumber}`,
    subtitle: focus,
    estimatedTime: "20–30 min",
    goal: `Use today’s 12 high-frequency words for ${focus.toLowerCase()} in a short real speaking round.`,
    lesson: [
      "Learn today’s 12 high-frequency words first (80/20 priority).",
      "Build 4 short sentence frames you can actually use today.",
      `Read each frame aloud twice and anchor it to ${week.focus.toLowerCase()}.`
    ],
    practice: [
      "Complete one full loop: listen -> repeat -> type.",
      "Run one 60-second no-English speaking round using at least 8 core words.",
      "Record once and fix one mistake immediately."
    ],
    coreWords: coreWordsForDay(dayNumber),
    speakPrompt:
      "Speak for 60 seconds: use at least 8 core words, make 3 useful statements, and ask 2 practical questions.",
    review: [
      "Recall all 12 words without notes.",
      "Repeat your weakest 2 lines once slow and once at normal speed.",
      "Carry 3 hard words into tomorrow’s warm-up."
    ]
  };

  if (!override) return baseDay;
  return { ...baseDay, ...override };
}

export const DAY_PLAN: DayLesson[] = Array.from({ length: TOTAL_DAYS }, (_, index) => buildDay(index + 1));

export function getDayLesson(dayNumber: number): DayLesson | undefined {
  return DAY_PLAN.find((day) => day.dayNumber === dayNumber);
}

export const WEEK_GROUPS = [
  { id: "week-1", label: "Week 1", start: 1, end: 7 },
  { id: "week-2", label: "Week 2", start: 8, end: 14 },
  { id: "week-3", label: "Week 3", start: 15, end: 21 },
  { id: "week-4", label: "Week 4", start: 22, end: 30 }
] as const;
