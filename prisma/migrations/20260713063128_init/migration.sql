-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "group" TEXT,
    "invitationTitle" TEXT,
    "guestCount" INTEGER NOT NULL DEFAULT 1,
    "rsvpStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_slug_key" ON "Guest"("slug");
