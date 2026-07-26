import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),

  description: z.string().trim().max(2000).optional(),

  location: z.string().trim().min(1, "Location is required.").max(300),

  dateTime: z.coerce.date({ error: "A valid date and time is required." }),

  category: z.enum(["music", "sports", "tech", "food", "community", "other"], {
    error: "Please choose a valid category.",
  }),
  maxAttendees: z.coerce
    .number({ error: "Max attendees must be a number." })
    .int("Max attendees must be a whole number.")
    .min(1, "There must be at least 1 slot."),
});

export const updateEventSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  description: z.string().trim().max(2000).optional(),
  location: z.string().trim().min(1).max(300).optional(),
  dateTime: z.coerce.date().optional(),
  category: z
    .enum(["music", "sports", "tech", "food", "community", "other"])
    .optional(),
  maxAttendees: z.coerce.number().int().min(1).optional(),
});
