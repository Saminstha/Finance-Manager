import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid saving goal ID");

export const createSavingSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required"),
    targetAmount: z.number().positive("Target amount must be greater than 0"),
    savedAmount: z
      .number()
      .min(0, "Saved amount cannot be negative")
      .default(0),
    deadline: z.coerce.date().optional(),
    description: z.string().trim().optional(),
  })
  .strict();

export const updateSavingSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").optional(),
    targetAmount: z
      .number()
      .positive("Target amount must be greater than 0")
      .optional(),
    deadline: z.coerce.date().optional(),
    description: z.string().trim().optional(),
  })
  .strict();

export const savingAmountSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
});

export const savingIdSchema = z.object({
  id: objectIdSchema,
});

export type CreateSavingInput = z.infer<typeof createSavingSchema>;

export type UpdateSavingInput = z.infer<typeof updateSavingSchema>;

export type SavingAmountInput = z.infer<typeof savingAmountSchema>;
