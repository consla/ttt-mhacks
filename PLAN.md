This repo is designed to hold a tic-tac-toe game intended for beginners of a hackathon to learn essential development tools such as git, github, concepts like environment variables, databases, deployment (let's use vercel), and leverage AI tools to forward development.

A few notes
- The base game will not contain a database, but we should make it simple for a beginner to easily configure a supabase db
    - We can leverage the supabase db to help keep track of score

The base design of the tic-tac-toe game should mimic the mhacks website, but we should make it simple to tune and configure for beginners

Common AI tools we intend for the tic-tac-toe to teach are cursor, codex, maybe claude code

We would also need to demonstrate how to setup the .env file and .gitignore

## Decisions

- **Stack:** Next.js (React). Zero-config Vercel deploys, built-in env var conventions (`NEXT_PUBLIC_*`), and API routes make adding Supabase later straightforward.
- **Distribution:** GitHub template repo, not a zip. "Use this template" gives beginners a real repo with full git history preserved instantly — less manual setup than unzip + `git init`, while still exercising clone/commit/push.
- **Score tracking scope:** Per-player local stats only (wins/losses/ties), not a shared/global leaderboard. No auth or identity system needed.
- **Audience:** Can already code, but new to git/GitHub, env vars, databases, deployment, and AI coding tools specifically. Scaffolding should target *these* concepts, not programming fundamentals.

## Architecture for easy configuration

- **Score storage behind one interface.** `lib/scoreStore.ts` exposes a `getScoreStore()` factory:
  - Default: `localStorageScoreStore` — works with zero configuration, so `npm install && npm run dev` plays a full game with stats immediately.
  - Automatically swaps to `supabaseScoreStore` once `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are present in `.env.local`.
  - Beginners "add the database" purely by filling in two env vars — no code changes required. This also makes the env-var lesson concrete: presence/absence of a var changes app behavior.
- **Env vars (Next.js convention):**
  - Commit `.env.example` with the two Supabase keys named but empty, plus a comment on where to find them in the Supabase dashboard.
  - `.gitignore` excludes `.env.local` (Next's convention, not `.env`), with a one-line comment explaining *why* it's ignored.
  - Setup step after cloning the template: `cp .env.example .env.local`.
- **Theming separated from game logic.** Pull the mhacks-inspired look (colors, fonts, logo) into a single Tailwind config / CSS-variable token file so "make it look different" is a one-file edit, not a hunt through components.
- **Deploy path matches the template-repo choice.** Lean on Vercel's GitHub import flow: connect repo → Vercel prompts for the env vars declared for the project → deploy. More natural teaching moment than a manual zip-based deploy button.
- **AI-tool teaching hook.** Include a stub `AGENTS.md` (works across Cursor/Codex/Claude Code) in the template describing project conventions, so beginners have a concrete first artifact to open in these tools instead of a blank slate.
- **Supabase setup docs.** A `SETUP.md` with the exact SQL to paste into the Supabase SQL editor (one `scores` table) and a walkthrough for finding the URL/anon key — this is the one step that can't be made zero-config, so it gets the most hand-holding.