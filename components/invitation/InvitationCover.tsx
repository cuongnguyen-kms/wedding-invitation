import { useState } from "react";
import type { WeddingConfig } from "@/lib/wedding-config";
import { dispatchInvitationOpenEvent } from "./MusicPlayer";
import { GuestGreeting } from "./GuestGreeting";

type InvitationCoverProps = {
  couple: WeddingConfig["couple"];
  guest?: WeddingConfig["guest"];
  isOpened: boolean;
  onOpen: () => void;
};

// Keep in sync with the panel transition duration in globals.css
// (.split-panel) so this covers the split finishing.
const SPLIT_ANIMATION_MS = 800;

// Extra hold after the split finishes so the guest has time to read their
// name in the greeting pill before the cover hands off to the full page.
const NAME_READ_PAUSE_MS = 1500;

export function InvitationCover({
  couple,
  guest,
  isOpened,
  onOpen,
}: InvitationCoverProps) {
  const [isOpening, setIsOpening] = useState(false);

  function handleSealTap() {
    if (isOpening) {
      return;
    }
    setIsOpening(true);

    // Audio must start synchronously inside the click handler - a delayed
    // dispatch (e.g. from setTimeout) loses the user-gesture context mobile
    // browsers require to allow playback. See MusicPlayer.tsx.
    dispatchInvitationOpenEvent();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      onOpen();
      return;
    }

    window.setTimeout(onOpen, SPLIT_ANIMATION_MS + NAME_READ_PAUSE_MS);
  }

  return (
    <section
      className={`fixed inset-0 z-40 isolate flex h-dvh items-center overflow-hidden px-5 py-12 text-center transition duration-700 ${
        isOpened ? "pointer-events-none translate-y-[-4rem] opacity-0" : "opacity-100"
      }`}
      aria-hidden={isOpened}
    >
      <div className="floral-corner floral-corner-left" aria-hidden="true" />
      <div className="floral-corner floral-corner-right" aria-hidden="true" />
      <div className="absolute inset-0 bg-rose-50" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-rose-100/80 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center">
        <p className="text-xs font-semibold uppercase tracking-[0.38em] text-rose-500">
          Wedding Invitation
        </p>
        <h1 className="mt-6 font-serif text-5xl leading-tight text-rose-950 sm:text-7xl">
          <span className="block">{couple.groom} &amp;</span>
          <span className="block">{couple.bride}</span>
        </h1>
        <div className="my-6 h-px w-28 bg-rose-200" />
        <p className="text-lg font-medium text-stone-700">{couple.dateLabel}</p>
        {guest ? (
          <div className="mt-7">
            <GuestGreeting greeting={guest.greeting} name={guest.name} />
          </div>
        ) : null}
      </div>

      <div className="absolute inset-0 z-20">
        <div
          className={`split-panel split-panel-left ${isOpening ? "split-panel-open" : ""}`}
          aria-hidden="true"
        />
        <div
          className={`split-panel split-panel-right ${isOpening ? "split-panel-open" : ""}`}
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={handleSealTap}
          disabled={isOpening}
          aria-label="Open invitation"
          className={`cover-seal ${isOpening ? "cover-seal-open" : ""}`}
        >
          <span aria-hidden="true">囍</span>
        </button>
        <p
          className={`cover-hint transition-opacity duration-300 ${
            isOpening ? "opacity-0" : "opacity-100"
          }`}
        >
          Tap the seal to open
        </p>
      </div>
    </section>
  );
}
