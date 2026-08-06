import { NextResponse } from "next/server";
import { parseJsonBody } from "@/lib/api";
import { getGuestBySlug, updateRsvpBySlug } from "@/lib/guests";
import { rsvpSubmissionSchema } from "@/schemas/rsvp";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

export async function POST(request: Request, { params }: RouteParams) {
  const { slug } = await params;

  const guest = await getGuestBySlug(slug);
  if (!guest) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  const body = await parseJsonBody(request);
  if (!body.ok) {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = rsvpSubmissionSchema.safeParse(body.data);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "RSVP could not be submitted",
        issues: parsed.error.issues.map((issue) => issue.message),
      },
      { status: 400 },
    );
  }

  const updated = await updateRsvpBySlug(slug, parsed.data);

  return NextResponse.json({
    guest: {
      name: updated.name,
      invitationTitle: updated.invitationTitle,
      guestCount: updated.guestCount,
      rsvpStatus: updated.rsvpStatus,
      message: updated.message,
    },
  });
}
