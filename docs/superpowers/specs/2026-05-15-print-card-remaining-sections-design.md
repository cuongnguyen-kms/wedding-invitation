# Print-Card Remaining Sections Design

Date: 2026-05-15

## Goal

Convert the remaining public invitation sections into the same print-card visual language as the updated "Our Wedding" and "Wedding Events" sections.

References:

- `docs/requirements/ui/Section3.png`
- `docs/requirements/ui/Section4.png`
- `docs/requirements/ui/Section5.png`
- `docs/requirements/ui/Section6.png`

## Chosen Approach

Use Option A: convert all remaining visible invitation sections to print-card style while preserving the current component boundaries and interaction behavior.

This keeps the visual experience consistent without changing music, auto-scroll, or future guest/admin architecture.

## Global Visual Direction

The remaining sections should look like one continuous printed wedding invitation:

- Soft cream/blush paper background.
- Watercolor floral decorations from local assets.
- Muted rose-brown headings and body text.
- Elegant serif headings.
- Centered formal layouts.
- Minimal modern cards.
- No heavy gradients or saturated UI controls.
- Mobile-first and overflow-safe.

Use local floral assets already copied to:

- `public/images/florals/corner-bouquet.webp`
- `public/images/florals/side-bouquet.webp`
- `public/images/florals/side-bouquet-alt.webp`

## Section Mapping

### Photo Gallery

Current component:

- `components/invitation/PhotoGallery.tsx`

Target reference:

- `Section3.png`

New design:

- Title: `ALBUM ANH CUOI` or English equivalent if the rest of the page stays English.
- 2x2 image grid.
- Soft rounded image corners.
- Optional white script overlay on a few images.
- Left floral side decoration.
- Avoid card-heavy framing.

### Reception / Countdown

Current component:

- `components/invitation/CountdownTimer.tsx`

Target reference:

- `Section4.png`

New design:

- Replace box countdown with formal event/date display.
- Show reception title: `THONG TIN TIEC CUOI`.
- Show reception time/date using typography instead of numeric countdown cards.
- Add a compact calendar card for the wedding month.
- Add RSVP CTA styled like the reference: muted rose button.

Behavior:

- This section does not need a live second-by-second countdown after this redesign.
- The existing component name can remain `CountdownTimer` for now to avoid broad routing changes, but internally it becomes a print-card date/reception block.

### Location

Current component:

- `components/invitation/MapSection.tsx`

Target reference:

- `Section5.png`

New design:

- Title: `TIEC CUOI SE TO CHUC TAI`.
- Center venue name/address.
- Show embedded map or existing venue image/map proxy in a clean rectangular frame.
- Use left-side floral decoration.
- Keep `Open Map` behavior available as a muted text/button link.

### Wedding-Day Schedule

Current component:

- `components/invitation/LoveStoryTimeline.tsx`

Target reference:

- `Section5.png`

New design:

- Convert from love-story milestones to wedding-day schedule.
- Title: `LICH TRINH NGAY CUOI`.
- Vertical line with dots.
- Time on the left, activity on the right.
- Use static schedule items from config.

Data examples:

- `17:30` Don khach
- `18:30` Khai tiec
- `18:45` Rot ruou, cat banh
- `19:00` Phuc vu mon chinh
- `21:00` Ket thuc tiec

### RSVP / Guestbook

Current component:

- `components/invitation/RsvpForm.tsx`

Target reference:

- `Section6.png`

New design:

- Title: `SO LUU BUT`.
- Guestbook-style form with name and message fields.
- Muted rose borders.
- Muted rose submit button.
- Keep mock submission behavior for now.
- Do not add database-backed RSVP logic in this CR.

### Closing

Current component:

- `components/invitation/ClosingMessage.tsx`

Target reference:

- `Section6.png`

New design:

- Formal closing message centered near the bottom.
- Optional wedding gift envelope visual can be deferred.
- Keep the couple names or a thank-you line.

## Data Changes

Extend `weddingConfig` with:

```ts
schedule: [
  { time: "17:30", activity: "Don khach" },
  { time: "18:30", activity: "Khai tiec" },
  { time: "18:45", activity: "Rot ruou, cat banh" },
  { time: "19:00", activity: "Phuc vu mon chinh" },
  { time: "21:00", activity: "Ket thuc tiec" }
]
```

Use existing event data for ceremony and reception. If a component needs reception data, use `events[1]`.

## Component Changes

Update:

- `components/invitation/PhotoGallery.tsx`
- `components/invitation/CountdownTimer.tsx`
- `components/invitation/MapSection.tsx`
- `components/invitation/LoveStoryTimeline.tsx`
- `components/invitation/RsvpForm.tsx`
- `components/invitation/ClosingMessage.tsx`
- `components/invitation/InvitationPage.tsx`
- `lib/wedding-config.ts`

Optional:

- Add small shared CSS classes in `app/globals.css` if repeated print-card styling becomes noisy.

## Constraints

- Do not change music playback.
- Do not change auto-scroll behavior.
- Do not add real database RSVP in this CR.
- Do not add admin features in this CR.
- Do not introduce a new UI library.
- Keep all text readable over floral art.
- Avoid overlap on mobile.
- Keep existing build and lint green.

## Verification

Run:

- `npm.cmd run lint`
- `npm.cmd run build`

Manual checks:

- Mobile view has no text/image overlap.
- Desktop view feels like a continuous printed invitation.
- Music still starts from the opening click.
- Smooth auto-scroll still works.
- Forms remain clickable and do not toggle auto-scroll unexpectedly.
