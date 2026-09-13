import { useEffect } from "react";

import {
  addBudget,
  deleteBudget,
  fetchBudgets,
  updateBudget,
} from "@/store/slices/budgetSlice";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

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
    return dispatch(addBudget(budget));
  };

  const handleUpdateBudget = async (id: string, budget: UpdateBudgetData) => {
    return dispatch(
      updateBudget({
        id,
        budget,
      }),
    );
  };

  const handleDeleteBudget = async (id: string) => {
    return dispatch(deleteBudget(id));
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
