import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";

import { ButtonLink } from "@/components/console/button";
import {
  LetterBody,
  LetterHeading,
  LetterKicker,
  LetterSection,
  LetterTitle,
  Showcase,
  Signoff,
} from "@/components/console/letter";
import { PanelBar } from "@/components/console/panel";
import { ConsoleShell } from "@/components/console/shell";

export const metadata: Metadata = {
  title: "Tutorial · MHacks Tic-Tac-Toe",
};

const CODE_CHIP = "rounded bg-ui-selected px-1 font-mono text-xs text-ui-ink";
const CODE_BLOCK =
  "mt-3 overflow-x-auto rounded-lg bg-ui-ink p-3 font-mono text-xs text-ui-surface";
const LINK = "text-moss underline underline-offset-2 hover:text-olive";

function slugify(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function Screenshot({
  src,
  width,
  height,
  caption,
}: {
  src: string;
  width: number;
  height: number;
  caption: string;
}) {
  return (
    <figure className="m-0 mt-3">
      <Image
        src={src}
        alt={caption}
        width={width}
        height={height}
        sizes="(min-width: 768px) 640px, 100vw"
        className="block h-auto w-full border border-ui-line-strong"
      />
      <figcaption className="mt-[7px] block font-red-hat-mono text-[10px] tracking-[0.14em] uppercase text-ui-ink-soft">
        {caption}
      </figcaption>
    </figure>
  );
}

const steps: { label: string; body: ReactNode }[] = [
  {
    label: "Install Git",
    body: (
      <>
        <LetterBody>
          You&apos;ll need Git to clone the repo and push your changes. Check
          whether you already have it:
        </LetterBody>
        <pre className={CODE_BLOCK}>{`git --version`}</pre>
        <LetterBody>
          If that errors instead of printing a version, install it:
        </LetterBody>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-[1.66] text-ui-ink">
          <li>
            <strong>macOS:</strong> run{" "}
            <code className={CODE_CHIP}>git --version</code> in Terminal — if
            it&apos;s not already installed, macOS prompts you to install the
            Xcode Command Line Tools, which include Git.
          </li>
          <li>
            <strong>Windows:</strong> download and run the installer from{" "}
            <code className={CODE_CHIP}>git-scm.com</code> (defaults are
            fine — it also adds Git Bash, a terminal you can use for the rest
            of this tutorial).
          </li>
          <li>
            <strong>Linux:</strong> install it with your package manager,
            e.g. <code className={CODE_CHIP}>sudo apt install git</code> on
            Ubuntu/Debian.
          </li>
        </ul>
      </>
    ),
  },
  {
    label: "Sign in to GitHub",
    body: (
      <>
        <LetterBody>
          To push code you&apos;ll need Git authenticated with your GitHub
          account. Pick one:
        </LetterBody>
        <LetterBody>
          <strong>Option A — GitHub CLI:</strong> installs a{" "}
          <code className={CODE_CHIP}>gh</code> command you&apos;ll also use
          later to open pull requests.
        </LetterBody>
        <pre className={CODE_BLOCK}>
          {`# macOS
brew install gh

# Windows
winget install --id GitHub.cli

# then, on any OS:
gh auth login`}
        </pre>
        <LetterBody>
          Answer the prompts with{" "}
          <code className={CODE_CHIP}>GitHub.com</code>,{" "}
          <code className={CODE_CHIP}>HTTPS</code>, and{" "}
          <code className={CODE_CHIP}>Login with a web browser</code> — it
          opens a tab, you approve it, and{" "}
          <code className={CODE_CHIP}>git push</code> just works from then
          on.
        </LetterBody>
        <LetterBody>
          <strong>Option B — Cursor:</strong> if you&apos;re coding in
          Cursor, open the Source Control panel (the branch icon in the left
          sidebar), and click &quot;Sign in with GitHub&quot; when prompted
          (or via Cursor&apos;s Accounts settings). It opens the same kind of
          browser approval and then handles Git authentication for you
          whenever you push from Cursor.
        </LetterBody>
      </>
    ),
  },
  {
    label: "Install Node.js",
    body: (
      <>
        <LetterBody>
          This project needs Node.js and npm to run. Check whether you
          already have them:
        </LetterBody>
        <pre className={CODE_BLOCK}>
          {`node -v
npm -v`}
        </pre>
        <LetterBody>
          If both print a version (Node 18 or newer is fine) you&apos;re set.
          If either errors instead, head to{" "}
          <code className={CODE_CHIP}>nodejs.org</code> and pick one of two
          options.
        </LetterBody>
        <LetterBody>
          <strong>Option A — CLI, via nvm</strong> (macOS/Linux): installs
          Node and npm together and makes it easy to switch versions later.
          The site generates the exact commands for your OS — copy and run
          them in your terminal:
        </LetterBody>
        <Screenshot
          src="/tutorial/nvm-install.png"
          width={2188}
          height={1074}
          caption="nodejs.org's install picker, set to macOS + nvm + npm"
        />
        <LetterBody>
          <strong>Option B — prebuilt installer:</strong> pick your OS and
          architecture on the same page and download a one-click installer
          (<code className={CODE_CHIP}>.msi</code> on Windows,{" "}
          <code className={CODE_CHIP}>.pkg</code> on macOS). It installs{" "}
          <code className={CODE_CHIP}>npm</code> alongside{" "}
          <code className={CODE_CHIP}>node</code>, which the next step uses.
        </LetterBody>
        <Screenshot
          src="/tutorial/windows-installer.png"
          width={2188}
          height={248}
          caption="The prebuilt Windows Installer (.msi) download on nodejs.org"
        />
      </>
    ),
  },
  {
    label: "Clone & run",
    body: (
      <Showcase
        image="/tutorial/use-this-template.png"
        width={598}
        height={374}
        caption='The "Use this template" button, top right'
      >
        <LetterBody>
          Click the &quot;Use this template&quot; button on GitHub to get your
          own copy of this repo, then:
        </LetterBody>
        <pre className={CODE_BLOCK}>
          {`git clone <your-repo-url>
cd <your-repo-name>
npm install
npm run dev`}
        </pre>
        <LetterBody>
          Grab that URL from the green &quot;Code&quot; button on your new
          repo:
        </LetterBody>
        <Screenshot
          src="/tutorial/clone-url.png"
          width={844}
          height={752}
          caption="The Code dropdown — HTTPS works with either sign-in option above"
        />
      </Showcase>
    ),
  },
  {
    label: "Git basics",
    body: (
      <>
        <LetterBody>
          After you make a change, save it to your repo&apos;s history and send
          it to GitHub:
        </LetterBody>
        <pre className={CODE_BLOCK}>
          {`git add .
git commit -m "describe your change"
git push`}
        </pre>
      </>
    ),
  },
  {
    label: "Working as a team",
    body: (
      <>
        <LetterBody>
          If a few of you are hacking on the same repo, don&apos;t all push to{" "}
          <code className={CODE_CHIP}>main</code> directly. Each person works on
          their own branch, then opens a pull request to merge it in:
        </LetterBody>
        <pre className={CODE_BLOCK}>
          {`git branch feature/your-feature
git checkout feature/your-feature
# ...make changes...
git add .
git commit -m "describe your change"
git push -u origin feature/your-feature`}
        </pre>
        <LetterBody>
          Push a branch and GitHub offers to open a pull request for it:
        </LetterBody>
        <Screenshot
          src="/tutorial/compare-pull-request.png"
          width={2912}
          height={654}
          caption="GitHub prompts you to open a PR after a push"
        />
        <LetterBody>
          Click through and hit &quot;Create pull request&quot; to open it
          against <code className={CODE_CHIP}>main</code> (or run{" "}
          <code className={CODE_CHIP}>gh pr create</code> instead):
        </LetterBody>
        <Screenshot
          src="/tutorial/create-pull-request.png"
          width={2942}
          height={958}
          caption="Comparing your branch against main"
        />
        <LetterBody>
          Have a teammate glance over it, then merge — this keeps
          everyone&apos;s changes from colliding, and gives you a chance to
          catch bugs before they land. After merging, everyone else should run{" "}
          <code className={CODE_CHIP}>
            git checkout main &amp;&amp; git pull
          </code>{" "}
          before starting new work.
        </LetterBody>
        <Screenshot
          src="/tutorial/merge-pull-request.png"
          width={2960}
          height={1302}
          caption="Ready to merge once reviewed"
        />
      </>
    ),
  },
  {
    label: "Deploying to Vercel",
    body: (
      <>
        <LetterBody>
          Once your repo is on GitHub, go to{" "}
          <code className={CODE_CHIP}>vercel.com</code> → New Project → import
          the repo. Vercel detects Next.js automatically, so no config is
          needed.
        </LetterBody>
        <LetterBody>
          Every push to <code className={CODE_CHIP}>main</code> deploys to
          production, and every pull request gets its own preview URL — handy
          for letting teammates click-test a change before merging it.
          Don&apos;t forget to add any{" "}
          <code className={CODE_CHIP}>.env.local</code> values (like your
          Supabase keys) under Project → Settings → Environment Variables, since
          Vercel doesn&apos;t read your local{" "}
          <code className={CODE_CHIP}>.env.local</code> file.
        </LetterBody>
      </>
    ),
  },
  {
    label: "Environment variables",
    body: (
      <>
        <LetterBody>
          This project reads secrets from a{" "}
          <code className={CODE_CHIP}>.env.local</code> file. It&apos;s listed
          in <code className={CODE_CHIP}>.gitignore</code>, so git ignores it
          and it&apos;s never committed — your real keys stay off GitHub. Copy
          the example file to get started:
        </LetterBody>
        <pre className={CODE_BLOCK}>{`cp .env.example .env.local`}</pre>
      </>
    ),
  },
];

const breakouts: { label: string; body: ReactNode }[] = [
  {
    label: "Scoreboard",
    body: (
      <>
        <LetterBody>
          There&apos;s no score tracking yet — this breakout is about
          building it from scratch on Supabase. Start by setting up a
          project:
        </LetterBody>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px] leading-[1.66] text-ui-ink">
          <li>Create a free project at supabase.com.</li>
          <li>
            In the SQL editor, run:
            <pre className={CODE_BLOCK}>
              {`-- one row per player, keyed by the random id they're given
create table scores (
  player_id text primary key,
  wins integer not null default 0,
  losses integer not null default 0,
  ties integer not null default 0
);`}
            </pre>
          </li>
          <li>
            In Settings → API, copy your Project URL and{" "}
            <code className={CODE_CHIP}>anon</code> key into{" "}
            <code className={CODE_CHIP}>.env.local</code> (copy{" "}
            <code className={CODE_CHIP}>.env.example</code> first if you
            haven&apos;t already).
          </li>
          <li>
            Restart <code className={CODE_CHIP}>npm run dev</code> so the new
            env vars are picked up.
          </li>
        </ol>
        <LetterBody>
          <code className={CODE_CHIP}>@supabase/supabase-js</code> is already
          installed, so you just need a client and two queries. Create{" "}
          <code className={CODE_CHIP}>lib/scoreStore.ts</code>:
        </LetterBody>
        <pre className={CODE_BLOCK}>
          {`import { createClient } from "@supabase/supabase-js";

// Connects to your Supabase project using the keys from .env.local.
// The "!" tells TypeScript these are always set — they will be, once
// you've followed the setup steps above.
const client = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const PLAYER_ID_KEY = "tic-tac-toe-player-id";

// Gives this browser a random ID, saved in localStorage, so each
// player's stats live in their own row of the "scores" table.
function getPlayerId(): string {
  let id = window.localStorage.getItem(PLAYER_ID_KEY);

  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(PLAYER_ID_KEY, id);
  }

  return id;
}

// Reads this player's row back from Supabase.
// If they don't have one yet, default to all zeros.
export async function getStats() {
  const { data } = await client
    .from("scores")
    .select("wins, losses, ties")
    .eq("player_id", getPlayerId())
    .maybeSingle();

  return data ?? { wins: 0, losses: 0, ties: 0 };
}

// Adds one win, loss, or tie to this player's row.
// "upsert" creates the row on the first call and updates it after that.
export async function recordResult(result: "win" | "loss" | "tie") {
  const current = await getStats();

  await client.from("scores").upsert({
    player_id: getPlayerId(),
    wins: current.wins + (result === "win" ? 1 : 0),
    losses: current.losses + (result === "loss" ? 1 : 0),
    ties: current.ties + (result === "tie" ? 1 : 0),
  });
}`}
        </pre>
        <LetterBody>
          Now wire it into <code className={CODE_CHIP}>app/page.tsx</code>{" "}
          (import <code className={CODE_CHIP}>getStats</code> and{" "}
          <code className={CODE_CHIP}>recordResult</code> from{" "}
          <code className={CODE_CHIP}>@/lib/scoreStore</code>). There&apos;s
          no single &quot;you&quot; in 2-player mode, but the human always
          plays <code className={CODE_CHIP}>X</code> — that&apos;s{" "}
          <code className={CODE_CHIP}>HUMAN</code> near the top of the file,
          with the computer as <code className={CODE_CHIP}>OPPONENT</code> —
          so record every result from X&apos;s side in both modes: a win
          when the winner is <code className={CODE_CHIP}>HUMAN</code>, a
          loss when it&apos;s <code className={CODE_CHIP}>OPPONENT</code>,
          and a tie on a draw.
        </LetterBody>
        <LetterBody>
          Add a stats state, then call{" "}
          <code className={CODE_CHIP}>recordResult(...)</code> and{" "}
          <code className={CODE_CHIP}>getStats()</code> right where{" "}
          <code className={CODE_CHIP}>handleCellClick</code> already detects
          a winner — for example:
        </LetterBody>
        <pre className={CODE_BLOCK}>
          {`const [stats, setStats] = useState({ wins: 0, losses: 0, ties: 0 });

// ...inside handleCellClick, where nextWinner is already detected:
if (nextWinner) {
  await recordResult(nextWinner === HUMAN ? "win" : "loss");
  setStats(await getStats());
  return;
}`}
        </pre>
        <LetterBody>
          <code className={CODE_CHIP}>handleCellClick</code> will need to
          become <code className={CODE_CHIP}>async function
          handleCellClick(...)</code> for those{" "}
          <code className={CODE_CHIP}>await</code>s to work. Do the same at
          the other three spots that already detect a winner or a draw (the
          rest of <code className={CODE_CHIP}>handleCellClick</code>, and
          both branches of the computer&apos;s move effect).
        </LetterBody>
        <LetterBody>
          Two more things make it feel finished. First, a returning player
          already has a row in Supabase, but{" "}
          <code className={CODE_CHIP}>stats</code> starts at all zeros on
          every page load — fetch their real numbers once when the
          component mounts:
        </LetterBody>
        <pre className={CODE_BLOCK}>
          {`useEffect(() => {
  getStats().then(setStats);
}, []);`}
        </pre>
        <LetterBody>
          Second, for where to show it: the simplest spot is right in{" "}
          <code className={CODE_CHIP}>app/page.tsx</code>, next to the
          status line that&apos;s already there — the{" "}
          <code className={CODE_CHIP}>
            {'<div className="pt-6 font-mono text-sm text-moss-300">'}
          </code>{" "}
          that shows whose turn it is. Add a line under it:
        </LetterBody>
        <pre className={CODE_BLOCK}>
          {`<div className="pt-2 font-mono text-xs text-moss-400">
  {stats.wins}W – {stats.losses}L – {stats.ties}T
</div>`}
        </pre>
        <LetterBody>
          That keeps everything in one component — no prop-passing
          needed. If you&apos;d rather it live in{" "}
          <code className={CODE_CHIP}>components/Header.tsx</code>{" "}
          instead, that component doesn&apos;t currently take any props,
          so you&apos;d need to pass stats down yourself:{" "}
          <code className={CODE_CHIP}>{"<Header stats={stats} />"}</code>{" "}
          in <code className={CODE_CHIP}>app/page.tsx</code>, plus a{" "}
          <code className={CODE_CHIP}>
            {"{ stats }: { stats: { wins: number; losses: number; ties: number } }"}
          </code>{" "}
          parameter on <code className={CODE_CHIP}>Header</code> itself.
        </LetterBody>
      </>
    ),
  },
  {
    label: "Difficulty settings",
    body: (
      <>
        <LetterBody>
          The 2 Player / vs Computer toggle already ships in{" "}
          <code className={CODE_CHIP}>app/page.tsx</code>, and the computer
          currently plays every move with{" "}
          <code className={CODE_CHIP}>randomMove</code> from{" "}
          <code className={CODE_CHIP}>lib/gameLogic.ts</code> — that&apos;s the
          whole bot for now, with no difficulty behind it yet. This breakout
          adds two more tiers, each just a longer list of &quot;try this,
          else try that&quot; checks — no game-tree search required.
        </LetterBody>
        <LetterBody>
          <strong>Medium</strong> takes a winning move if one exists, else
          blocks the human&apos;s winning move, else falls back to{" "}
          <code className={CODE_CHIP}>randomMove</code>. Add this next to{" "}
          <code className={CODE_CHIP}>randomMove</code> in{" "}
          <code className={CODE_CHIP}>lib/gameLogic.ts</code>:
        </LetterBody>
        <pre className={CODE_BLOCK}>
          {`function otherPlayer(player: Player): Player {
  return player === "X" ? "O" : "X";
}

// Is there a single move that would let "player" win right now?
function findWinningMove(board: Board, player: Player): number | null {
  const empty = board
    .map((cell, i) => (cell === null ? i : null))
    .filter((i): i is number => i !== null);

  return (
    empty.find((i) => checkWinner(applyMove(board, i, player)) === player) ??
    null
  );
}

export function mediumMove(board: Board, me: Player): number {
  return (
    findWinningMove(board, me) ??
    findWinningMove(board, otherPlayer(me)) ??
    randomMove(board)
  );
}`}
        </pre>
        <LetterBody>
          <strong>Hard</strong> plays the classic tic-tac-toe strategy
          guide — win, block, then avoid ever letting the human set up two
          threats at once (a &quot;fork&quot;), then fall back to positional
          preferences. It&apos;s extremely hard to beat and every step is
          still just a check over <code className={CODE_CHIP}>checkWinner</code>{" "}
          — no game-tree search — though it isn&apos;t mathematically
          perfect: there are a couple of rare opening lines where blocking
          one fork leaves another one open. Finding one is a fun stretch
          goal.
        </LetterBody>
        <pre className={CODE_BLOCK}>
          {`const CENTER = 4;
const CORNERS = [0, 2, 6, 8];
const SIDES = [1, 3, 5, 7];
const OPPOSITE_CORNER: Record<number, number> = { 0: 8, 2: 6, 6: 2, 8: 0 };

function emptyCells(board: Board): number[] {
  return board
    .map((cell, i) => (cell === null ? i : null))
    .filter((i): i is number => i !== null);
}

// How many different moves would let "player" win from this board?
// Two or more means whoever's up next can't block them all — a fork.
function countWinningMoves(board: Board, player: Player): number {
  return emptyCells(board).filter(
    (i) => checkWinner(applyMove(board, i, player)) === player,
  ).length;
}

function findForkMove(board: Board, player: Player): number | null {
  return (
    emptyCells(board).find(
      (i) => countWinningMoves(applyMove(board, i, player), player) >= 2,
    ) ?? null
  );
}

// If the opponent holds a corner and its opposite corner is open, that's
// normally the strongest reply.
function findOppositeCornerMove(board: Board, opponent: Player): number | null {
  for (const corner of CORNERS) {
    const opposite = OPPOSITE_CORNER[corner];
    if (board[corner] === opponent && board[opposite] === null) {
      return opposite;
    }
  }
  return null;
}

function firstEmpty(board: Board, cells: number[]): number | null {
  return cells.find((i) => board[i] === null) ?? null;
}

export function hardMove(board: Board, me: Player): number {
  const opponent = otherPlayer(me);

  return (
    findWinningMove(board, me) ??
    findWinningMove(board, opponent) ??
    findForkMove(board, me) ??
    findForkMove(board, opponent) ??
    firstEmpty(board, [CENTER]) ??
    findOppositeCornerMove(board, opponent) ??
    firstEmpty(board, CORNERS) ??
    firstEmpty(board, SIDES) ??
    randomMove(board)
  );
}`}
        </pre>
        <LetterBody>
          Then add a <code className={CODE_CHIP}>difficulty</code> state next
          to <code className={CODE_CHIP}>mode</code> in{" "}
          <code className={CODE_CHIP}>app/page.tsx</code>, with buttons for it
          the same way <code className={CODE_CHIP}>MODES</code> renders the
          mode buttons:
        </LetterBody>
        <pre className={CODE_BLOCK}>
          {`type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const [difficulty, setDifficulty] = useState<Difficulty>("easy");`}
        </pre>
        <LetterBody>
          The computer&apos;s move only needs one change. In{" "}
          <code className={CODE_CHIP}>app/page.tsx</code>, find the{" "}
          <code className={CODE_CHIP}>useEffect</code> that plays the
          computer&apos;s move — it depends on{" "}
          <code className={CODE_CHIP}>
            [computersTurn, gameOver, board]
          </code>{" "}
          and runs inside a <code className={CODE_CHIP}>setTimeout</code>{" "}
          callback. Its very first line is{" "}
          <code className={CODE_CHIP}>const index = randomMove(board);</code>{" "}
          — swap just that line for:
        </LetterBody>
        <pre className={CODE_BLOCK}>
          {`const index =
  difficulty === "hard"
    ? hardMove(board, OPPONENT)
    : difficulty === "medium"
      ? mediumMove(board, OPPONENT)
      : randomMove(board);`}
        </pre>
      </>
    ),
  },
  {
    label: "Sound effects",
    body: (
      <>
        <LetterBody>
          Three short clips are already sitting in{" "}
          <code className={CODE_CHIP}>public/sounds/</code> —{" "}
          <code className={CODE_CHIP}>move.mp3</code>,{" "}
          <code className={CODE_CHIP}>win.mp3</code>, and{" "}
          <code className={CODE_CHIP}>draw.mp3</code> — free, no-attribution
          SFX from Mixkit. Play them from a small helper, e.g.{" "}
          <code className={CODE_CHIP}>lib/sounds.ts</code>:
        </LetterBody>
        <pre className={CODE_BLOCK}>
          {`export function playSound(name: "move" | "win" | "draw") {
  new Audio(\`/sounds/\${name}.mp3\`).play();
}`}
        </pre>
        <LetterBody>
          <code className={CODE_CHIP}>app/page.tsx</code> already marks
          exactly where each call goes with a{" "}
          <code className={CODE_CHIP}>{"// TODO: sound"}</code> comment:
          call{" "}
          <code className={CODE_CHIP}>playSound(&quot;move&quot;)</code> right
          after each <code className={CODE_CHIP}>setBoard(nextBoard)</code> —
          both in <code className={CODE_CHIP}>handleCellClick</code> and in
          the computer&apos;s-move effect — then{" "}
          <code className={CODE_CHIP}>playSound(&quot;win&quot;)</code> where{" "}
          <code className={CODE_CHIP}>checkWinner</code> finds a winner and{" "}
          <code className={CODE_CHIP}>playSound(&quot;draw&quot;)</code> where{" "}
          <code className={CODE_CHIP}>isDraw</code> is true.
        </LetterBody>
        <LetterBody>
          Want different sounds, or more of them (a menu click, background
          music)? These are all free, no-signup, commercial-use-OK:{" "}
          <a
            href="https://mixkit.co/free-sound-effects/"
            target="_blank"
            rel="noopener noreferrer"
            className={LINK}
          >
            Mixkit
          </a>
          ,{" "}
          <a
            href="https://pixabay.com/sound-effects/"
            target="_blank"
            rel="noopener noreferrer"
            className={LINK}
          >
            Pixabay
          </a>
          ,{" "}
          <a
            href="https://freesound.org/"
            target="_blank"
            rel="noopener noreferrer"
            className={LINK}
          >
            Freesound
          </a>{" "}
          (huge community library — check each clip&apos;s license, most are{" "}
          <code className={CODE_CHIP}>CC0</code> but some need attribution),
          and{" "}
          <a
            href="https://kenney.nl/assets?q=audio"
            target="_blank"
            rel="noopener noreferrer"
            className={LINK}
          >
            Kenney
          </a>{" "}
          (<code className={CODE_CHIP}>CC0</code> packs made specifically for
          indie games). Drop new files into{" "}
          <code className={CODE_CHIP}>public/sounds/</code> and reference
          them the same way as the three above.
        </LetterBody>
      </>
    ),
  },
];

