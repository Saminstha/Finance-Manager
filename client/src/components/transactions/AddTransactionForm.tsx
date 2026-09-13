import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Transaction } from "@/types/transaction";

import { TRANSACTION_CATEGORIES } from "@/constants/finance";

import { useAccounts } from "@/hooks/useAccounts";

const transactionSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  amount: z.number().positive("Amount must be greater than 0"),

  type: z.enum(["income", "expense"]),

  category: z.string().min(1, "Category is required"),

  accountId: z.string().min(1, "Account is required"),

  date: z.string().min(1, "Date is required"),

  description: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface AddTransactionFormProps {
  onSubmit: (data: Omit<Transaction, "id">) => void;

  initialData?: Omit<Transaction, "id">;

  submitLabel?: string;
}

export default function AddTransactionForm({
  onSubmit,
  initialData,
  submitLabel = "Add Transaction",
}: AddTransactionFormProps) {
  const { accounts } = useAccounts();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),

    defaultValues: initialData ?? {
      title: "",
      amount: 0,
      type: "expense",
      category: "",
      accountId: "",
      date: new Date().toISOString().split("T")[0],
      description: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const selectedType = watch("type");
  const selectedCategory = watch("category");
  const selectedAccountId = watch("accountId");

  const handleFormSubmit = (data: TransactionFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      {/* Title */}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>

        <Input id="title" placeholder="e.g. Groceries" {...register("title")} />

        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Amount */}

      <div className="space-y-2">
        <Label htmlFor="amount">Amount</Label>

        <Input
          id="amount"
          type="number"
          min="0"
          placeholder="Enter amount"
          {...register("amount", {
            valueAsNumber: true,
          })}
        />

        {errors.amount && (
          <p className="text-sm text-destructive">{errors.amount.message}</p>
        )}
      </div>

      {/* Type */}

      <div className="space-y-2">
        <Label>Type</Label>

        <Select
          value={selectedType}
          onValueChange={(value) => {
            if (value === "income" || value === "expense") {
              setValue("type", value, {
                shouldValidate: true,
              });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="expense">Expense</SelectItem>

            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>

        {errors.type && (
          <p className="text-sm text-destructive">{errors.type.message}</p>
        )}
      </div>

      {/* Category */}

      <div className="space-y-2">
        <Label>Category</Label>

        <Select
          value={selectedCategory}
          onValueChange={(value) => {
            if (value) {
              setValue("category", value, {
                shouldValidate: true,
              });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>

          <SelectContent>
            {TRANSACTION_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
      </div>

      {/* Account */}

      <div className="space-y-2">
        <Label>Account</Label>

        <Select
          items={accounts.map((account) => ({
            label: account.name,
            value: account.id,
          }))}
          value={selectedAccountId}
          onValueChange={(value) => {
            if (value) {
              setValue("accountId", value, {
                shouldValidate: true,
              });
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select account" />
          </SelectTrigger>

          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.accountId && (
          <p className="text-sm text-destructive">{errors.accountId.message}</p>
        )}

        {accounts.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Create an account before adding a transaction.
          </p>
        )}
      </div>

      {/* Date */}

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>

        <Input id="date" type="date" {...register("date")} />

        {errors.date && (
          <p className="text-sm text-destructive">{errors.date.message}</p>
        )}
      </div>

      {/* Description */}

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>

        <Textarea
          id="description"
          placeholder="Optional description"
          {...register("description")}
        />
      </div>

      {/* Submit */}

      <Button type="submit" className="w-full" disabled={accounts.length === 0}>
        {submitLabel}
      </Button>
    </form>
  );
}
