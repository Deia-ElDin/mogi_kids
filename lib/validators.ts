import * as z from "zod";

export const quoteSchema = z.object({
  fullName: z
    .string()
    .min(15, {
      message: "Full name must be at least of 15 characters.",
    })
    .max(60, {
      message: "Full name must not exceed 60 characters.",
    }),
  mobile: z
    .number()
    .min(9, {
      message: "Mobile / landline number must be at least 9 characters.",
    })
    .max(25, {
      message: "Mobile / landline number not exceed 25 characters.",
    }),
  location: z
    .string()
    .min(3, {
      message: "Location must be at least 3 characters.",
    })
    .max(150, {
      message: "Location must not exceed 60 characters.",
    }),
  email: z
    .string()
    .min(13, {
      message: "Email address must be at least 13 characters.",
    })
    .max(50, {
      message: "Email address must not exceed 50 characters.",
    }),
  fromDate: z.date(),
  toDate: z.date(),
  numberOfHours: z
    .number()
    .min(1, { message: "Number of hours must be at least 1 hour." })
    .max(24, { message: "Number of hours must not exceed 24 hours." }),
  numberOfKids: z.number(),
  ageOfKidsFrom: z.number(),
  ageOfKidsTO: z.number(),
  extraInfo: z.string().max(5000, {
    message: "maximum 5000 characters.",
  }),
});
