# Wedding Invitation App Design

Date: 2026-05-15

## Goal

Build a modern wedding invitation web app inspired by the Hoa Moc Hong reference template:

https://chungdoi.com/mau-thiep/hoa-moc-hong/demo

The app should provide a beautiful public invitation experience and a simple admin area for guest management. Each guest receives a personalized invitation URL that can show their name/title and track their RSVP response.

## Product Scope

### Public Invitation

The public invitation should be a responsive, mobile-first page with a romantic floral pink aesthetic. It should feel elegant and ceremonial on phones, while still looking polished on desktop.

Required sections:

- Opening cover screen with couple names, wedding date, personalized guest greeting, and an "Open Invitation" button.
- Couple introduction.
- Wedding event details.
- Countdown timer.
- Love story timeline.
- Photo gallery.
- Location/map section.
- RSVP form.
- Thank-you or closing message.

### Opening Experience

The invitation opening interaction is part of the core experience.

After the guest taps "Open Invitation":

- The cover screen fades or slides away.
- Background music starts.
- The page begins a gentle automatic scroll through the invitation sections.
- The guest can manually scroll at any time.
- Manual scroll, touch, wheel, or pointer interaction stops automatic scrolling.
- A floating music control remains available so the guest can pause or resume music.

Music must start from the user's tap interaction because mobile browsers commonly block audio playback before user interaction.

If the visitor has reduced-motion preferences enabled, the app should skip automatic scrolling and use normal smooth section transitions only where appropriate.

### Personalized Guest URLs

Supported URL pattern:

- `/invite/[slug]`

Optional short alias:

- `/i/[slug]`

When the slug exists, the page shows a personalized greeting such as:

- "Than moi Anh Nam"
- "Dear John"

When the slug does not exist, the app shows a friendly invitation-not-found page instead of a generic error.

### RSVP

Guests can submit RSVP from their personalized invitation page.

Fields:

- Attendance: attending or not attending.
- Number of attendees.
- Guest message or wishes.

Rules:

- RSVP updates the correct guest record by slug.
- Public routes should not expose admin-only fields unnecessarily.
- Server-side validation is required.
- The guest sees a friendly success message after submission.

### Admin Guest Management

The admin area supports:

- RSVP summary cards.
- Guest list.
- Search and filtering by name, group, or RSVP status.
- Add guest.
- Edit guest.
- Delete guest.
- Automatic unique slug generation from guest name.
- Copy personalized invitation URL.

Optional post-MVP features:

- CSV import.
- CSV export.
- QR code generation.
- Admin authentication.
- Wedding content editor.

## Recommended Architecture

Use a single Next.js application with App Router, TypeScript, Tailwind CSS, Prisma, and SQLite for local development.

Recommended structure:

```txt
app/
  page.tsx
  invite/[slug]/page.tsx
  i/[slug]/route.ts
  admin/page.tsx
  admin/guests/page.tsx
  admin/guests/new/page.tsx
  admin/guests/[id]/page.tsx
  api/guests/route.ts
  api/guests/[id]/route.ts
  api/invitations/[slug]/route.ts
  api/invitations/[slug]/rsvp/route.ts
components/
  invitation/
  admin/
  ui/
lib/
  db.ts
  guests.ts
  slug.ts
  wedding-config.ts
schemas/
  guest.ts
  rsvp.ts
prisma/
  schema.prisma
  seed.ts
public/
  music/
  images/
```

Design principles:

- Keep the public invitation UI componentized by section.
- Keep database and business logic outside UI components.
- Validate all mutations with Zod.
- Keep wedding content static at first, stored in `lib/wedding-config.ts`.
- Store guest and RSVP data in the database from the start.
- Add configurable wedding content after the MVP flow works.

## Database Schema

Initial Prisma schema:

```prisma
model Guest {
  id              String     @id @default(cuid())
  name            String
  slug            String     @unique
  phone           String?
  email           String?
  group           String?
  invitationTitle String?
  guestCount      Int        @default(1)
  rsvpStatus      RsvpStatus @default(PENDING)
  message         String?
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
}

enum RsvpStatus {
  PENDING
  ATTENDING
  NOT_ATTENDING
}
```

Future schema additions:

- `WeddingSettings` for couple names, wedding date, venue, map URL, and copy text.
- `WeddingEvent` for ceremony and reception records.
- `Photo` for managed gallery images.
- `AdminUser` if production authentication is added.

## Routes

### Public Routes

`/`

Demo invitation page using static mock guest data.

`/invite/[slug]`

Personalized invitation page. Loads guest by slug, renders safe guest data, and allows RSVP submission.

`/i/[slug]`

Optional short route that redirects to `/invite/[slug]`.

### Admin Routes

`/admin`

Admin dashboard with RSVP summary cards and quick guest-management links.

`/admin/guests`

Guest table with search, filters, copy invitation URL, edit, and delete actions.

