# Remember Me

A local-first, spaced-repetition flashcard app built for interview prep, PM
frameworks, and technical concepts. Installable as a PWA on desktop or phone,
works offline, and stores everything on-device with an explicit export/import
model instead of an account system.

Live product docs, written the way I'd document any 0-to-1 product:

- [`CASE_STUDY.md`](./CASE_STUDY.md) — the problem, the bet, and what shipped
- [`PRD.md`](./PRD.md) — requirements, North Star metric, success metrics
- [`DECISIONS.md`](./DECISIONS.md) — key tradeoffs and the reasoning behind them

## Why this exists

Most flashcard apps optimize for single-fact recall ("define X"). Interview
prep needs the opposite: the ability to speak fluently about a *concept* for
two minutes, in your own words, under mild pressure. Remember Me's card
format reflects that: each card holds a core answer, a supporting framework,
and an optional mnemonic, not a single word.

## Tech stack

- React 18 + Vite
- Tailwind CSS
- lucide-react icons
- No backend. State lives in `localStorage` and is portable via JSON export/import.
- Installable PWA (manifest + service worker, works offline after first load)

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL in your browser.

## Building for production

```bash
npm run build
npm run preview   # sanity check the production build locally
```

The build output lands in `dist/`.

## Deploying to GitHub Pages (free hosting)

1. Push this repo to GitHub.
2. In `vite.config.js`, confirm `base` matches your deploy path. For a
   project page at `https://vishakhajha24.github.io/RememberMe/`, this should
   already work as-is since it's set to `"./"` (relative paths).
3. Install the deploy helper and ship:
   ```bash
   npm install --save-dev gh-pages
   npm run build
   npx gh-pages -d dist
   ```
4. In the repo's Settings → Pages, set the source to the `gh-pages` branch.
5. Your app will be live at `https://vishakhajha24.github.io/RememberMe/`.

## Installing on your phone (PWA)

Once deployed:

- **iOS (Safari)**: open the URL → Share → "Add to Home Screen"
- **Android (Chrome)**: open the URL → menu (⋮) → "Install app" or "Add to Home Screen"

It'll launch full-screen, without browser chrome, and continue working
offline after the first load.

## Data model

Cards are the single source of truth, stored as JSON:

```js
{
  id: "c1",
  topic: "What is Product Management",
  mnemonic: "BTC",
  answer: "A PM's job is to bring out business impact while...",
  framework: ["Business → viability", "Technology → feasibility", "Consumer → usability"],
  tags: ["PM Basics"],
  color: "#E8C4C4",
  saved: false,
  liked: false,
  myNotes: ""
}
```

Use **Export** to download your full deck as `flashcard-deck.json`, and
**Import** to load any deck file, your own backup, or one shared by someone
else, into the app. No account, no server round-trip.

## Roadmap

- AI-assisted note-to-flashcard generation (upload raw notes, auto-tag and
  generate cards)
- Spaced repetition scheduling (confidence rating drives next-review timing)
- "Practice mode": daily question set with voice recording and structured
  feedback on your spoken answer
