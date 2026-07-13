# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev              # Start dev server
npm run build             # Static export build (outputs to ./out)
npm run start             # Serve the production build
npm run lint               # ESLint
npm run test               # vitest run (all tests)
npx vitest run lib/invitation-experience.test.ts   # single test file
npx vitest run -t "test name"                      # single test by name
```

There is no database, Prisma, or API layer wired up yet — do not run/assume `prisma` commands even though they're referenced in `docs/`.

## Architecture

**Current state vs. planned docs:** `AGENTS.md`, `docs/implementation-plan.md`, and `docs/superpowers/specs/2026-05-15-wedding-invitation-design.md` describe a much larger planned system (Prisma + SQLite guest database, `/invite/[slug]` personalized URLs, admin CRUD, RSVP API). None of that has been built. The actual codebase only implements Phase 2 of that plan: a static, single-page invitation UI with mock data. Don't assume routes, API endpoints, or a database exist just because they're described in `docs/`.

**Static export for GitHub Pages.** `next.config.ts` sets `output: "export"`, so there is no Node server, no API routes, and no server components with runtime behavior — everything must work as static HTML/JS. The GitHub Actions workflow (`.github/workflows/deploy.yml`) builds with `GITHUB_PAGES=true` and `GITHUB_REPOSITORY` set, which `next.config.ts` uses to compute a `basePath`/`assetPrefix` for project-page deployments (e.g. `username.github.io/repo-name`). Because of the variable base path, any static asset reference (images, audio) must go through `publicPath()` in [lib/public-path.ts](lib/public-path.ts) rather than a hardcoded `/...` string — see its use in `MusicPlayer.tsx` and `RsvpForm.tsx`.

**Single source of content.** All wedding content (couple names, date, events, family info, timeline, gallery, location) lives in the typed `weddingConfig` object in [lib/wedding-config.ts](lib/wedding-config.ts). `app/page.tsx` just passes this config into `InvitationPage`. Content edits belong there, not scattered across components.

**Composition root:** [components/invitation/InvitationPage.tsx](components/invitation/InvitationPage.tsx) owns the single `isOpened` boolean and composes the whole page: `InvitationCover` → `MusicPlayer` / `AutoScrollController` (both react to `isOpened`) → a sequence of `Section`-wrapped content components (`CoupleHero`, `EventDetails`, `CountdownTimer`, `LoveStoryTimeline`, `MapSection`, `PhotoGallery`, `RsvpForm`) → `ClosingMessage`.

**Opening interaction:** tapping the cover's open button in `InvitationCover` calls `dispatchInvitationOpenEvent()` (a custom `window` event defined in `MusicPlayer.tsx`), which `MusicPlayer` listens for to start audio playback. This indirection exists because mobile browsers only allow audio to start from a real user gesture — don't try to autoplay music from a `useEffect` on `isOpened` instead.

**Auto-scroll math is extracted and tested.** The scroll/easing logic that drives `AutoScrollController` (when to start, computing the next section index, cubic easing, continuous scroll position, and detecting a user-interaction click that should cancel auto-scroll) lives as pure functions in [lib/invitation-experience.ts](lib/invitation-experience.ts), covered by `lib/invitation-experience.test.ts`. Keep this kind of logic in that file (pure, unit-testable) rather than inlining it into the component.

**RSVP form has no backend.** `RsvpForm` (components/invitation/RsvpForm.tsx) only sets local component state on submit — it does not call any API or persist anything. Treat it as a UI-only demo unless a backend is actually added.
