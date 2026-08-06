import Link from "next/link";
import { RsvpSummaryCards } from "@/components/admin/RsvpSummaryCards";
import { listGuests } from "@/lib/guests";

// Without this, Next prerenders the dashboard once at build time (no fetch/
// searchParams to signal dynamic rendering) and would keep serving stale
// RSVP counts in production instead of querying the database per request.
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const guests = await listGuests();

  const summary = {
    total: guests.length,
    attending: guests.filter((guest) => guest.rsvpStatus === "ATTENDING").length,
    notAttending: guests.filter((guest) => guest.rsvpStatus === "NOT_ATTENDING").length,
    pending: guests.filter((guest) => guest.rsvpStatus === "PENDING").length,
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">RSVP Summary</h1>
      <div className="mt-6">
        <RsvpSummaryCards summary={summary} />
      </div>
      <Link
        href="/admin/guests"
        className="mt-8 inline-block rounded-md text-sm font-medium text-rose-700 hover:underline focus:outline-none focus:ring-2 focus:ring-rose-300"
      >
        View guest list →
      </Link>
    </div>
  );
}
