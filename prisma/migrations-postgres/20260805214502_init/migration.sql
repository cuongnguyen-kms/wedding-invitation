-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "RsvpStatus" AS ENUM ('PENDING', 'ATTENDING', 'NOT_ATTENDING');

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "group" TEXT,
    "invitationTitle" TEXT,
    "guestCount" INTEGER NOT NULL DEFAULT 1,
    "rsvpStatus" "RsvpStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeddingSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "groomName" TEXT NOT NULL,
    "brideName" TEXT NOT NULL,
    "displayNames" TEXT NOT NULL,
    "weddingDateTime" TIMESTAMP(3) NOT NULL,
    "weddingDateLabel" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "locationTitle" TEXT NOT NULL,
    "locationAddress" TEXT NOT NULL,
    "locationMapUrl" TEXT NOT NULL,
    "eventsJson" TEXT NOT NULL,
    "scheduleJson" TEXT NOT NULL,
    "storyJson" TEXT NOT NULL,
    "familiesJson" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "thumbData" BYTEA NOT NULL,
    "fullData" BYTEA NOT NULL,
    "mimeType" TEXT NOT NULL,
    "alt" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guest_slug_key" ON "Guest"("slug");

