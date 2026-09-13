import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useBudgets } from "@/hooks/useBudgets";
import { useTransactions } from "@/hooks/useTransactions";

import type { Budget } from "@/types/budget";

const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other",
];

const budgetSchema = z.object({
  category: z.string().min(1, "Category is required"),

  amount: z.number().positive("Monthly limit must be greater than 0"),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

export default function Budgets() {
  const { budgets, isLoading, error, addBudget, updateBudget, deleteBudget } =
    useBudgets();

  const { transactions } = useTransactions();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const currentDate = new Date();

  const currentMonth = currentDate.getMonth() + 1;

  const currentYear = currentDate.getFullYear();

  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    register,
    formState: { errors },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),

    defaultValues: {
      category: "",
      amount: 0,
    },
  });

  const selectedCategory = watch("category");

  // Fill form when editing
  useEffect(() => {
    if (editingBudget) {
      reset({
        category: editingBudget.category,

        amount: editingBudget.amount,
      });
    } else {
      reset({
        category: "",
        amount: 0,
      });
    }
  }, [editingBudget, reset]);

  // Open Add Budget dialog
  const openAddDialog = () => {
    setEditingBudget(null);

    reset({
      category: "",
      amount: 0,
    });

    setDialogOpen(true);
  };

  // Open Edit Budget dialog
  const openEditDialog = (budget: Budget) => {
    setEditingBudget(budget);
    setDialogOpen(true);
  };

  // Add / Edit budget
  const handleFormSubmit = async (data: BudgetFormData) => {
    try {
      if (editingBudget) {
        await updateBudget(editingBudget.id, {
          category: data.category,
          amount: data.amount,
          month: editingBudget.month,
          year: editingBudget.year,
        });
      } else {
        await addBudget({
          category: data.category,
          amount: data.amount,
          month: currentMonth,
          year: currentYear,
        });
      }

      setDialogOpen(false);
      setEditingBudget(null);

      reset({
        category: "",
        amount: 0,
      });
    } catch (error) {
      console.error("Failed to save budget:", error);
    }
  };

  // Delete budget
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteBudget(deleteId);

      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete budget:", error);
    }
  };

  // Calculate spending
  const getSpent = (budget: Budget) => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          transaction.category === budget.category &&
          new Date(transaction.date).getMonth() + 1 === budget.month &&
          new Date(transaction.date).getFullYear() === budget.year,
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Budgets</h1>

          <p className="text-muted-foreground">
            Set and manage your monthly spending limits
          </p>
        </div>

        <Button onClick={openAddDialog}>
          <Plus />
          Add Budget
        </Button>
      </div>

      {/* Loading */}
      {isLoading && budgets.length === 0 && (
        <div className="py-10 text-center text-muted-foreground">
          Loading budgets...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && budgets.length === 0 && !error && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No budgets found.</p>

            <Button className="mt-4" onClick={openAddDialog}>
              <Plus />
              Create Your First Budget
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Budget Cards */}
      {budgets.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {budgets.map((budget) => {
            const spent = getSpent(budget);

            const remaining = budget.amount - spent;

            const percentage =
              budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

            const progress = Math.min(percentage, 100);

            return (
              <Card key={budget.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{budget.category}</CardTitle>

                    <div className="flex gap-1">
                      {/* Edit */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(budget)}
                      >
                        <Pencil />
                      </Button>

                      {/* Delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => setDeleteId(budget.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold">
                      Rs. {budget.amount.toLocaleString()}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Monthly limit
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Spent: Rs. {spent.toLocaleString()}</span>

                      <span>{Math.round(percentage)}%</span>
                    </div>

                    <Progress value={progress} />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {remaining >= 0 ? "Remaining" : "Over budget"}
                    </span>

                    <span
                      className={
                        remaining >= 0
                          ? "font-medium"
                          : "font-medium text-destructive"
                      }
                    >
                      Rs. {Math.abs(remaining).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {budget.month}/{budget.year}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Budget Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setEditingBudget(null);

            reset({
              category: "",
              amount: 0,
            });
          }
        }}
      >
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              {editingBudget ? "Edit Budget" : "Add Budget"}
            </DialogTitle>

            <DialogDescription>
              {editingBudget
                ? "Update your monthly budget."
                : "Create a spending limit for a category."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>

              <Select
                value={selectedCategory}
                onValueChange={(value) =>
                  setValue("category", value, { shouldValidate: true })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {errors.category && (
                <p className="text-sm text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Monthly Limit */}
            <div className="space-y-2">
              <Label htmlFor="amount">Monthly Limit</Label>

              <Input
                id="amount"
                type="number"
                min="1"
                placeholder="e.g. 10000"
                {...register("amount", {
                  valueAsNumber: true,
                })}
              />

              {errors.amount && (
                <p className="text-sm text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : editingBudget
                  ? "Update Budget"
                  : "Add Budget"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete budget?</AlertDialogTitle>

            <AlertDialogDescription>
              This budget will be permanently deleted. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