export default function TutorialPage() {
  return (
    <ConsoleShell width="letter" field={false}>
      <article>
        <PanelBar eyebrow="MHACKS TIC-TAC-TOE" status="Tutorial" />

        <LetterSection>
          <LetterKicker>Getting Started</LetterKicker>
          <LetterTitle>Make it your own.</LetterTitle>
          <LetterBody>
            This game is a starter template. Fork the repo, run it locally,
            and customize it — here&apos;s everything you need to get set
            up.
          </LetterBody>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <ButtonLink href="/" variant="primary" external={false}>
              Back to the board
            </ButtonLink>
          </div>
        </LetterSection>

        {steps.map((step, index) => (
          <LetterSection
            key={step.label}
            id={slugify(step.label)}
            tone={index % 2 === 0 ? "well" : "paper"}
          >
            <LetterHeading>
              {index + 1}. {step.label}
            </LetterHeading>
            {step.body}
          </LetterSection>
        ))}

        <LetterSection tone={steps.length % 2 === 0 ? "well" : "paper"}>
          <LetterKicker>Workshop breakouts</LetterKicker>
          <LetterBody>
            Once you&apos;re set up, join a small-group session with a
            mentor to add one of these to your game. Each one points at
            exactly where in the code it hooks in — but that only lines up
            if your copy is current, so pull the latest changes first:
          </LetterBody>
          <pre className={CODE_BLOCK}>
            {`git checkout main
git pull`}
          </pre>
          <LetterBody>
            If you&apos;re on a branch with changes of your own, commit or
            stash them first so <code className={CODE_CHIP}>git pull</code>{" "}
            doesn&apos;t complain.
          </LetterBody>
        </LetterSection>

        {breakouts.map((breakout, index) => (
          <LetterSection
            key={breakout.label}
            id={slugify(breakout.label)}
            tone={(steps.length + 1 + index) % 2 === 0 ? "well" : "paper"}
          >
            <LetterHeading>{breakout.label}</LetterHeading>
            {breakout.body}
          </LetterSection>
        ))}

        <LetterSection
          tone={
            (steps.length + 1 + breakouts.length) % 2 === 0 ? "well" : "paper"
          }
        >
          <div className="flex flex-wrap items-center gap-4">
            <ButtonLink href="/" variant="outline" external={false}>
              Back to the board
            </ButtonLink>
          </div>
          <Signoff>— The MHacks Team</Signoff>
        </LetterSection>
      </article>
    </ConsoleShell>
  );
}
