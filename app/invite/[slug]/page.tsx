import { notFound } from "next/navigation";
import { InvitationPage } from "@/components/invitation/InvitationPage";
import { getGuestBySlug } from "@/lib/guests";
import { weddingConfig } from "@/lib/wedding-config";

type InvitePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { slug } = await params;
  const guest = await getGuestBySlug(slug);

  if (!guest) {
    notFound();
  }

  const guestName = guest.invitationTitle ? `${guest.invitationTitle} ${guest.name}` : guest.name;

  return (
    <InvitationPage
      config={{
        ...weddingConfig,
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
