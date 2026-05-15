import type { WeddingConfig } from "@/lib/wedding-config";
import { GuestGreeting } from "./GuestGreeting";

type InvitationCoverProps = {
  couple: WeddingConfig["couple"];
  guest: WeddingConfig["guest"];
  isOpened: boolean;
  onOpen: () => void;
};

export function InvitationCover({
  couple,
  guest,
  isOpened,
  onOpen,
}: InvitationCoverProps) {
  return (
    <section
      className={`fixed inset-0 z-40 isolate flex min-h-screen items-center overflow-hidden px-5 py-12 text-center transition duration-700 ${
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
          {couple.displayNames}
        </h1>
        <div className="my-6 h-px w-28 bg-rose-200" />
        <p className="text-lg font-medium text-stone-700">{couple.dateLabel}</p>
        <div className="mt-7">
          <GuestGreeting greeting={guest.greeting} name={guest.name} />
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-rose-700 px-7 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-rose-200 transition hover:bg-rose-800 focus:outline-none focus:ring-4 focus:ring-rose-200"
        >
          Open Invitation
        </button>
      </div>
    </section>
  );
}
