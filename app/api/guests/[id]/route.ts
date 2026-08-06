import { NextResponse } from "next/server";
import { parseJsonBody } from "@/lib/api";
import { deleteGuest, getGuestById, updateGuest } from "@/lib/guests";
import { updateGuestSchema } from "@/schemas/guest";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const guest = await getGuestById(id);

  if (!guest) {
    return NextResponse.json({ error: "Guest not found" }, { status: 404 });
  }

  return NextResponse.json({ guest });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;

  const existing = await getGuestById(id);
  if (!existing) {
    return NextResponse.json({ error: "Guest not found" }, { status: 404 });
  }

  const body = await parseJsonBody(request);
  if (!body.ok) {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = updateGuestSchema.safeParse(body.data);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Guest could not be updated",
        issues: parsed.error.issues.map((issue) => issue.message),
      },
      { status: 400 },
    );
  }

  try {
    const guest = await updateGuest(id, parsed.data);
    return NextResponse.json({ guest });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Guest could not be updated" },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  const existing = await getGuestById(id);
  if (!existing) {
    return NextResponse.json({ error: "Guest not found" }, { status: 404 });
  }

  await deleteGuest(id);

  return NextResponse.json({ success: true });
}
