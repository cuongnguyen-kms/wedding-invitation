import { getPhotoVariant } from "@/lib/photos";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const photo = await getPhotoVariant(id, "thumb");

  if (!photo) {
    return new Response("Photo not found", { status: 404 });
  }

  return new Response(new Uint8Array(photo.data), {
    headers: {
      "Content-Type": photo.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
