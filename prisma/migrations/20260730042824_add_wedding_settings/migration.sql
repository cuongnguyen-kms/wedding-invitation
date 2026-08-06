-- CreateTable
CREATE TABLE "WeddingSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "groomName" TEXT NOT NULL,
    "brideName" TEXT NOT NULL,
    "displayNames" TEXT NOT NULL,
    "weddingDateTime" DATETIME NOT NULL,
    "weddingDateLabel" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "locationTitle" TEXT NOT NULL,
    "locationAddress" TEXT NOT NULL,
    "locationMapUrl" TEXT NOT NULL,
    "eventsJson" TEXT NOT NULL,
    "scheduleJson" TEXT NOT NULL,
    "storyJson" TEXT NOT NULL,
    "familiesJson" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
