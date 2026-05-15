# Reference-Style Invitation Sections Design

Date: 2026-05-15

## Goal

Update only the "Our Wedding" and "Wedding Events" areas so they more closely match the UI references in:

- `docs/requirements/ui/Opening.png`
- `docs/requirements/ui/Detail.png`

The rest of the invitation page should stay structurally intact.

## Chosen Approach

Use Option A: closely match the reference style for these two sections only.

This gives the invitation its strongest template-like visual identity without expanding scope into a full page redesign.

## Visual Direction

The target style is a printed wedding invitation sheet:

- Soft cream and blush background.
- Watercolor floral decorations near corners and edges.
- Muted rose-brown text.
- Elegant serif typography.
- Large centered couple names.
- Formal Vietnamese wedding wording.
- More vertical composition than the current modern card layout.
- Mobile-first layout with no horizontal overflow.

Use the provided local floral assets when helpful:

- `docs/requirements/ui/asset_1.webp`: large corner arrangement, best for top-left or wide section corner decoration.
- `docs/requirements/ui/asset_2.webp`: tall floral side arrangement, best for right-side event decoration.
- `docs/requirements/ui/asset_3.webp`: tall floral side arrangement, alternate crop for mobile or left-side decoration.

During implementation, copy selected assets into `public/images/florals/` with clear names before referencing them from UI code.

## Section 1: Our Wedding

Current behavior:

- Two-column modern photo/text hero.
- Large rectangular image on the left.
- Couple names and intro copy on the right.

New design:

- Convert to a reference-style romantic composition.
- Use a pale floral paper-like background.
- Show groom/bride labels above each name, similar to the opening reference.
- Display couple names with large serif text.
- Add two overlapping tilted photo frames below/near the names.
- Use `asset_1.webp` as the main floral corner decoration if it fits cleanly.
- Keep the section graceful on mobile by stacking names and photos vertically.
- Preserve existing couple data from `weddingConfig`.

Expected content:

- Groom label and name.
- Bride label and name.
- Wedding date.
- Short intro copy.
- Two decorative couple images.

## Section 2: Wedding Events

Current behavior:

- Two modern event cards for ceremony and reception.

New design:

- Convert to a formal wedding information sheet inspired by `Detail.png`.
- Title should read like the reference: `THONG TIN LE CUOI` or localized equivalent.
- Add two family/parent columns at the top.
- Add formal announcement copy.
- Center the couple names in large serif text.
- Show event venue, time, and date in a typographic arrangement.
- Floral decorations should frame the content without covering text.
- Prefer `asset_2.webp` or `asset_3.webp` as side floral decorations.

Expected content:

- Bride family/parent names.
- Groom family/parent names.
- Formal announcement line.
- Couple names.
- Main ceremony venue/address.
- Time.
- Date broken into weekday, day, month, and year when possible.

For MVP, the section can use the first event in `weddingConfig.events` as the main ceremony event.

## Data Changes

Extend `weddingConfig` with a small `families` object:

```ts
families: {
  groom: {
    label: "Ong ba",
    parents: ["Tran Van Tuan", "Tran Thi Mai"],
    address: "..."
  },
  bride: {
    label: "Ong ba",
    parents: ["Le Van Hung", "Ho Thi Lan"],
    address: "..."
  }
}
```

Keep this static for now. Later phases can move it into database-backed wedding settings.

## Component Changes

Update:

- `components/invitation/CoupleHero.tsx`
- `components/invitation/EventDetails.tsx`
- `lib/wedding-config.ts`
- `app/globals.css`
- `public/images/florals/*`

Optional helper:

- Add a small shared decoration class in CSS rather than introducing a new component unless duplication becomes painful.

## Constraints

- Do not change RSVP, gallery, timeline, music, or auto-scroll behavior.
- Do not add a new UI library.
- Keep the page mobile-first.
- Avoid layout overlap on narrow screens.
- Avoid in-app instructional text.
- Keep text readable over floral backgrounds.

## Verification

Run:

- `npm.cmd run lint`
- `npm.cmd run build`

Manual visual checks:

- Mobile: names, tilted photos, and formal event text fit without overlap.
- Desktop: sections feel closer to the provided reference screenshots.
- Auto-scroll still works after the layout change.
