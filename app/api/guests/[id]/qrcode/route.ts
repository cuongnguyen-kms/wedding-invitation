import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { getGuestById } from "@/lib/guests";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const guest = await getGuestById(id);

  if (!guest) {
    return NextResponse.json({ error: "Guest not found" }, { status: 404 });
  }

  const { origin } = new URL(request.url);
  const invitationUrl = `${origin}/invite/${guest.slug}`;
  const png = await QRCode.toBuffer(invitationUrl, { width: 480, margin: 2 });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `inline; filename="${guest.slug}-qrcode.png"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
