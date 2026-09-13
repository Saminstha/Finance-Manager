import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid account ID");

export const createAccountSchema = z.object({
  name: z.string().trim().min(1, "Account name is required"),

  type: z.enum(["cash", "bank", "wallet"]),

  balance: z.number().min(0, "Balance cannot be negative").default(0),
});

export const updateAccountSchema = z
  .object({
    name: z.string().trim().min(1, "Account name is required").optional(),
    type: z.enum(["cash", "bank", "wallet"]).optional(),
  })
  .strict();

export const accountIdSchema = z.object({
  id: objectIdSchema,
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;

export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
