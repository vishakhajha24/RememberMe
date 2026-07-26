# Case Study: Remember Me

**Role:** Product owner, sole builder (product, design, and prompt-driven
engineering)
**Timeline:** Prototype to installable PWA in a single focused build cycle
**Stack:** React, Vite, Tailwind, local-first storage

## The problem

Existing flashcard tools (Anki, Quizlet, Magoosh-style vocab apps) are built
around single-fact recall: a term, a definition, a flip. That model works
for vocabulary. It breaks down for interview prep, where the real skill
being tested isn't "do you know the term," it's "can you talk about this
concept fluently, in your own words, for two minutes, under mild pressure."

I was preparing for PM interviews across product sense, execution, and
technical/AI topics, and found myself with pages of scattered notes and no
good way to convert them into something I could actually rehearse against.
Generic flashcard apps forced me to compress rich concepts into one-line
answers, which is the opposite of what interview prep requires.

## Framing the opportunity

I treated this as a product problem, not just a personal tool, before writing
a line of code:

- **Who is this for?** Anyone prepping for interviews (or teaching) who needs
  to *speak* about a concept, not just recall a fact. PM candidates, technical
  interview prep, teaching prep.
- **What's the job to be done?** "Help me turn my own notes into something I
  can rehearse out loud, and know when I've actually internalized it."
- **Why now, why build vs. buy?** Existing tools are optimized for the wrong
  unit of recall (fact vs. framework), and none of them treat "my own raw
  notes" as the primary input. Building custom also let me control the data
  model tightly enough to keep it fully local-first, no account, no vendor
  lock-in, no server cost.

## Product decisions that mattered

**1. Redefined the atomic unit of a flashcard.**
Instead of a term/definition pair, a card holds: a spoken-style core answer,
a supporting framework (bulleted structure), an optional mnemonic, and a
free-text space for the user's own phrasing. This is the single biggest
product decision in the app, and it's the one that makes it fit interview
prep instead of vocab drilling. See `PRD.md` for the full spec.

**2. Local-first over accounts.**
No login, no backend, no database. The tradeoff is no cross-device sync out
of the box, but the payoff is zero infrastructure cost, full data ownership,
and a trivially portable format: export a JSON file, import it anywhere,
hand it to someone else and they have your exact deck. Full reasoning in
`DECISIONS.md`.

**3. Designed for a two-mode lifecycle: process once, use forever.**
Turning raw notes into structured cards is the one step that benefits from
AI assistance. Everything after that (browsing, filtering, revising,
bookmarking) needed to work with zero API dependency, zero recurring cost,
and offline. That split shaped the whole architecture.

**4. PWA over native.**
Given a single-developer scope and the goal of getting a usable tool on my
own phone fast, a PWA gets 90% of the "installed app" feel (home screen icon,
full-screen, offline support) with a fraction of the build and distribution
overhead of a native app. Documented as a formal tradeoff in `DECISIONS.md`,
including the conditions under which I'd revisit it.

## What shipped in v1

- Card-based UI with flip-to-reveal interaction, tag filtering, and a grid
  overview
- Persistent bookmarking and personal notes per card
- Full deck export/import as a portable JSON file
- Installable, offline-capable PWA shell

## What I'd measure next

I'm treating this like a real 0-to-1 product with a North Star and a small
set of leading indicators, laid out in full in `PRD.md`. In short: the North
Star is **weekly active recall sessions per user**, because it's the closest
proxy for "is this tool actually part of someone's prep routine" rather than
a one-time download. Supporting metrics track the funnel around it: cards
created, cards reviewed, self-rated recall confidence, and deck
export/import events as a proxy for the tool spreading peer-to-peer.

## What's next

- AI-assisted note ingestion (upload raw notes, get structured cards back)
- Spaced repetition scheduling driven by self-rated confidence
- A practice mode: daily question sets with voice recording and structured
  feedback on the spoken answer, closer to a real interview loop

## Why this matters as a signal

This project is a compressed example of the PM loop I'd apply on a team:
identify a real, specific problem with existing solutions, define who it's
for and why now, make and document deliberate tradeoffs under real
constraints (time, cost, single-developer scope), ship a working v1, and
define how I'd know if it's actually working before building further.
