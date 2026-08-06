import { NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody } from "@/lib/api";
import { createPhoto, listPhotos } from "@/lib/photos";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

const uploadSchema = z.object({
  imageData: z.string().min(1, "Image data is required"),
  alt: z.string().trim().max(200, "Alt text is too long").optional(),
});

export async function GET() {
  const photos = await listPhotos();
  return NextResponse.json({ photos });
}

export async function POST(request: Request) {
  const body = await parseJsonBody(request);
  if (!body.ok) {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = uploadSchema.safeParse(body.data);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Photo could not be uploaded", issues: parsed.error.issues.map((issue) => issue.message) },
      { status: 400 },
    );
  }

  const base64 = parsed.data.imageData.replace(/^data:[^;]+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");

  if (buffer.length === 0) {
    return NextResponse.json({ error: "Image data must be base64-encoded" }, { status: 400 });
  }

  if (buffer.length > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Image is too large (max 15MB)" }, { status: 400 });
  }

  try {
    const photo = await createPhoto({ data: buffer, alt: parsed.data.alt });
    return NextResponse.json({ photo }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Photo could not be processed — is it a valid image file?" },
      { status: 400 },
    );
  }
}
