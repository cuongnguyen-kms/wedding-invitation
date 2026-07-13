import Link from "next/link";

export default function InvitationNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-rose-50 px-6 text-center text-stone-900">
      <div className="mx-auto max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.38em] text-rose-500">
          Wedding Invitation
        </p>
        <h1 className="mt-6 font-serif text-3xl text-rose-950 sm:text-4xl">
          We couldn&apos;t find this invitation
        </h1>
        <p className="mt-4 text-stone-600">
          This invitation link may have expired or been typed incorrectly. Please check the link
          your hosts sent you, or reach out to them directly.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-rose-700 px-7 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-rose-200 transition hover:bg-rose-800 focus:outline-none focus:ring-4 focus:ring-rose-200"
        >
          View the invitation
        </Link>
      </div>
    </main>
  );
}
