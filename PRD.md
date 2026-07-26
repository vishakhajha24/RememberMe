# PRD: Remember Me

**Status:** v1 shipped, v2 scoped
**Owner:** Product/sole builder
**Last updated:** current as of this repo

## 1. Problem statement

People preparing for interviews (PM, technical, or otherwise) accumulate
large volumes of notes but have no effective way to convert them into
rehearsable, spoken-fluency practice. Existing flashcard tools optimize for
single-fact recall, which mismatches the actual skill being tested in an
interview: the ability to explain a concept clearly, in your own words,
under mild time pressure.

## 2. Goals

- Let a user turn their own notes into structured, reusable flashcards
  without losing the nuance of a multi-part concept
- Make revision behaviorally close to an actual interview answer (say it out
  loud, then check against a framework, not a single word)
- Keep the tool free to run indefinitely, no server costs, no forced
  subscription, fully user-owned data
- Make a user's deck portable: exportable, importable, shareable

## 3. Non-goals (v1)

- Multi-device sync via account/login (deliberately deferred, see
  `DECISIONS.md`)
- Grading or scoring correctness of an answer (v1 is self-assessed recall,
  not an automated evaluator)
- Native mobile app distribution via app stores
- Collaborative/shared decks with live multi-user editing

## 4. Target users

- **Primary:** Individuals prepping for PM or product-adjacent interviews
  who have their own notes (courses, books, mock interviews) and need a
  faster path from "notes" to "can say this fluently"
- **Secondary:** Anyone prepping for technical interviews, teaching
  material, or any domain where recall needs to support spoken explanation
  rather than short-answer recall

## 5. North Star metric

**Weekly Active Recall Sessions per user**, defined as a session where a
user opens the app and flips at least 3 cards.

Rationale: downloads or installs don't indicate value delivered. A single
completed session doesn't either, it could be idle curiosity. Recurring,
active use across a week is the strongest available proxy for "this is
actually part of my prep routine," which is the real job the product needs
to do. This is the metric I'd protect above all others if forced to
prioritize a single number.

## 6. Supporting success metrics

Organized by funnel stage, each with what it tells us and why it's a
leading (not vanity) indicator:

| Metric | What it tells us |
|---|---|
| **Cards created per user** | Whether note-to-card conversion is low-friction enough that people actually build a deck, not just browse the demo |
| **Cards reviewed / cards created (review ratio)** | Whether created content is actually being used, a low ratio signals a content-creation UX that outpaces the revision UX |
| **Self-rated recall confidence trend** | Whether repeated review is actually improving fluency over time, the core promise of spaced repetition |
| **Deck export events** | A proxy for perceived value worth preserving/backing up |
| **Deck import events from an external file** | A proxy for organic, peer-to-peer spread, someone shared a deck and it got used |
| **7-day retention** | Whether the tool survives past initial setup into a habit |

## 7. Functional requirements

### 7.1 Card model
- A card must support: topic (title), core answer (spoken-style, not a
  single word), a structured framework (ordered list of points), an
  optional mnemonic, one or more tags, a user-editable notes field, and a
  saved/bookmark flag
- Card content must render legibly on mobile without truncation

### 7.2 Organization
- Users must be able to filter their deck by tag
- Users must be able to view the deck as a browsable grid, not just one
  card at a time

### 7.3 Revision flow
- Default state hides the answer, requiring an explicit action to reveal it,
  reinforcing active recall over passive reading
- Users must be able to bookmark any card for later, and that state must
  persist across sessions

### 7.4 Data portability
- Full deck must be exportable as a single, human-readable JSON file
- Any validly-formatted deck file must be importable, replacing or merging
  into the current deck
- No data may be stored server-side; everything lives on-device

### 7.5 Installability
- The app must be installable to a phone home screen via standard PWA
  mechanisms (manifest + service worker)
- Core browsing/revision functionality must work offline after first load

## 8. Requirements deferred to v2

- AI-assisted ingestion: upload raw notes (text/doc), auto-generate
  structured cards, auto-suggest tags from a user-defined tag list
- Spaced repetition scheduling: self-rated confidence per review drives
  next-review timing per card
- Practice mode: daily set of interview-style questions, voice recording,
  and structured feedback against the card's framework

## 9. Risks and open questions

- **Local-only storage risk:** a cleared browser cache means data loss
  without a prior export. Mitigated by prominent export affordance, but
  worth monitoring via export-event metrics as an adoption signal, not just
  a safety net.
- **AI ingestion cost (v2):** once note-to-card generation ships, per-use
  API cost needs a clear boundary (subscription-covered usage vs. bring-your-
  own-key) before wide release.
- **Self-assessment ceiling:** without automated answer grading, recall
  confidence is self-reported and could be optimistic. Worth validating
  against actual interview outcomes if this moves beyond personal use.
