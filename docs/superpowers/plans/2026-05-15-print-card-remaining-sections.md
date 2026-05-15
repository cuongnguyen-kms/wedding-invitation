# Print-Card Remaining Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the remaining public invitation sections into the approved print-card style.

**Architecture:** Preserve current component boundaries and route structure. Extend `weddingConfig` with schedule data, then restyle `PhotoGallery`, `CountdownTimer`, `MapSection`, `LoveStoryTimeline`, `RsvpForm`, and `ClosingMessage` using existing local floral assets.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, local static images.

---

### Task 1: Data and Wiring

**Files:**
- Modify: `lib/wedding-config.ts`
- Modify: `components/invitation/InvitationPage.tsx`

- [ ] Add `WeddingScheduleItem` type and `schedule` field to `WeddingConfig`.
- [ ] Add static wedding-day schedule data.
- [ ] Pass reception event data to `CountdownTimer`.
- [ ] Pass schedule data to `LoveStoryTimeline`.

### Task 2: Gallery and Reception Date Blocks

**Files:**
- Modify: `components/invitation/PhotoGallery.tsx`
- Modify: `components/invitation/CountdownTimer.tsx`

- [ ] Convert gallery to `ALBUM ANH CUOI` print-card grid.
- [ ] Convert countdown to `THONG TIN TIEC CUOI` date/calendar block.
- [ ] Preserve mobile-safe layout.

### Task 3: Location and Schedule Blocks

**Files:**
- Modify: `components/invitation/MapSection.tsx`
- Modify: `components/invitation/LoveStoryTimeline.tsx`

- [ ] Convert map section to reference-style venue block.
- [ ] Convert love story timeline to wedding-day schedule.
- [ ] Keep map link available.

### Task 4: Guestbook and Closing

**Files:**
- Modify: `components/invitation/RsvpForm.tsx`
- Modify: `components/invitation/ClosingMessage.tsx`

- [ ] Convert RSVP mock form to guestbook-style wishes form.
- [ ] Convert closing message to formal printed-card bottom section.
- [ ] Keep mock submission state.

### Task 5: Verification

**Files:**
- No direct code edits expected.

- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Confirm local app route returns HTTP 200.
