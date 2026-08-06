import { z } from "zod";

export const weddingEventSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  date: z.string().trim().min(1, "Date label is required"),
  weekday: z.string().trim().min(1, "Weekday is required"),
  day: z.string().trim().min(1, "Day is required"),
  month: z.string().trim().min(1, "Month is required"),
  year: z.string().trim().min(1, "Year is required"),
  time: z.string().trim().min(1, "Time is required"),
  venue: z.string().trim().min(1, "Venue is required"),
  address: z.string().trim().min(1, "Address is required"),
});

export const scheduleItemSchema = z.object({
  time: z.string().trim().min(1, "Time is required"),
  activity: z.string().trim().min(1, "Activity is required"),
});

export const timelineItemSchema = z.object({
  date: z.string().trim().min(1, "Date is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
});

export const familySchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  parents: z.array(z.string().trim().min(1, "Parent name cannot be empty")).min(1, "At least one parent name is required"),
  address: z.string().trim().min(1, "Address is required"),
});

export const weddingSettingsSchema = z.object({
  groomName: z.string().trim().min(1, "Groom name is required"),
  brideName: z.string().trim().min(1, "Bride name is required"),
  displayNames: z.string().trim().min(1, "Display names is required"),
  weddingDateTime: z.coerce.date({ error: "A valid wedding date/time is required" }),
  weddingDateLabel: z.string().trim().min(1, "Wedding date label is required"),
  intro: z.string().trim().min(1, "Intro is required"),
  locationTitle: z.string().trim().min(1, "Location title is required"),
  locationAddress: z.string().trim().min(1, "Location address is required"),
  locationMapUrl: z.string().trim().min(1, "Map URL is required"),
  events: z.array(weddingEventSchema).min(1, "At least one event is required"),
  schedule: z.array(scheduleItemSchema),
  story: z.array(timelineItemSchema),
  families: z.object({
    groom: familySchema,
    bride: familySchema,
  }),
});

export type WeddingSettingsInput = z.infer<typeof weddingSettingsSchema>;
