import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="flex w-full max-w-2xl items-center justify-between px-2 pt-6">
      <div className="flex items-center gap-2">
        <Image
          src="/mhacks-logo.png"
          alt="MHacks logo"
          width={28}
          height={27}
        />
        <span className="font-mono text-xs uppercase tracking-widest text-moss-300">
          MHacks Tic-Tac-Toe
        </span>
      </div>
      <Link
        href="/tutorial"
        className="rounded-full bg-cream px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-moss-900 transition hover:bg-leaf"
      >
        Tutorial
      </Link>
    </nav>
  );
}
