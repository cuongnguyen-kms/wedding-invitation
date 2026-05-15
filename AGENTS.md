# AGENTS.md

## Project Goal
Build a modern wedding invitation web app inspired by the reference template: `https://chungdoi.com/mau-thiep/hoa-moc-hong/demo`.

The app should allow the couple/admin to create a beautiful wedding invitation page and manage guests. Each guest must have a personalized invitation URL that can show the guest name and optional RSVP state.

## Product Requirements

### 1. Public Wedding Invitation Page
Create a responsive, mobile-first invitation page with a romantic floral pink aesthetic similar to the reference.

Core sections:
- Opening cover screen with couple names, wedding date, guest greeting, and “Open Invitation” button.
- Couple introduction section.
- Wedding event details.
- Countdown timer.
- Love story or timeline section.
- Photo gallery.
- Location/map section.
- RSVP form.
- Thank-you / closing message.

UI direction:
- Elegant, soft, romantic design.
- Pink / rose / cream palette.
- Floral decorations and subtle animations.
- Smooth scrolling after opening the invitation.
- Mobile layout must be excellent because most guests open invitations from phones.
- Desktop layout should also look polished.

### 2. Personalized Guest URLs
Each guest should have their own invitation URL.

Example URL patterns:
- `/invite/[guestSlug]`
- `/i/[guestSlug]`

Behavior:
- Load guest data by slug.
- Show personalized greeting, for example: “Thân mời Anh Nam” or “Dear John”.
- Track guest-specific RSVP response.
- If slug does not exist, show a graceful “Invitation not found” page.

Guest fields:
- `id`
- `name`
- `slug`
- `phone` optional
- `email` optional
- `group` optional, for example: family, friend, company
- `invitationTitle` optional, for example: Anh, Chị, Cô, Chú, Bạn
- `guestCount` optional
- `rsvpStatus`: pending / attending / not_attending
- `message` optional
- `createdAt`
- `updatedAt`

### 3. Admin Guest Management
Create a simple admin area for managing guests.

Admin features:
- View guest list.
- Add guest.
- Edit guest.
- Delete guest.
- Generate unique slug automatically from guest name.
- Copy personalized invitation URL.
- Search/filter guests by name, group, or RSVP status.
- See RSVP summary: total invited, attending, not attending, pending.

Optional but useful:
- Bulk import guests from CSV.
- Export guest list and RSVP results to CSV.

### 4. RSVP
Guests can respond from their personalized invitation page.

RSVP fields:
- Attendance: attending / not attending
- Number of attendees
- Guest message or wishes

Rules:
- RSVP should update the correct guest record.
- Avoid exposing admin-only fields on the public page.
- Show a friendly success message after submission.

## Suggested Tech Stack
Use the existing project stack unless already initialized differently.

Preferred stack:
- Next.js with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui where helpful
- Prisma ORM
- SQLite for local development, PostgreSQL-ready for production
- Zod for validation
- React Hook Form for forms

If the project already has another stack, keep the existing stack and adapt these requirements.

## Suggested Routes

Public:
- `/` landing or demo invitation page
- `/invite/[slug]` personalized invitation page

Admin:
- `/admin` dashboard
- `/admin/guests` guest list
- `/admin/guests/new` create guest
- `/admin/guests/[id]` edit guest

API:
- `GET /api/guests`
- `POST /api/guests`
- `GET /api/guests/[id]`
- `PATCH /api/guests/[id]`
- `DELETE /api/guests/[id]`
- `GET /api/invitations/[slug]`
- `POST /api/invitations/[slug]/rsvp`

## Data Model Draft

```prisma
model Guest {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique
  phone           String?
  email           String?
  group           String?
  invitationTitle String?
  guestCount      Int      @default(1)
  rsvpStatus      String   @default("pending")
  message         String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

Use enums if the database setup supports it cleanly.

## Coding Guidelines

### General
- Write clean, maintainable TypeScript.
- Prefer small reusable components.
- Keep business logic outside UI components when reasonable.
- Use meaningful file and component names.
- Avoid over-engineering; build a working MVP first.

### UI Components
Suggested components:
- `InvitationCover`
- `CoupleHero`
- `EventDetails`
- `CountdownTimer`
- `LoveStoryTimeline`
- `PhotoGallery`
- `MapSection`
- `RsvpForm`
- `GuestGreeting`
- `AdminGuestTable`
- `GuestForm`
- `RsvpSummaryCards`

### Styling
- Use Tailwind utility classes.
- Keep spacing consistent.
- Use accessible contrast.
- Prefer subtle motion, not distracting animations.
- Ensure all buttons and form controls are touch-friendly on mobile.

### Validation
Use Zod schemas for:
- Creating guests.
- Updating guests.
- Submitting RSVP.

### Error Handling
- Show friendly messages for public users.
- Return clear API errors.
- Handle missing guest slug gracefully.
- Validate all input on the server side.

### Security
- Admin routes should be protected before production.
- Do not expose private guest fields unnecessarily on public routes.
- Sanitize and validate user-submitted RSVP messages.
- Do not store secrets in source code.

## MVP Priority
Build in this order:

1. Create the invitation page UI using static mock data.
2. Add guest data model and seed sample guests.
3. Implement personalized route `/invite/[slug]`.
4. Add RSVP submission.
5. Build admin guest list.
6. Add create/edit/delete guest flows.
7. Add copy personalized URL.
8. Polish design and mobile responsiveness.
9. Add CSV import/export only after the main flow works.

## Definition of Done
- A guest can open their own URL and see a personalized invitation.
- A guest can submit RSVP.
- Admin can manage guests.
- Admin can copy each guest invitation URL.
- The invitation looks elegant on mobile and desktop.
- The app has clear validation and graceful error states.
- The codebase is understandable and easy to extend.

## Commands
When implementing, inspect `package.json` first and use the project’s actual scripts.

Common commands may include:

```bash
npm install
npm run dev
npm run lint
npm run build
npx prisma migrate dev
npx prisma studio
```

Do not assume commands exist until checking `package.json`.

## Notes for Codex
- Start by reading the existing project structure.
- Preserve existing conventions if the project already has them.
- Make incremental changes.
- After each meaningful change, run lint/build when available.
- Prefer working software over perfect architecture.
- Keep the first version simple, beautiful, and usable.
