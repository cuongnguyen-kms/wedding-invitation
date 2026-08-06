import { NextResponse } from "next/server";
import { parseJsonBody } from "@/lib/api";
import { getSettingsInput, updateSettings } from "@/lib/settings";
import { weddingSettingsSchema } from "@/schemas/settings";

export async function GET() {
  const settings = await getSettingsInput();
  return NextResponse.json({ settings });
}

export async function PATCH(request: Request) {
  const body = await parseJsonBody(request);
  if (!body.ok) {
    return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
  }

  const parsed = weddingSettingsSchema.safeParse(body.data);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Settings could not be saved",
        issues: parsed.error.issues.map((issue) => issue.message),
      },
      { status: 400 },
    );
  }

  try {
    const content = await updateSettings(parsed.data);
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Settings could not be saved" },
      { status: 400 },
    );
  }
}
