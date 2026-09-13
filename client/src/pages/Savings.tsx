import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Pencil, Plus, Trash2, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

import { useSavings } from "@/hooks/useSavings";

import type { Saving } from "@/types/saving";

const savingSchema = z
  .object({
    name: z.string().min(1, "Goal name is required"),

    targetAmount: z.number().positive("Target amount must be greater than 0"),

    savedAmount: z.number().min(0, "Saved amount cannot be negative"),

    deadline: z.string().optional(),
  })
  .refine((data) => data.savedAmount <= data.targetAmount, {
    message: "Saved amount cannot be greater than target amount",
    path: ["savedAmount"],
  });

type SavingFormData = z.infer<typeof savingSchema>;

export default function Savings() {
  const { savings, isLoading, error, addSaving, updateSaving, deleteSaving } =
    useSavings();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingSaving, setEditingSaving] = useState<Saving | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SavingFormData>({
    resolver: zodResolver(savingSchema),

    defaultValues: {
      name: "",
      targetAmount: 0,
      savedAmount: 0,
      deadline: "",
    },
  });

  useEffect(() => {
    if (editingSaving) {
      reset({
        name: editingSaving.name,
        targetAmount: editingSaving.targetAmount,
        savedAmount: editingSaving.savedAmount,
        deadline: editingSaving.deadline ?? "",
      });
    } else {
      reset({
        name: "",
        targetAmount: 0,
        savedAmount: 0,
        deadline: "",
      });
    }
  }, [editingSaving, reset]);

  const openAddDialog = () => {
    setEditingSaving(null);

    reset({
      name: "",
      targetAmount: 0,
      savedAmount: 0,
      deadline: "",
    });

    setDialogOpen(true);
  };

  const openEditDialog = (saving: Saving) => {
    setEditingSaving(saving);
    setDialogOpen(true);
  };

  const handleFormSubmit = async (data: SavingFormData) => {
    try {
      if (editingSaving) {
        await updateSaving(
          editingSaving.id,
          {
            name: data.name,
            targetAmount: data.targetAmount,
            deadline: data.deadline || undefined,
          },
          editingSaving.savedAmount,
          data.savedAmount,
        );
      } else {
        await addSaving({
          name: data.name,
          targetAmount: data.targetAmount,
          savedAmount: data.savedAmount,
          deadline: data.deadline || undefined,
        });
      }

      setDialogOpen(false);
      setEditingSaving(null);

      reset({
        name: "",
        targetAmount: 0,
        savedAmount: 0,
        deadline: "",
      });
    } catch (error) {
      console.error("Failed to save savings goal:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteSaving(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete savings goal:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Savings Goals</h1>

          <p className="text-muted-foreground">
            Track your progress towards your financial goals
          </p>
        </div>

        <Button onClick={openAddDialog}>
          <Plus />
          Add Goal
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading && savings.length === 0 && (
        <div className="py-10 text-center text-muted-foreground">
          Loading savings goals...
        </div>
      )}

      {/* Empty state */}
      {!isLoading && savings.length === 0 && !error && (
        <div className="rounded-xl border p-10 text-center">
          <Target className="mx-auto mb-3 size-10 text-muted-foreground" />

          <p className="text-muted-foreground">No savings goals yet.</p>

          <Button className="mt-4" onClick={openAddDialog}>
            <Plus />
            Create Your First Goal
          </Button>
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);

          if (!open) {
            setEditingSaving(null);

            reset({
              name: "",
              targetAmount: 0,
              savedAmount: 0,
              deadline: "",
            });
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingSaving ? "Edit Savings Goal" : "Add Savings Goal"}
            </DialogTitle>

            <DialogDescription>
              Set a target and track how much you have saved.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Goal Name */}
            <div className="space-y-2">
              <Label htmlFor="goal-name">Goal Name</Label>

              <Input
                id="goal-name"
                {...register("name")}
                placeholder="e.g. New Laptop"
              />

              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Target Amount */}
            <div className="space-y-2">
              <Label htmlFor="target-amount">Target Amount</Label>

              <Input
                id="target-amount"
                type="number"
                min="1"
                {...register("targetAmount", {
                  valueAsNumber: true,
                })}
                placeholder="120000"
              />

              {errors.targetAmount && (
                <p className="text-sm text-destructive">
                  {errors.targetAmount.message}
                </p>
              )}
            </div>

            {/* Saved Amount */}
            <div className="space-y-2">
              <Label htmlFor="saved-amount">Saved Amount</Label>

              <Input
                id="saved-amount"
                type="number"
                min="0"
                {...register("savedAmount", {
                  valueAsNumber: true,
                })}
                placeholder="45000"
              />

              {errors.savedAmount && (
                <p className="text-sm text-destructive">
                  {errors.savedAmount.message}
                </p>
              )}
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>

              <Input id="deadline" type="date" {...register("deadline")} />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : editingSaving
                  ? "Update Goal"
                  : "Add Goal"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Savings Goals */}
      {savings.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {savings.map((saving) => {
            const percentage = Math.min(
              (saving.savedAmount / saving.targetAmount) * 100,
              100,
            );

            const remaining = Math.max(
              saving.targetAmount - saving.savedAmount,
              0,
            );

            return (
              <div key={saving.id} className="rounded-xl border bg-card p-5">
                {/* Top section */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-muted p-3">
                      <Target />
                    </div>

                    <div>
                      <h2 className="font-semibold">{saving.name}</h2>

                      {saving.deadline && (
                        <p className="text-sm text-muted-foreground">
                          Deadline: {saving.deadline}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {/* Edit */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(saving)}
                    >
                      <Pencil />
                    </Button>

                    {/* Delete */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => setDeleteId(saving.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Rs. {saving.savedAmount.toLocaleString()}</span>

                    <span>Rs. {saving.targetAmount.toLocaleString()}</span>
                  </div>

                  <Progress value={percentage} />

                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {percentage.toFixed(0)}% saved
                    </span>

                    <span className="text-muted-foreground">
                      {remaining > 0
                        ? `Rs. ${remaining.toLocaleString()} remaining`
                        : "Goal completed 🎉"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
            <AlertDialogTitle>Delete savings goal?</AlertDialogTitle>

            <AlertDialogDescription>
              This savings goal will be permanently deleted. This action cannot
              be undone.
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
