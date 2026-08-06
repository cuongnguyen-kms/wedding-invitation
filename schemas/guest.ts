import { z } from "zod";
import { RsvpStatus } from "@/lib/generated/prisma-postgres/enums";

export const rsvpStatusSchema = z.enum([
  RsvpStatus.PENDING,
  RsvpStatus.ATTENDING,
  RsvpStatus.NOT_ATTENDING,
]);

const guestFields = {
  name: z.string().trim().min(1, "Name is required"),
  slug: z.string().trim().min(1, "Slug cannot be empty").optional(),
  phone: z.string().trim().min(1).optional(),
  email: z.string().trim().email("Invalid email").optional(),
  group: z.string().trim().min(1).optional(),
  invitationTitle: z.string().trim().min(1).optional(),
  guestCount: z.number().int().min(1, "Guest count must be at least 1"),
  rsvpStatus: rsvpStatusSchema.optional(),
  message: z.string().trim().max(500, "Message is too long").optional(),
};

export const createGuestSchema = z.object(guestFields).extend({
  guestCount: guestFields.guestCount.default(1),
});
export type CreateGuestInput = z.infer<typeof createGuestSchema>;

export const updateGuestSchema = z.object(guestFields).partial();
export type UpdateGuestInput = z.infer<typeof updateGuestSchema>;
