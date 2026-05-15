# Wedding Invitation App Implementation Plan

Date: 2026-05-15

## Current State

The workspace currently contains requirements documentation only. No application framework has been initialized yet.

Before implementation, inspect the project files again. If the app has not been initialized, scaffold the project using the agreed stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- SQLite for local development
- Zod
- React Hook Form where helpful

## Phase 1: Project Setup

Goal: create a runnable foundation.

Tasks:

- Initialize or verify the Next.js app.
- Configure TypeScript and Tailwind CSS.
- Add base layout and global styles.
- Add project scripts for development, linting, and build.
- Confirm the app runs locally.

Verification:

- `npm run dev`
- `npm run lint`
- `npm run build`

## Phase 2: Static Invitation UI

Goal: build the complete public invitation experience with mock data.

Tasks:

- Create static wedding config.
- Build the public `/` invitation page.
- Build invitation section components:
  - `InvitationCover`
  - `GuestGreeting`
  - `CoupleHero`
  - `EventDetails`
  - `CountdownTimer`
  - `LoveStoryTimeline`
  - `PhotoGallery`
  - `MapSection`
  - `RsvpForm`
  - `ClosingMessage`
- Add floral pink/rose/cream styling.
- Make the layout excellent on mobile.
- Add subtle animation for section reveals.

Opening interaction tasks:

- Add cover open state.
- Start background music after the open button is clicked.
- Add floating music play/pause control.
- Add gentle automatic scrolling after opening.
- Stop automatic scrolling when the guest manually interacts.
- Respect `prefers-reduced-motion`.

Verification:

- Test on mobile and desktop viewport sizes.
- Confirm music starts after user interaction.
- Confirm manual scrolling stops auto-scroll.
- Confirm the page remains usable with reduced motion enabled.

## Phase 3: Prisma Data Layer

Goal: add persistent guest and RSVP data.

Tasks:

- Install and configure Prisma.
- Add SQLite datasource for local development.
- Create `Guest` model and `RsvpStatus` enum.
- Add initial migration.
- Add seed script with sample guests.
- Add Prisma client helper in `lib/db.ts`.

Verification:

- `npx prisma migrate dev`
- Seed data is created.
- Prisma Studio can view guests if needed.

## Phase 4: Guest Logic and Validation

Goal: create reusable server-side guest utilities.

Tasks:

- Add Zod schemas for creating guests, updating guests, and RSVP submission.
- Add slug normalization utility.
- Add unique slug generator.
- Add guest data helpers:
  - list guests
  - get guest by id
  - get guest by slug
  - create guest
  - update guest
  - delete guest
  - update RSVP by slug

Verification:

- Slug generation handles duplicate names.
- Validation rejects invalid RSVP status and invalid guest count.

## Phase 5: Personalized Invitation Route

Goal: make guest URLs work.

Tasks:

- Add `/invite/[slug]` page.
- Load guest by slug.
- Pass safe guest data to the invitation UI.
- Show personalized greeting.
- Add graceful invitation-not-found page.
- Add optional `/i/[slug]` redirect.

Verification:

- Existing slug renders the invitation.
- Missing slug renders friendly not-found UI.
- Public page does not expose phone, email, group, or admin-only fields.

## Phase 6: RSVP Submission

Goal: let guests submit attendance.

Tasks:

- Add `POST /api/invitations/[slug]/rsvp`.
- Validate request body with Zod.
- Update the matching guest record by slug.
- Wire `RsvpForm` to the API.
- Add loading, success, and error states.

Verification:

- Attending RSVP updates the correct guest.
- Not-attending RSVP updates the correct guest.
- Message is saved.
- Invalid input returns a clear error.

## Phase 7: Admin Dashboard and Guest List

Goal: give the admin visibility into guest status.

Tasks:

- Add `/admin` dashboard.
- Add RSVP summary cards:
  - total invited
  - attending
  - not attending
  - pending
- Add `/admin/guests` table.
- Add search/filter by name, group, and RSVP status.
- Add copy invitation URL action.

Verification:

- Summary cards match database state.
- Search/filter works.
- Copy button copies the correct absolute invite URL.

## Phase 8: Admin Guest CRUD

Goal: allow full guest management.

Tasks:

- Add `GET /api/guests`.
- Add `POST /api/guests`.
- Add `GET /api/guests/[id]`.
- Add `PATCH /api/guests/[id]`.
- Add `DELETE /api/guests/[id]`.
- Add `/admin/guests/new`.
- Add `/admin/guests/[id]`.
- Build shared `GuestForm`.
- Add delete confirmation.

Verification:

- Admin can create a guest.
- Admin can edit a guest.
- Admin can delete a guest.
- Duplicate slugs are handled gracefully.
- Form validation messages are clear.

## Phase 9: Polish and Hardening

Goal: make the MVP feel production-ready.

Tasks:

- Improve responsive spacing and typography.
- Add empty states.
- Add loading states.
- Add accessible labels.
- Add friendly API error responses.
- Review public/private data boundaries.
- Add production auth note or basic protection for admin routes.

Verification:

- `npm run lint`
- `npm run build`
- Manual mobile smoke test.
- Manual desktop smoke test.

## Phase 10: Optional Enhancements

Only start these after the main MVP flow works.

Possible additions:

- CSV import.
- CSV export.
- QR code generation per guest.
- Wedding settings editor.
- Managed photo gallery.
- Admin authentication.
- PostgreSQL deployment config.
- Playwright end-to-end tests.

## MVP Definition of Done

- A guest can open their personalized URL and see their name.
- A guest can submit RSVP.
- Admin can view RSVP summary.
- Admin can add, edit, delete, search, and filter guests.
- Admin can copy each guest invitation URL.
- The invitation looks elegant on mobile and desktop.
- Music and automatic scrolling start after the guest opens the invitation.
- Manual user interaction can stop automatic scrolling.
- Validation and missing states are friendly and clear.
- Build and lint pass.
