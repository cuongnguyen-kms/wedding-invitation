import { PhotoManager } from "@/components/admin/PhotoManager";
import { listPhotos } from "@/lib/photos";

export const dynamic = "force-dynamic";

export default async function AdminPhotosPage() {
  const photos = await listPhotos();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Gallery photos</h1>
      <p className="mt-2 text-sm text-stone-500">
        Uploaded photos replace the developer-managed gallery on the public invitation. Reorder
        with the arrows — guests see photos in this order.
      </p>
      <PhotoManager photos={photos} />
    </div>
  );
}
