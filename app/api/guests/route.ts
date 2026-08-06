import { NextResponse } from "next/server";
import { parseJsonBody } from "@/lib/api";
import { createGuest, listGuests } from "@/lib/guests";
import type { RsvpStatus } from "@/lib/generated/prisma-postgres/enums";
import { createGuestSchema } from "@/schemas/guest";

const RSVP_STATUS_VALUES: RsvpStatus[] = ["PENDING", "ATTENDING", "NOT_ATTENDING"];

function parseRsvpStatus(value: string | null): RsvpStatus | undefined {
  return RSVP_STATUS_VALUES.find((status) => status === value);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || undefined;
  const group = searchParams.get("group")?.trim() || undefined;
  const rsvpStatus = parseRsvpStatus(searchParams.get("rsvpStatus"));

  const guests = await listGuests({ q, group, rsvpStatus });

  return NextResponse.json({ guests });
}

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (!body.ok) {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = createGuestSchema.safeParse(body.data);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Guest could not be created",
        issues: parsed.error.issues.map((issue) => issue.message),
      },
      { status: 400 },
    );
  }

  try {
    const guest = await createGuest(parsed.data);
    return NextResponse.json({ guest }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Guest could not be created" },
      { status: 400 },
    );
  }
}
