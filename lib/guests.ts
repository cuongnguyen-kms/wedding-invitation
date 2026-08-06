import { prisma } from "@/lib/db";
import type { Guest } from "@/lib/generated/prisma-postgres/client";
import type { RsvpStatus } from "@/lib/generated/prisma-postgres/enums";
import { generateUniqueSlug } from "@/lib/slug";
import {
  createGuestSchema,
  updateGuestSchema,
  type CreateGuestInput,
  type UpdateGuestInput,
} from "@/schemas/guest";
import { rsvpSubmissionSchema, type RsvpSubmissionInput } from "@/schemas/rsvp";

export type ListGuestsFilters = {
  q?: string;
  group?: string;
  rsvpStatus?: RsvpStatus;
};

export function listGuests(filters: ListGuestsFilters = {}): Promise<Guest[]> {
  return prisma.guest.findMany({
    where: {
      ...(filters.q ? { name: { contains: filters.q } } : {}),
      ...(filters.group ? { group: filters.group } : {}),
      ...(filters.rsvpStatus ? { rsvpStatus: filters.rsvpStatus } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

export function getGuestById(id: string): Promise<Guest | null> {
  return prisma.guest.findUnique({ where: { id } });
}

export function getGuestBySlug(slug: string): Promise<Guest | null> {
  return prisma.guest.findUnique({ where: { slug } });
}

async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await prisma.guest.findUnique({ where: { slug } });
  return existing !== null && existing.id !== excludeId;
}

export async function createGuest(input: CreateGuestInput): Promise<Guest> {
  const data = createGuestSchema.parse(input);

  if (data.slug !== undefined && (await isSlugTaken(data.slug))) {
    throw new Error("Slug is already used");
  }

  const slug = data.slug ?? (await generateUniqueSlug(data.name, (candidate) => isSlugTaken(candidate)));

  return prisma.guest.create({
    data: { ...data, slug },
  });
}

export async function updateGuest(id: string, input: UpdateGuestInput): Promise<Guest> {
  const data = updateGuestSchema.parse(input);

  if (data.slug !== undefined && (await isSlugTaken(data.slug, id))) {
    throw new Error("Slug is already used");
  }

  return prisma.guest.update({ where: { id }, data });
}

export function deleteGuest(id: string): Promise<Guest> {
  return prisma.guest.delete({ where: { id } });
}

export async function updateRsvpBySlug(
  slug: string,
  input: RsvpSubmissionInput,
): Promise<Guest> {
  const data = rsvpSubmissionSchema.parse(input);
  return prisma.guest.update({ where: { slug }, data });
}
