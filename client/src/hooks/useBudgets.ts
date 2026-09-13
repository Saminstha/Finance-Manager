import { useEffect } from "react";

import {
  addBudget,
  deleteBudget,
  fetchBudgets,
  updateBudget,
} from "@/store/slices/budgetSlice";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "@/components/ui/toast";

import type { CreateBudgetData, UpdateBudgetData } from "@/api/budgets";

export function useBudgets() {
  const dispatch = useAppDispatch();

  const { budgets, isLoading, error } = useAppSelector(
    (state) => state.budgets,
  );

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  const handleAddBudget = async (budget: CreateBudgetData) => {
    const result = await dispatch(addBudget(budget));

    if (addBudget.fulfilled.match(result)) {
      toast.success("Budget added successfully");
    } else {
      toast.error((result.payload as string) || "Failed to add budget");
    }

    return result;
  };

  const handleUpdateBudget = async (id: string, budget: UpdateBudgetData) => {
    const result = await dispatch(updateBudget({ id, budget }));

    if (updateBudget.fulfilled.match(result)) {
      toast.success("Budget updated successfully");
    } else {
      toast.error((result.payload as string) || "Failed to update budget");
    }

    return result;
  };

  const handleDeleteBudget = async (id: string) => {
    const result = await dispatch(deleteBudget(id));

    if (deleteBudget.fulfilled.match(result)) {
      toast.success("Budget deleted successfully");
    } else {
      toast.error((result.payload as string) || "Failed to delete budget");
    }

    return result;
  };

  return {
    budgets,
    isLoading,
    error,
    addBudget: handleAddBudget,
    updateBudget: handleUpdateBudget,
    deleteBudget: handleDeleteBudget,
  };
}
