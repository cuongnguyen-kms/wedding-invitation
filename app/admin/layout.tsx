import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/admin" className="text-rose-700 hover:underline">
              Dashboard
            </Link>
            <Link href="/admin/guests" className="text-rose-700 hover:underline">
              Guests
            </Link>
          </nav>
          <p className="text-xs text-stone-400">
            Local admin area — not authentication-protected yet.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
