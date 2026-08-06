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

  const exportParams = new URLSearchParams();
  if (q) exportParams.set("q", q);
  if (group) exportParams.set("group", group);
  if (rsvpStatus) exportParams.set("rsvpStatus", rsvpStatus);
  const exportHref = `/api/guests/export${exportParams.size > 0 ? `?${exportParams.toString()}` : ""}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Guests</h1>
        <div className="flex flex-wrap gap-3">
          <a
            href={exportHref}
            className="min-h-10 inline-flex items-center rounded-md border border-stone-300 px-4 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            Export CSV
          </a>
          <Link
            href="/admin/guests/import"
            className="min-h-10 inline-flex items-center rounded-md border border-stone-300 px-4 text-sm font-medium text-stone-700 transition hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            Import CSV
          </Link>
          <Link
            href="/admin/guests/new"
            className="min-h-10 inline-flex items-center rounded-md bg-rose-700 px-4 text-sm font-medium text-white transition hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            Add guest
          </Link>
        </div>
      </div>

      <form className="mt-6 flex flex-wrap items-end gap-3" method="GET">
        <label className="grid gap-1 text-sm font-medium text-stone-700">
          <span>Search by name</span>
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search by name"
            className="min-h-10 w-full rounded-md border border-stone-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 sm:w-48"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-stone-700">
          <span>Group</span>
          <select
            name="group"
            defaultValue={group ?? ""}
            className="min-h-10 w-full rounded-md border border-stone-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 sm:w-auto"
          >
            <option value="">All groups</option>
            {groups.map((groupOption) => (
              <option key={groupOption} value={groupOption}>
                {groupOption}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm font-medium text-stone-700">
          <span>RSVP status</span>
          <select
            name="rsvpStatus"
            defaultValue={rsvpStatus ?? ""}
            className="min-h-10 w-full rounded-md border border-stone-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 sm:w-auto"
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ATTENDING">Attending</option>
            <option value="NOT_ATTENDING">Not attending</option>
          </select>
        </label>
        <button
          type="submit"
          className="min-h-10 rounded-md bg-rose-700 px-4 text-sm font-medium text-white transition hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          Filter
        </button>
        {hasActiveFilters ? (
          <Link
            href="/admin/guests"
            className="min-h-10 inline-flex items-center rounded-md text-sm text-stone-500 hover:underline focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
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
