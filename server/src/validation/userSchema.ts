import { z } from "zod";

export const createUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .regex(
      /^[A-Za-z0-9_]+$/,
      "Username can only contain letters, numbers and underscore",
    ),

  name: z.string().trim().min(1, "Name is required"),

  email: z.email("Enter a valid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),

  phone: z
    .string()
    .trim()
    .regex(/^9[678]\d{8}$/, "Enter a valid phone number"),

  dateOfBirth: z.coerce.date().optional(),
});

export const updateUserSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").optional(),
    phone: z
      .string()
      .trim()
      .regex(/^9[678]\d{8}$/, "Enter a valid phone number")
      .optional(),
    dateOfBirth: z.coerce.date().optional(),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
