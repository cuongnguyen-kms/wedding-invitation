# Reference-Style Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update only the "Our Wedding" and "Wedding Events" sections to match the local UI references.

**Architecture:** Keep the current invitation page structure. Replace the internals of `CoupleHero` and `EventDetails`, extend static config data, and use copied local floral assets from `public/images/florals`.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, local static assets.

---

### Task 1: Prepare Assets and Static Data

**Files:**
- Copy: `docs/requirements/ui/asset_1.webp` to `public/images/florals/corner-bouquet.webp`
- Copy: `docs/requirements/ui/asset_2.webp` to `public/images/florals/side-bouquet.webp`
- Copy: `docs/requirements/ui/asset_3.webp` to `public/images/florals/side-bouquet-alt.webp`
- Modify: `lib/wedding-config.ts`

- [ ] Copy floral assets into `public/images/florals`.
- [ ] Extend `WeddingConfig` with family data and date parts.
- [ ] Update the static config with groom/bride parent names and ceremony date parts.

### Task 2: Redesign Our Wedding Section

**Files:**
- Modify: `components/invitation/CoupleHero.tsx`

- [ ] Replace the modern two-column hero with a centered printed-invitation composition.
- [ ] Use `corner-bouquet.webp` as a decorative floral corner.
- [ ] Add large serif groom/bride names with labels.
- [ ] Add two overlapping tilted photo frames.
- [ ] Keep mobile layout stacked and overflow-safe.

### Task 3: Redesign Wedding Events Section

**Files:**
- Modify: `components/invitation/EventDetails.tsx`

- [ ] Replace modern event cards with a formal ceremony information sheet.
- [ ] Render family columns.
- [ ] Render formal announcement copy.
- [ ] Render couple names, venue, time, and date parts.
- [ ] Use side floral assets as non-obstructing decorations.

### Task 4: Styling and Verification

**Files:**
- Modify: `app/globals.css` if shared decorative styling is needed.

- [ ] Add shared paper/floral styling only if component classes are not enough.
- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Confirm app route returns HTTP 200.
