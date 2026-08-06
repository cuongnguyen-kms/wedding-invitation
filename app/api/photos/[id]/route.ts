import { NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody } from "@/lib/api";
import { deletePhoto, movePhoto, updatePhotoAlt } from "@/lib/photos";

type RouteParams = {
  params: Promise<{ id: string }>;
};

const patchSchema = z.object({
  alt: z.string().trim().max(200, "Alt text is too long").optional(),
  move: z.enum(["up", "down"]).optional(),
});

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;

  const body = await parseJsonBody(request);
  if (!body.ok) {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body.data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Photo could not be updated", issues: parsed.error.issues.map((issue) => issue.message) },
      { status: 400 },
    );
  }

  try {
    if (parsed.data.alt !== undefined) {
      await updatePhotoAlt(id, parsed.data.alt);
    }
    if (parsed.data.move) {
      await movePhoto(id, parsed.data.move);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Photo could not be updated" },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    await deletePhoto(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Photo not found" }, { status: 404 });
  }
}
