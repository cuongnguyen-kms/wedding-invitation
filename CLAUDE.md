# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server
npm run build             # Next.js production build (server-rendered, not static export)
npm run start             # Serve the production build
npm run lint               # ESLint
npm run test               # vitest run (all tests)
npx vitest run lib/invitation-experience.test.ts   # single test file
npx vitest run -t "test name"                      # single test by name
npm run db:seed            # Seed the local SQLite database (also runs via `npx prisma db seed`)
npx prisma studio           # Browse/edit the local database in a GUI
npx prisma migrate dev --name <name>   # Create + apply a new migration after editing prisma/schema.prisma
```

## Architecture

**Current state vs. planned docs:** `AGENTS.md`, `docs/implementation-plan.md`, and `docs/superpowers/specs/2026-05-15-wedding-invitation-design.md` describe the full planned system (Prisma + SQLite guest database, `/invite/[slug]` personalized URLs, admin CRUD, RSVP API). As of Phase 8: the data layer, public personalized-invitation routes, RSVP submission (`POST /api/invitations/[slug]/rsvp`), and a read-only admin dashboard (`/admin`, `/admin/guests` — summary cards, search/filter, copy-invite-link) are all built. Admin guest **CRUD** (create/edit/delete guests, Phase 9) and admin auth/protection (Phase 10 — the admin routes are currently wide open, no login) are **not** built yet.

**Deployed as a server app, not a static export.** This was originally a GitHub Pages static export (`output: "export"`), but that was dropped once Prisma/DB-backed routes were needed — GitHub Pages can't run a database or server-rendered dynamic routes. `next.config.ts` now has no `output: "export"`, no `basePath`/`trailingSlash`/`assetPrefix` GitHub Pages logic, and there's no GitHub Actions deploy workflow; deploy this to a platform that runs a real Next.js server (e.g. Vercel). `publicPath()` in [lib/public-path.ts](lib/public-path.ts) still exists from the GitHub Pages era and is safe to leave in place (it no-ops when `NEXT_PUBLIC_BASE_PATH` is unset), but there's no need to reach for it in new code.

**Prisma uses driver adapters (Prisma 7), not the old implicit env-URL connection.** `lib/db.ts` constructs `PrismaClient` with an explicit `@prisma/adapter-better-sqlite3` adapter reading `DATABASE_URL` — this is required in Prisma 7 and differs from most Prisma tutorials/docs online. The generated client lives at `lib/generated/prisma/` (gitignored, regenerated via `npx prisma generate`, which also runs automatically on `npm install`/`prisma migrate`). `prisma.config.ts` (not just `.env`) is what the Prisma CLI reads for the datasource URL.

**Guest data layer.** [lib/guests.ts](lib/guests.ts) has the CRUD + RSVP helpers (`listGuests`, `getGuestById`, `getGuestBySlug`, `createGuest`, `updateGuest`, `deleteGuest`, `updateRsvpBySlug`), all validated through the Zod schemas in `schemas/guest.ts` (admin create/update — `updateGuestSchema` is `createGuestSchema`'s fields made `.partial()` *without* carrying over the `guestCount` default, so a partial update never silently resets it) and `schemas/rsvp.ts` (`rsvpSubmissionSchema` is `.strict()` so a public RSVP payload can never smuggle in private fields like `phone`/`email`/`slug`). Slug generation lives in [lib/slug.ts](lib/slug.ts): `slugify()` is a pure, Vietnamese-diacritic-aware function; `generateUniqueSlug()` takes an injectable `isSlugTaken` check so it's unit-testable without touching the real database.

**Personalized invitation routes.** `app/invite/[slug]/page.tsx` loads the guest via `getGuestBySlug`, calls `notFound()` (rendering `app/invite/[slug]/not-found.tsx`) if missing, and only ever passes `name`/`invitationTitle` into the `weddingConfig.guest` shape passed to `InvitationPage` — never phone/email/group/message, to keep the public route from leaking private guest fields. `app/i/[slug]/route.ts` is a short-link redirect to `/invite/[slug]`; it uses `NextResponse.redirect()` rather than `redirect()` from `next/navigation` (the latter hung indefinitely when used inside a Route Handler during testing — stick to `NextResponse.redirect()` for Route Handlers). The root `/` route still renders the static mock-data demo (`weddingConfig.guest` as-is) per the original design doc.

**Single source of content.** All wedding content (couple names, date, events, family info, timeline, gallery, location) lives in the typed `weddingConfig` object in [lib/wedding-config.ts](lib/wedding-config.ts). `app/page.tsx` just passes this config into `InvitationPage`. Content edits belong there, not scattered across components.

**Composition root:** [components/invitation/InvitationPage.tsx](components/invitation/InvitationPage.tsx) owns the single `isOpened` boolean and composes the whole page: `InvitationCover` → `MusicPlayer` / `AutoScrollController` (both react to `isOpened`) → a sequence of `Section`-wrapped content components (`CoupleHero`, `EventDetails`, `CountdownTimer`, `LoveStoryTimeline`, `MapSection`, `PhotoGallery`, `RsvpForm`) → `ClosingMessage`.

**Opening interaction:** tapping the cover's open button in `InvitationCover` calls `dispatchInvitationOpenEvent()` (a custom `window` event defined in `MusicPlayer.tsx`), which `MusicPlayer` listens for to start audio playback. This indirection exists because mobile browsers only allow audio to start from a real user gesture — don't try to autoplay music from a `useEffect` on `isOpened` instead.

**Auto-scroll math is extracted and tested.** The scroll/easing logic that drives `AutoScrollController` (when to start, computing the next section index, cubic easing, continuous scroll position, and detecting a user-interaction click that should cancel auto-scroll) lives as pure functions in [lib/invitation-experience.ts](lib/invitation-experience.ts), covered by `lib/invitation-experience.test.ts`. Keep this kind of logic in that file (pure, unit-testable) rather than inlining it into the component.

**Admin dashboard needs `export const dynamic = "force-dynamic"` on plain pages.** `app/admin/page.tsx` queries the DB directly (no `fetch`, no `searchParams`), so Next.js had no signal to render it per-request and silently prerendered it once at build time — the RSVP counts would have frozen at build time in production. `app/admin/guests/page.tsx` doesn't need the export because reading `searchParams` already forces dynamic rendering. If you add another admin/data page that reads Prisma directly without `searchParams`/dynamic APIs, add the same `export const dynamic = "force-dynamic"` or it'll go stale the same way.

**RSVP form is backend-only-when-personalized.** `RsvpForm` (components/invitation/RsvpForm.tsx) takes an optional `guestSlug` prop. When absent — i.e. on the `/` mock-data demo page, which never passes it — the form stays a local-only UI demo (no network call, just a name/message field for show). When present — i.e. on `/invite/[slug]`, wired via `InvitationPage`'s `rsvp` prop — it POSTs to `app/api/invitations/[slug]/rsvp/route.ts`, which validates with `rsvpSubmissionSchema` and calls `updateRsvpBySlug`. Don't assume RSVP submission is a no-op; check whether `guestSlug` is set before changing this component.
