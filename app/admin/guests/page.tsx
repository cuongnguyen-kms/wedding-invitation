import Link from "next/link";
import { AdminGuestTable } from "@/components/admin/AdminGuestTable";
import { listGuests } from "@/lib/guests";
import type { RsvpStatus } from "@/lib/generated/prisma/enums";

type GuestsPageProps = {
  searchParams: Promise<{ q?: string; group?: string; rsvpStatus?: string }>;
};

const RSVP_STATUS_VALUES: RsvpStatus[] = ["PENDING", "ATTENDING", "NOT_ATTENDING"];

function parseRsvpStatus(value: string | undefined): RsvpStatus | undefined {
  return RSVP_STATUS_VALUES.find((status) => status === value);
}

export default async function AdminGuestsPage({ searchParams }: GuestsPageProps) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const group = params.group?.trim() || undefined;
  const rsvpStatus = parseRsvpStatus(params.rsvpStatus);

  const [guests, allGuests] = await Promise.all([
    listGuests({ q, group, rsvpStatus }),
    listGuests(),
  ]);

  const groups = Array.from(
    new Set(allGuests.map((guest) => guest.group).filter((value): value is string => Boolean(value))),
  ).sort();

  const hasActiveFilters = Boolean(q || group || rsvpStatus);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Guests</h1>

      <form className="mt-6 flex flex-wrap items-center gap-3" method="GET">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name"
          className="min-h-10 rounded-md border border-stone-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
        />
        <select
          name="group"
          defaultValue={group ?? ""}
          className="min-h-10 rounded-md border border-stone-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
        >
          <option value="">All groups</option>
          {groups.map((groupOption) => (
            <option key={groupOption} value={groupOption}>
              {groupOption}
            </option>
          ))}
        </select>
        <select
          name="rsvpStatus"
          defaultValue={rsvpStatus ?? ""}
          className="min-h-10 rounded-md border border-stone-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="ATTENDING">Attending</option>
          <option value="NOT_ATTENDING">Not attending</option>
        </select>
        <button
          type="submit"
          className="min-h-10 rounded-md bg-rose-700 px-4 text-sm font-medium text-white transition hover:bg-rose-800"
        >
          Filter
        </button>
        {hasActiveFilters ? (
          <Link href="/admin/guests" className="text-sm text-stone-500 hover:underline">
            Clear filters
          </Link>
        ) : null}
      </form>

      <p className="mt-4 text-sm text-stone-500">
        {guests.length} guest{guests.length === 1 ? "" : "s"}
      </p>

      <div className="mt-3">
        <AdminGuestTable guests={guests} />
      </div>
    </div>
  );
}
