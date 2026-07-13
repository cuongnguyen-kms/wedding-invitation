import { z } from "zod";
import { rsvpStatusSchema } from "./guest";

// .strict() guarantees a public RSVP submission can never smuggle in
// private guest fields (phone, email, group, slug) via extra JSON keys.
export const rsvpSubmissionSchema = z
  .object({
    rsvpStatus: rsvpStatusSchema,
    guestCount: z.number().int().min(1, "Guest count must be at least 1"),
    message: z.string().trim().max(500, "Message is too long").optional(),
  })
  .strict();

export type RsvpSubmissionInput = z.infer<typeof rsvpSubmissionSchema>;
