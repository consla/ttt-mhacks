# Tic-Tac-Toe Base Game: Scaffold + MHacks Theme

## Overview

A tic-tac-toe game used as a teaching repo for MHacks hackathon beginners.
The repo currently contains only `PLAN.md`. This spec covers the initial
scaffold: a Next.js game styled after the mhacks.org marketing site's
"Digital Garden" theme, with a swappable score-persistence layer that
works with zero configuration and upgrades to Supabase when configured.

## Goals

- A beginner can `git clone` (from a GitHub template), `npm install`,
  `npm run dev`, and play a fully working, on-theme game with **no
  configuration**.
- Adding score persistence via Supabase is a two-env-var change, not a
  code change.
- Visual theme (colors/fonts) lives in one file, so "make it look
  different" is a one-file edit for a beginner.
- Game logic stays simple enough to read/modify without React or Next.js
  experience beyond basics.

## Non-goals

- No shared/global leaderboard, no auth, no identity system.
- No AI opponent, no online multiplayer.
- No grain texture, liquid-glass blur, custom cursor, or other decorative
  effects from the marketing site — visual fidelity is intentionally
  distilled to colors, fonts, radius, and shadow.
- No automated visual regression testing.

## Decisions (carried from PLAN.md)

- **Stack:** Next.js (App Router). Zero-config Vercel deploys, built-in
  `NEXT_PUBLIC_*` env var convention, API routes available if needed later.
- **Distribution:** GitHub template repo, not a zip.
- **Score scope:** per-player local stats (wins/losses/ties), no shared
  leaderboard.
- **Audience:** can already code; new to git/GitHub, env vars, databases,
  deployment, and AI coding tools specifically.
- **Theme source:** the mhacks.org marketing site ("Digital Garden"),
  *not* the internal dashboard's ASCII-console theme or the boarding-pass
  blueprint theme. Confirmed against live screenshots of both — the
  marketing site is the outward-facing brand beginners recognize, and its
  warmer palette suits a game better than the dashboard's monochrome
  admin-tool look.
- **Branding assets:** include the actual mhacks logo (`mhacks25_logo.svg`
  from the dashboard repo's `public/` directory), copied into this repo's
  `public/`.
- **Game pieces:** classic X/O text, not themed icons — keeps game logic
  trivial to read. Theming applies to chrome (board, background, buttons,
  header) only.

## Architecture

### Project structure

```
app/
  layout.tsx          # fonts (next/font/google), metadata
  globals.css         # theme tokens (colors, fonts, radius, shadow)
  page.tsx            # header + board + stats, client component
components/
  Board.tsx           # 3x3 grid, cell click handling
  Cell.tsx            # single cell, renders X/O
  StatsRow.tsx         # wins/losses/ties display
  Header.tsx          # logo + tagline
lib/
  gameLogic.ts        # win/draw detection, turn logic (pure functions)
  scoreStore.ts        # persistence interface + factory
  scoreStore.local.ts  # localStorage implementation (default)
  scoreStore.supabase.ts # Supabase implementation (opt-in)
public/
  mhacks-logo.svg      # copied from dashboard repo
.env.example
.gitignore
```

### Theme tokens (`app/globals.css`)

A `:root` block holding the distilled Digital Garden palette and type
tokens, pulled from the dashboard repo's `app/globals.css`:

- Colors: `--color-moss-900` through `--color-moss-300`, `--color-parchment`
  (background), `--color-cream`, `--color-sun` / `--color-leaf` /
  `--color-bloom` (small accent pops — e.g. win highlight uses leaf,
  loss/draw states can use a muted moss tone).
- Fonts: Instrument Serif (italic, display heading) + Red Hat Display
  (body/UI) + Red Hat Mono (small labels like the stats row), loaded via
  `next/font/google` in `app/layout.tsx` the same way the dashboard does.
- Shape: one `--radius` token driving soft-rounded corners on the board,
  cells, and buttons; one soft multi-layer `--shadow-card` token for the
  board container.

This is the single file a beginner edits to "reskin" the game — no
component code touches raw color/font values directly, only the tokens.

### Score store (`lib/scoreStore.ts`)

```ts
interface ScoreStore {
  getStats(): Promise<{ wins: number; losses: number; ties: number }>;
  recordResult(result: "win" | "loss" | "tie"): Promise<void>;
}

function getScoreStore(): ScoreStore {
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return hasSupabase ? supabaseScoreStore : localScoreStore;
}
```

- `localScoreStore`: reads/writes a JSON blob in `localStorage`. No setup
  required — this is what runs the moment someone clones the template.
- `supabaseScoreStore`: same interface, backed by a single `scores` table.
  Activates automatically once both env vars are present — no code change.
- The factory is the only place that branches on configuration; every
  caller (the game UI) only ever sees the `ScoreStore` interface.

### Env vars

- `.env.example` commits both Supabase keys, named but empty, with a
  comment pointing to Settings → API in the Supabase dashboard.
- `.gitignore` excludes `.env.local` (Next.js convention), with a comment
  explaining why it's ignored (never commit real keys/secrets).
- Setup instructions in `README.md`: `cp .env.example .env.local`.

### Data flow

1. `page.tsx` holds board state (`Array<"X" | "O" | null>`) and current
   turn as component state.
2. On cell click, `gameLogic.ts` pure functions compute the next board
   state and check for a win/draw.
3. On game end, `page.tsx` calls `scoreStore.recordResult(...)` and
   re-fetches stats via `scoreStore.getStats()` to update `StatsRow`.
4. No server state beyond the optional Supabase table — everything else
   is client-side React state.

### Error handling

- `supabaseScoreStore` calls are wrapped so a network/config error logs a
  console warning and the UI continues (falls back to showing the last
  known local stats) rather than blocking play. Beginners should never see
  the game break because of a DB hiccup.
- No error handling for scenarios that can't occur locally (e.g. malformed
  localStorage JSON is reset rather than defensively parsed with a fallback
  schema — YAGNI for a teaching repo).

## Testing plan

- No automated test suite — this is a teaching repo and beginners should
  not need to run/maintain a test runner to work on it.
- Manual browser check (required before calling this done, per project
  norms): full game playthrough with zero env vars configured (confirms
  the zero-config path truly works), then again with Supabase env vars
  set (confirms the swap works), and a visual check of the theme against
  the mhacks.org marketing site.

## Out of scope for this spec

- Actual Supabase table creation SQL and `SETUP.md` walkthrough (follow-up
  spec/task).
- `AGENTS.md` stub for AI tool onboarding (follow-up task).
- GitHub template repo settings / Vercel deploy-button configuration
  (follow-up task, no code in this repo).
