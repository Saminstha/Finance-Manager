import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

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
    return dispatch(addSaving(saving)).unwrap();
  };

  const handleUpdateSaving = async (
    id: string,
    saving: UpdateSavingData,
    currentSavedAmount: number,
    newSavedAmount: number,
  ) => {
    return dispatch(
      updateSavingGoal({
        id,
        saving,
        currentSavedAmount,
        newSavedAmount,
      }),
    ).unwrap();
  };

  const handleDeleteSaving = async (id: string) => {
    return dispatch(deleteSavingGoal(id)).unwrap();
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
