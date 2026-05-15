# Wedding Invitation App Tasks

This is the living project checklist. Mark tasks completed progressively as implementation lands.

Status key:

- `[ ]` Not started
- `[~]` In progress
- `[x]` Completed

## Documentation

- [x] Capture product requirements in `AGENTS.md`.
- [x] Analyze requirements and proposed architecture.
- [x] Add design spec in `docs/superpowers/specs/2026-05-15-wedding-invitation-design.md`.
- [x] Add implementation plan in `docs/implementation-plan.md`.
- [x] Add docs index in `docs/README.md`.
- [x] Add project task checklist in `TASKS.md`.

## Phase 1: Project Setup

- [x] Inspect existing project structure before coding.
- [x] Initialize Next.js App Router project if not already scaffolded.
- [x] Configure TypeScript.
- [x] Configure Tailwind CSS.
- [x] Add base app layout.
- [x] Add global styles.
- [x] Confirm package scripts in `package.json`.
- [x] Run development server successfully.
- [x] Run lint successfully.
- [x] Run production build successfully.

## Phase 2: Static Invitation UI

- [x] Create static wedding content config.
- [x] Build public `/` invitation page.
- [x] Build `InvitationCover`.
- [x] Build `GuestGreeting`.
- [x] Build `CoupleHero`.
- [x] Build `EventDetails`.
- [x] Build `CountdownTimer`.
- [x] Build `LoveStoryTimeline`.
- [x] Build `PhotoGallery`.
- [x] Build `MapSection`.
- [x] Build `RsvpForm` with mock submission state.
- [x] Build `ClosingMessage`.
- [x] Add floral pink, rose, and cream visual styling.
- [x] Add subtle section animations.
- [x] Verify mobile layout.
- [x] Verify desktop layout.

## Phase 3: Opening Animation and Music

- [x] Add cover open state.
- [x] Start background music after the open button click.
- [x] Add floating play/pause music control.
- [x] Add gentle automatic scroll after opening.
- [x] Stop automatic scroll on manual user interaction.
- [x] Respect `prefers-reduced-motion`.
- [ ] Verify music works on mobile after user interaction.
- [ ] Verify page remains usable when music playback is blocked.

## Phase 4: Prisma Data Layer

- [ ] Install Prisma dependencies.
- [ ] Configure SQLite datasource.
- [ ] Add `Guest` model.
- [ ] Add `RsvpStatus` enum.
- [ ] Create initial migration.
- [ ] Add seed script with sample guests.
- [ ] Add Prisma client helper in `lib/db.ts`.
- [ ] Verify migration runs.
- [ ] Verify seed data exists.

## Phase 5: Guest Logic and Validation

- [ ] Add Zod schema for guest creation.
- [ ] Add Zod schema for guest update.
- [ ] Add Zod schema for RSVP submission.
- [ ] Add slug normalization utility.
- [ ] Add unique slug generation.
- [ ] Add guest list helper.
- [ ] Add get-guest-by-id helper.
- [ ] Add get-guest-by-slug helper.
- [ ] Add create guest helper.
- [ ] Add update guest helper.
- [ ] Add delete guest helper.
- [ ] Add RSVP update helper.
- [ ] Verify duplicate guest names produce unique slugs.

## Phase 6: Personalized Invitation Route

- [ ] Add `/invite/[slug]` route.
- [ ] Load guest by slug.
- [ ] Pass safe public guest data to invitation UI.
- [ ] Render personalized greeting.
- [ ] Add friendly invitation-not-found state.
- [ ] Add optional `/i/[slug]` redirect.
- [ ] Verify existing slug renders correctly.
- [ ] Verify missing slug renders gracefully.
- [ ] Verify public page does not expose private guest fields.

## Phase 7: RSVP Submission

- [ ] Add `POST /api/invitations/[slug]/rsvp`.
- [ ] Validate RSVP request body with Zod.
- [ ] Update matching guest by slug.
- [ ] Wire `RsvpForm` to RSVP API.
- [ ] Add loading state.
- [ ] Add success state.
- [ ] Add error state.
- [ ] Verify attending RSVP updates database.
- [ ] Verify not-attending RSVP updates database.
- [ ] Verify invalid RSVP input returns a clear error.

## Phase 8: Admin Dashboard and Guest List

- [ ] Add `/admin` dashboard.
- [ ] Add RSVP summary cards.
- [ ] Add `/admin/guests` page.
- [ ] Add admin guest table.
- [ ] Add search by name.
- [ ] Add filter by group.
- [ ] Add filter by RSVP status.
- [ ] Add copy personalized invitation URL action.
- [ ] Verify summary cards match database state.
- [ ] Verify search and filters work.
- [ ] Verify copied invitation URL is correct.

## Phase 9: Admin Guest CRUD

- [ ] Add `GET /api/guests`.
- [ ] Add `POST /api/guests`.
- [ ] Add `GET /api/guests/[id]`.
- [ ] Add `PATCH /api/guests/[id]`.
- [ ] Add `DELETE /api/guests/[id]`.
- [ ] Add `/admin/guests/new`.
- [ ] Add `/admin/guests/[id]`.
- [ ] Build shared `GuestForm`.
- [ ] Add delete confirmation.
- [ ] Verify admin can create a guest.
- [ ] Verify admin can edit a guest.
- [ ] Verify admin can delete a guest.
- [ ] Verify validation messages are clear.

## Phase 10: Polish and Hardening

- [ ] Improve responsive spacing.
- [ ] Improve typography.
- [ ] Add empty states.
- [ ] Add loading states.
- [ ] Add accessible labels for controls.
- [ ] Add friendly API error responses.
- [ ] Review public/private data boundaries.
- [ ] Add admin security note or basic admin protection.
- [ ] Run lint.
- [ ] Run production build.
- [ ] Perform manual mobile smoke test.
- [ ] Perform manual desktop smoke test.

## Optional Enhancements

- [ ] Add CSV import.
- [ ] Add CSV export.
- [ ] Add QR code generation per guest.
- [ ] Add wedding settings editor.
- [ ] Add managed photo gallery.
- [ ] Add admin authentication.
- [ ] Add PostgreSQL deployment configuration.
- [ ] Add Playwright end-to-end tests.

## MVP Done Criteria

- [ ] A guest can open a personalized URL and see their name.
- [ ] A guest can submit RSVP.
- [ ] Admin can view RSVP summary.
- [ ] Admin can add guests.
- [ ] Admin can edit guests.
- [ ] Admin can delete guests.
- [ ] Admin can search and filter guests.
- [ ] Admin can copy each guest invitation URL.
- [ ] Invitation looks elegant on mobile.
- [ ] Invitation looks polished on desktop.
- [ ] Music starts after the guest opens the invitation.
- [ ] Automatic scrolling starts after the guest opens the invitation.
- [ ] Manual interaction can stop automatic scrolling.
- [ ] Validation and missing states are friendly and clear.
- [ ] Lint passes.
- [ ] Production build passes.
