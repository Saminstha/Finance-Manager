import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "@/components/ui/toast";

import {
  addSaving,
  deleteSavingGoal,
  fetchSavings,
  updateSavingGoal,
} from "@/store/slices/savingSlice";

import type { CreateSavingData, UpdateSavingData } from "@/api/savings";

export function useSavings() {
  const dispatch = useAppDispatch();

  const savings = useAppSelector((state) => state.savings.savings);

  const isLoading = useAppSelector((state) => state.savings.isLoading);

  const error = useAppSelector((state) => state.savings.error);

  useEffect(() => {
    dispatch(fetchSavings());
  }, [dispatch]);

  const handleAddSaving = async (saving: CreateSavingData) => {
    try {
      const result = await dispatch(addSaving(saving)).unwrap();

      toast.success("Savings goal added successfully");

      return result;
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : "Failed to add savings goal",
      );

      throw err;
    }
  };

  const handleUpdateSaving = async (
    id: string,
    saving: UpdateSavingData,
    currentSavedAmount: number,
    newSavedAmount: number,
  ) => {
    try {
      const result = await dispatch(
        updateSavingGoal({
          id,
          saving,
          currentSavedAmount,
          newSavedAmount,
        }),
      ).unwrap();

      toast.success("Savings goal updated successfully");

      return result;
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : "Failed to update savings goal",
      );

      throw err;
    }
  };

  const handleDeleteSaving = async (id: string) => {
    try {
      const result = await dispatch(deleteSavingGoal(id)).unwrap();

      toast.success("Savings goal deleted successfully");

      return result;
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : "Failed to delete savings goal",
      );

      throw err;
    }
  };

  return {
    savings,
    isLoading,
    error,
    addSaving: handleAddSaving,
    updateSaving: handleUpdateSaving,
    deleteSaving: handleDeleteSaving,
  };
}