`/admin/guests/new`

Create guest form.

`/admin/guests/[id]`

Edit guest form.

## Component Design

### Invitation Components

`InvitationPage`

Top-level public invitation composition. Owns opened state and coordinates cover, music, auto-scroll, and sections.

`InvitationCover`

Full-screen opening cover with couple names, wedding date, guest greeting, and open button.

`MusicPlayer`

Controls background music. Attempts playback only after the opening button is clicked. Shows a floating play/pause button.

`AutoScrollController`

Starts after the invitation opens. Scrolls section by section or at a gentle timed pace. Stops when the guest manually interacts with the page.

`GuestGreeting`

Formats public greeting from guest title and name.

`CoupleHero`

Introduces the couple with romantic imagery and floral styling.

`EventDetails`

Displays ceremony/reception details, date, time, and venue.

`CountdownTimer`

Client-side countdown to wedding date.

`LoveStoryTimeline`

Displays relationship milestones.

`PhotoGallery`

Responsive gallery optimized for mobile.

`MapSection`

Displays venue information and an embedded map or link to directions.

`RsvpForm`

Validated RSVP form for attendance, attendee count, and guest message.

`ClosingMessage`

Final thank-you section.

### Admin Components

`AdminShell`

Shared admin layout.

`RsvpSummaryCards`

Displays total guests, attending, not attending, and pending.

`AdminGuestTable`

Guest list with search/filter results and row actions.

`GuestForm`

Shared create/edit form.

`CopyInviteButton`

Copies `/invite/[slug]` URL.

`DeleteGuestButton`

Confirms and deletes a guest.

## API Design

### Guests

`GET /api/guests`

Query params:

- `q`
- `group`
- `rsvpStatus`

Returns guest list and summary data for admin use.

`POST /api/guests`

Creates a guest.

Request:

```json
{
  "name": "Nguyen Van Nam",
  "phone": "0900000000",
  "email": "nam@example.com",
  "group": "friend",
  "invitationTitle": "Anh",
  "guestCount": 2
}
```

The server generates a unique slug if one is not provided.

`GET /api/guests/[id]`

Returns a single guest for admin editing.

`PATCH /api/guests/[id]`

Updates a guest.

`DELETE /api/guests/[id]`

Deletes a guest.

### Invitations

`GET /api/invitations/[slug]`

Returns safe public invitation data.

Example response:

```json
{
  "guest": {
    "name": "Nam",
    "invitationTitle": "Anh",
    "guestCount": 2,
    "rsvpStatus": "PENDING"
  },
  "wedding": {
    "coupleNames": "Hoang Nam & Thanh Tu",
    "date": "2026-02-01T10:00:00.000Z",
    "events": []
  }
}
```

`POST /api/invitations/[slug]/rsvp`

Updates RSVP by invitation slug.

Request:

```json
{
  "rsvpStatus": "ATTENDING",
  "guestCount": 2,
  "message": "Chuc hai ban hanh phuc"
}
```

## Validation

Use Zod for:

- Creating guests.
- Updating guests.
- Submitting RSVP.

Validation rules:

- Guest name is required.
- Guest slug is unique.
- Guest count must be at least 1.
- RSVP status must be one of `PENDING`, `ATTENDING`, or `NOT_ATTENDING`.
- RSVP message should have a reasonable max length, such as 500 characters.
- Public RSVP cannot update private guest fields like phone, email, group, or slug.

## Error Handling

Public users should see friendly messages:

- Invitation not found.
- RSVP could not be submitted.
- RSVP submitted successfully.

Admin users should see clear validation messages:

- Name is required.
- Slug is already used.
- Guest not found.
- Delete failed.

API responses should use consistent JSON errors:

```json
{
  "error": "Guest not found"
}
```

## Security Notes

Admin protection is required before production. For MVP local development, admin pages may be left unprotected with a visible note in the docs or UI.

Do not expose private guest fields on public invitation routes.

Validate and limit guest-submitted messages.

Do not store secrets in source code.

## Testing Strategy

Minimum useful verification:

- Build passes.
- Lint passes.
- Prisma migration applies.
- Seed creates sample guests.
- `/invite/[slug]` renders a personalized guest.
- Missing slug renders not-found state.
- RSVP updates the correct guest.
- Admin can create, edit, delete, search, and copy invitation URLs.

Recommended test coverage after MVP:

- Unit tests for slug generation.
- Unit tests for Zod schemas.
- Integration tests for RSVP API.
- Playwright smoke test for public invitation and admin guest flow.

## Implementation Recommendation

Build a working MVP before adding a CMS-like content editor.

Recommended first version:

- Static wedding content in code.
- Database-backed guests.
- Database-backed RSVP.
- Beautiful mobile-first invitation UI.
- Simple admin guest management.

This keeps the emotional invitation experience and real guest workflow central, while leaving room to expand into configurable content later.
