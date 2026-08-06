import { notFound } from "next/navigation";
import { InvitationPage } from "@/components/invitation/InvitationPage";
import { getGuestBySlug } from "@/lib/guests";
import { listGalleryPhotos } from "@/lib/photos";
import { getWeddingContent } from "@/lib/settings";
import { weddingConfig } from "@/lib/wedding-config";

type InvitePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { slug } = await params;
  const [guest, content, uploadedPhotos] = await Promise.all([
    getGuestBySlug(slug),
    getWeddingContent(),
    listGalleryPhotos(),
  ]);

  if (!guest) {
    notFound();
  }

  const guestName = guest.invitationTitle ? `${guest.invitationTitle} ${guest.name}` : guest.name;
  const gallery = uploadedPhotos.length > 0 ? uploadedPhotos : weddingConfig.gallery;

  return (
    <InvitationPage
      config={{
        ...weddingConfig,
        ...content,
        gallery,
        guest: {
          greeting: weddingConfig.guest.greeting,
          name: guestName,
        },
      }}
      rsvp={{
        slug: guest.slug,
        rsvpStatus: guest.rsvpStatus,
        guestCount: guest.guestCount,
        message: guest.message,
      }}
    />
  );
}
