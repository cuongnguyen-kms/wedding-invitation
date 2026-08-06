import { toCsv } from "@/lib/csv";
import type { RsvpStatus } from "@/lib/generated/prisma-postgres/enums";
import { listGuests } from "@/lib/guests";

const RSVP_STATUS_VALUES: RsvpStatus[] = ["PENDING", "ATTENDING", "NOT_ATTENDING"];

function parseRsvpStatus(value: string | null): RsvpStatus | undefined {
  return RSVP_STATUS_VALUES.find((status) => status === value);
}

const CSV_HEADER = [
  "name",
  "slug",
  "phone",
  "email",
  "group",
  "invitationTitle",
  "guestCount",
  "rsvpStatus",
  "message",
  "invitationUrl",
];

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || undefined;
  const group = searchParams.get("group")?.trim() || undefined;
  const rsvpStatus = parseRsvpStatus(searchParams.get("rsvpStatus"));

  const guests = await listGuests({ q, group, rsvpStatus });

  const rows = [
    CSV_HEADER,
    ...guests.map((guest) => [
      guest.name,
      guest.slug,
      guest.phone ?? "",
      guest.email ?? "",
      guest.group ?? "",
      guest.invitationTitle ?? "",
      String(guest.guestCount),
      guest.rsvpStatus,
      guest.message ?? "",
      `${origin}/invite/${guest.slug}`,
    ]),
  ];

  return new Response(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="guests.csv"`,
    },
  });
}
