import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(3, "Username min. 3 characters"),
  phone: z.string().regex(/^\d{9,15}$/, "Invalid phone number"),
  bio: z.string(),
});
export type ProfileValues = z.infer<typeof profileSchema>;