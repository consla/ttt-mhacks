import Image from "next/image";

export function Header() {
  return (
    <header className="flex flex-col items-center gap-4 pt-12 pb-8 text-center">
      <Image
        src="/mhacks-logo.png"
        alt="MHacks logo"
        width={72}
        height={70}
        priority
      />
      <h1 className="font-display font-bold text-5xl text-cream">
        Tic-Tac-Toe
      </h1>
      <p className="font-mono text-xs uppercase tracking-widest text-moss-300">
        {/* Build something that grows. */}
      </p>
    </header>
  );
}
