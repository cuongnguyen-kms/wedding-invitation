import type { Guest } from "@/lib/generated/prisma/client";
import { CopyInviteLinkButton } from "./CopyInviteLinkButton";

type AdminGuestTableProps = {
  guests: Guest[];
};

const RSVP_LABELS: Record<Guest["rsvpStatus"], string> = {
  PENDING: "Pending",
  ATTENDING: "Attending",
  NOT_ATTENDING: "Not attending",
};

export function AdminGuestTable({ guests }: AdminGuestTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Group</th>
            <th className="px-4 py-3">RSVP</th>
            <th className="px-4 py-3">Guests</th>
            <th className="px-4 py-3">Invitation link</th>
          </tr>
        </thead>
        <tbody>
          {guests.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-stone-400">
                No guests match these filters.
              </td>
            </tr>
          ) : (
            guests.map((guest) => (
              <tr key={guest.id} className="border-b border-stone-100 last:border-0">
                <td className="px-4 py-3 font-medium">{guest.name}</td>
                <td className="px-4 py-3 text-stone-500">{guest.group ?? "—"}</td>
                <td className="px-4 py-3">{RSVP_LABELS[guest.rsvpStatus]}</td>
                <td className="px-4 py-3">{guest.guestCount}</td>
                <td className="px-4 py-3">
                  <CopyInviteLinkButton slug={guest.slug} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
