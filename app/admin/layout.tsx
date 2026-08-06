import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/admin"
              className="rounded-md text-rose-700 hover:underline focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/guests"
              className="rounded-md text-rose-700 hover:underline focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              Guests
            </Link>
            <Link
              href="/admin/settings"
              className="rounded-md text-rose-700 hover:underline focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              Settings
            </Link>
            <Link
              href="/admin/photos"
              className="rounded-md text-rose-700 hover:underline focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              Photos
            </Link>
          </nav>
          <p className="text-xs text-stone-400">
            Protected by HTTP Basic Auth — not a full login system.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
