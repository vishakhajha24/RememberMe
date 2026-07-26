# Decisions

Key product and technical tradeoffs, recorded at the point they were made,
with the reasoning and the conditions under which each would be revisited.

---

## D1: Local-first storage, no accounts or backend

**Decision:** Store the entire deck client-side (`localStorage`), with
explicit JSON export/import instead of login-based cloud sync.

**Why:** The core job is personal interview prep, not collaboration. An
account system adds real cost (auth, database, hosting) and real friction
(signup before value) for a use case that doesn't need real-time sync. A
portable JSON file solves the two problems an account would solve, backup
and sharing, without the overhead.

**Tradeoff accepted:** No automatic multi-device sync. A user has to
manually export from one device and import on another.

**Revisit when:** Usage data shows people regularly using the app across
multiple devices and finding manual export/import genuinely painful, at
that point, a lightweight sync layer (not necessarily full accounts) would
be worth scoping.

---

## D2: PWA instead of native mobile app

**Decision:** Ship as an installable Progressive Web App rather than a
native iOS/Android build.

**Why:** A PWA installs to the home screen, runs full-screen, and works
offline, covering the practical experience gap for a single-developer,
personal-tool scope. Native development requires platform-specific tooling,
app store review, and signing infrastructure that isn't justified at this
stage.

**Tradeoff accepted:** No app store discoverability, no push notifications
on iOS (platform limitation), slightly less polished feel than a fully
native app.

**Revisit when:** Distribution beyond personal/direct-share use becomes a
goal, at that point app store presence starts to matter for discovery and
trust.

---

## D3: Two-mode architecture: AI-assisted creation, zero-dependency usage

**Decision:** Split the product into a processing mode (uses AI to convert
raw notes into structured cards) and a usage mode (pure local read/write,
no API calls at all).

**Why:** AI processing is genuinely useful for the one step that's hard to
automate otherwise: extracting structure from messy notes. But making every
day-to-day interaction (browsing, revising, filtering) depend on a live API
call would introduce cost, latency, and an offline-breaking dependency for
no benefit, that step doesn't need intelligence, it needs speed and
reliability.

**Tradeoff accepted:** Card generation requires being inside an environment
with API access (or a user-supplied API key later); pure usage does not.
This asymmetry has to be clearly communicated so users understand which
actions are "free forever" and which require that access.

**Revisit when:** If this moves beyond personal use to a distributed
product, this boundary needs to be a first-class part of onboarding, not an
implementation detail.

---

## D4: Card schema optimized for spoken fluency, not fact recall

**Decision:** A card's answer field holds a multi-sentence, spoken-style
explanation plus a structured framework, not a single-word or single-line
answer.

**Why:** This is the actual product insight. Off-the-shelf flashcard tools
assume the unit of recall is a fact. Interview prep needs the unit of recall
to be an *explanation*, something you can reconstruct fluently in your own
words. Every other decision in this project is downstream of getting this
one right.

**Tradeoff accepted:** Cards are heavier to author than simple Q/A pairs,
and reviewing them takes longer per card than a flashcard app optimized for
rapid-fire drilling. That's an intentional tradeoff given the goal.

**Revisit when:** If a rapid-fire "quick recall" mode is ever needed
alongside deep-explanation mode, that likely becomes a second card type
rather than a replacement for this one.

---

## D5: Export/import as the sharing primitive, not a share link

**Decision:** Sharing a deck means handing over a JSON file, not generating
a hosted share link.

**Why:** A share link implies a server that stores and serves that data
indefinitely, which reintroduces the backend cost and maintenance burden
this project deliberately avoided (see D1). A file achieves the same
practical outcome, someone else gets your exact deck, with zero
infrastructure.

**Tradeoff accepted:** Slightly less convenient than tapping a link (user
has to receive and import a file), and no live-updating shared deck (a
shared file is a snapshot, not a sync).

**Revisit when:** If real-time collaboration or always-up-to-date shared
decks become an actual requirement, not just a nice-to-have.
