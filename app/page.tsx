import { InvitationPage } from "@/components/invitation/InvitationPage";
import { listGalleryPhotos } from "@/lib/photos";
import { getWeddingContent } from "@/lib/settings";
import { weddingConfig } from "@/lib/wedding-config";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [content, uploadedPhotos] = await Promise.all([getWeddingContent(), listGalleryPhotos()]);
  const gallery = uploadedPhotos.length > 0 ? uploadedPhotos : weddingConfig.gallery;

  return <InvitationPage config={{ ...weddingConfig, ...content, gallery }} />;
}
