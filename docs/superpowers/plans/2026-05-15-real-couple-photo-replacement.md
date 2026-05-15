# Real Couple Photo Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace temporary Unsplash couple/gallery photos with the real images added under `public/images`.

**Architecture:** Keep the current component structure. Update `weddingConfig.gallery` to point at local public image paths so `CoupleHero` and `PhotoGallery` automatically use the new images. Leave the map/venue image unchanged.

**Tech Stack:** Next.js App Router, TypeScript, local public assets.

---

### Task 1: Update Static Photo Data

**Files:**
- Modify: `lib/wedding-config.ts`

- [ ] Replace gallery `src` values with local `/images/...jpg` paths.
- [ ] Use vertical portraits in positions `1` and `3` because `CoupleHero` uses those for tilted frames.
- [ ] Keep alt text descriptive.
- [ ] Preserve valid UTF-8 Vietnamese strings in config.

### Task 2: Verify

**Files:**
- No direct edits expected.

- [ ] Run `npm.cmd run lint`.
- [ ] Run `npm.cmd run build`.
- [ ] Confirm local app route returns HTTP 200.
