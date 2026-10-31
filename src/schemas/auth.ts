import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    username: z
      .string()
      .min(3, "Username min. 3 characters")
      .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, and _ only"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    phone: z.string().regex(/^\d{9,15}$/, "Invalid phone number"),
    password: z.string().min(6, "Password min. 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
export type RegisterValues = z.infer<typeof registerSchema>;