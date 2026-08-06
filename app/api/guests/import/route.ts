import { NextResponse } from "next/server";
import { parseCsv } from "@/lib/csv";
import { createGuest } from "@/lib/guests";
import { createGuestSchema } from "@/schemas/guest";

const COLUMN_ALIASES: Record<string, string> = {
  name: "name",
  slug: "slug",
  phone: "phone",
  email: "email",
  group: "group",
  invitationtitle: "invitationTitle",
  guestcount: "guestCount",
  rsvpstatus: "rsvpStatus",
  message: "message",
};

function rowToGuestInput(header: string[], row: string[]): Record<string, unknown> {
  const input: Record<string, unknown> = {};

  header.forEach((column, index) => {
    const field = COLUMN_ALIASES[column.trim().toLowerCase()];
    if (!field) return;

    const value = row[index]?.trim();
    if (!value) return;

    input[field] = field === "guestCount" ? Number(value) : value;
  });

  return input;
}

export async function POST(request: Request) {
  const text = await request.text();

  if (!text.trim()) {
    return NextResponse.json({ error: "Request body must be a non-empty CSV file" }, { status: 400 });
  }

  const rows = parseCsv(text);
  if (rows.length === 0) {
    return NextResponse.json({ error: "CSV file has no rows" }, { status: 400 });
  }

  const [header, ...dataRows] = rows;

  if (!header.some((column) => column.trim().toLowerCase() === "name")) {
    return NextResponse.json({ error: "CSV file must include a 'name' column" }, { status: 400 });
  }

  let created = 0;
  const errors: { row: number; message: string }[] = [];

  for (const [index, row] of dataRows.entries()) {
    const rowNumber = index + 2; // account for the header row, 1-indexed
    const input = rowToGuestInput(header, row);
    const parsed = createGuestSchema.safeParse(input);

    if (!parsed.success) {
      errors.push({ row: rowNumber, message: parsed.error.issues.map((issue) => issue.message).join("; ") });
      continue;
    }

    try {
      await createGuest(parsed.data);
      created += 1;
    } catch (error) {
      errors.push({
        row: rowNumber,
        message: error instanceof Error ? error.message : "Guest could not be created",
      });
    }
  }

  return NextResponse.json({ created, errors });
}
