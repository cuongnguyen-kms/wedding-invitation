"use client";

import { useState } from "react";
import type { RsvpStatus } from "@/lib/generated/prisma-postgres/enums";
import type { WeddingConfig } from "@/lib/wedding-config";
import { AutoScrollController } from "./AutoScrollController";
import { ClosingMessage } from "./ClosingMessage";
import { CountdownTimer } from "./CountdownTimer";
import { CoupleHero } from "./CoupleHero";
import { EventDetails } from "./EventDetails";
import { InvitationCover } from "./InvitationCover";
import { LoveStoryTimeline } from "./LoveStoryTimeline";
import { MapSection } from "./MapSection";
import { dispatchInvitationOpenEvent, MusicPlayer } from "./MusicPlayer";
import { PhotoGallery } from "./PhotoGallery";
import { RsvpForm } from "./RsvpForm";
import { Section } from "./Section";

type InvitationPageProps = {
  config: WeddingConfig;
  rsvp?: {
    slug: string;
    rsvpStatus: RsvpStatus;
    guestCount: number;
    message: string | null;
  };
};

export function InvitationPage({ config, rsvp }: InvitationPageProps) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <main className="invitation-shell min-h-screen overflow-hidden bg-rose-50 text-stone-900">
      <InvitationCover
        couple={config.couple}
        guest={rsvp ? config.guest : undefined}
        isOpened={isOpened}
        onOpen={() => {
          dispatchInvitationOpenEvent();
          setIsOpened(true);
        }}
      />
      <MusicPlayer isVisible={isOpened} />
      <AutoScrollController isOpened={isOpened} />
      <Section id="couple" className="pt-24">
        <CoupleHero couple={config.couple} photos={config.gallery} />
      </Section>
      <Section className="bg-white/45">
        <EventDetails
          couple={config.couple}
          events={config.events}
          families={config.families}
        />
      </Section>
      <Section>
        <CountdownTimer event={config.events[1]} />
      </Section>
      <Section className="bg-white/45">
        <LoveStoryTimeline items={config.schedule} />
      </Section>
      <Section>
        <MapSection location={config.location} />
      </Section>
      <Section className="bg-white/45">
        <PhotoGallery photos={config.gallery} />
      </Section>
      {rsvp ? (
        <Section>
          <RsvpForm
            guestSlug={rsvp.slug}
            initialRsvpStatus={rsvp.rsvpStatus}
            initialGuestCount={rsvp.guestCount}
            initialMessage={rsvp.message}
          />
        </Section>
      ) : null}
      <ClosingMessage couple={config.couple} />
    </main>
  );
}
