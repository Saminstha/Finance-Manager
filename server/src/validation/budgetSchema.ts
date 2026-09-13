import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid budget ID");

export const createBudgetSchema = z
  .object({
    category: z.string().trim().min(1, "Category is required"),
    amount: z.number().positive("Amount must be greater than 0"),
    month: z.number().int().min(1).max(12),
    year: z.number().int().min(2000),
  })
  .strict();

export const updateBudgetSchema = z
  .object({
    category: z.string().trim().min(1, "Category is required").optional(),
    amount: z.number().positive("Amount must be greater than 0").optional(),
    month: z.number().int().min(1).max(12).optional(),
    year: z.number().int().min(2000).optional(),
  })
  .strict();

export const budgetIdSchema = z.object({
  id: objectIdSchema,
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;

export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
