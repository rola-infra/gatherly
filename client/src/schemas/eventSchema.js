import { z } from "zod";

export const createEventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(200, "Title must be under 200 characters."),

  description: z
    .string()
    .trim()
    .max(2000, "Description must be under 2000 characters.")
    .optional(),

  location: z
    .string()
    .trim()
    .min(1, "Location is required.")
    .max(300, "Location must be under 300 characters."),

  dateTime: z.coerce
    .date({ error: "Please pick a date and time." })
    .refine((d) => d.getTime() > Date.now(), {
      error: "The event must be in the future.",
    }),

  category: z.enum(["music", "sports", "tech", "food", "community", "other"], {
    error: "Please choose a category.",
  }),

  maxAttendees: z.coerce
    .number({ error: "Capacity must be a number." })
    .int("Capacity must be a whole number.")
    .min(1, "There must be at least 1 spot."),
});
