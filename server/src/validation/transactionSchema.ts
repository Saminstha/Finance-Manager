import { z } from "zod";

const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID");

export const createTransactionSchema = z
  .object({
    accountId: objectIdSchema,
    title: z.string().trim().min(1, "Title is required"),
    amount: z.number().positive("Amount must be greater than 0"),
    type: z.enum(["income", "expense"]),
    category: z.string().trim().min(1, "Category is required"),
    date: z.coerce.date(),
    description: z.string().trim().optional(),
  })
  .strict();

export const updateTransactionSchema = z
  .object({
    accountId: objectIdSchema.optional(),
    title: z.string().trim().min(1, "Title is required").optional(),
    amount: z.number().positive("Amount must be greater than 0").optional(),
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().trim().min(1, "Category is required").optional(),
    date: z.coerce.date().optional(),
    description: z.string().trim().optional(),
  })
  .strict();

export const transactionIdSchema = z.object({
  id: objectIdSchema,
});

export const transactionQuerySchema = z.object({
  type: z.enum(["income", "expense"]).optional(),

  category: z.string().trim().min(1).optional(),

  accountId: objectIdSchema.optional(),

  startDate: z.coerce.date().optional(),

  endDate: z.coerce.date().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;

export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>;
