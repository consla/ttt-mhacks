import Image from "next/image";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Rail } from "./rail";

function ConsoleFieldPhoto({ src }: { src: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-[#8f8f8a]"
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        priority
        className="object-cover object-center"
      />
    </div>
  );
}

/**
 * The console shell: a screened surface with a sheet of paper standing on it.
 *
 * `centred` is for a screen short enough to sit in the middle of the window
 * rather than pinned to the top.
 *
 * Ported from the MHacks dashboard's console component set.
 */
export function ConsoleShell({
  children,
  width = "wide",
  centred = false,
  field = true,
  fieldSrc = "/decision/bg-console.jpg",
}: {
  children: ReactNode;
  width?: "wide" | "letter";
  centred?: boolean;
  /** Whether the shell paints its own background photo. */
  field?: boolean;
  /** Which photo stands behind the sheet, when `field` is true. */
  fieldSrc?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-screen flex-col px-2.5 pt-3 pb-4 sm:px-6.5 sm:pt-9 sm:pb-11",
        centred && "justify-center",
      )}
    >
      {field ? <ConsoleFieldPhoto src={fieldSrc} /> : null}
      <div
        className={cn(
          "console-sheet relative z-10 mx-auto w-full border border-ui-line-strong shadow-[0_2px_30px_rgba(23,23,26,0.22)]",
          width === "letter" ? "max-w-[680px]" : "max-w-[1064px]",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** The shell's own padding. A letter sets its own, section by section. */
export function ConsolePage({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[26px] px-4 pt-6.5 pb-7.5 sm:gap-[34px] sm:px-[46px] sm:pt-[42px] sm:pb-12">
      {children}
    </div>
  );
}

/**
 * The masthead. The title carries the console prompt and a blinking block
 * cursor — the one piece of ambient motion on the page, and the thing that
 * says this surface is a terminal rather than a document.
 */
export function Masthead({
  title,
  trailing,
}: {
  title: string;
  trailing?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4.5">
      <Rail corner="top" label="MHACKS 2026" trailing={trailing} />

      <h1 className="font-red-hat-mono text-[23px] leading-tight font-bold tracking-[-0.01em] text-balance text-ui-ink sm:text-[28px]">
        <span aria-hidden className="font-glyph select-none">
          &gt;
        </span>{" "}
        {title}{" "}
        <span
          aria-hidden
          className="console-cursor inline-block font-glyph select-none"
        >
          ▌
        </span>
      </h1>
    </header>
  );
}

/** The rule that closes the sheet. */
export function ConsoleFooterRule() {
  return <Rail corner="bottom" />;
}
