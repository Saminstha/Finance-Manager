import { useEffect } from "react";

import {
  addTransaction,
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from "@/store/slices/transactionSlice";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "@/components/ui/toast";

import type { Transaction } from "@/types/transaction";

export function useTransactions() {
  const dispatch = useAppDispatch();

  const { transactions, isLoading, error } = useAppSelector(
    (state) => state.transactions,
  );

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const handleAddTransaction = async (transaction: Omit<Transaction, "id">) => {
    const result = await dispatch(addTransaction(transaction));

    if (addTransaction.fulfilled.match(result)) {
      toast.success("Transaction added successfully");
    } else {
      toast.error((result.payload as string) || "Failed to add transaction");
    }

    return result;
  };

  const handleUpdateTransaction = async (
    id: string,
    transaction: Omit<Transaction, "id">,
  ) => {
    const result = await dispatch(updateTransaction({ id, transaction }));

    if (updateTransaction.fulfilled.match(result)) {
      toast.success("Transaction updated successfully");
    } else {
      toast.error(
        (result.payload as string) || "Failed to update transaction",
      );
    }

    return result;
  };

  const handleDeleteTransaction = async (id: string) => {
    const result = await dispatch(deleteTransaction(id));

    if (deleteTransaction.fulfilled.match(result)) {
      toast.success("Transaction deleted successfully");
    } else {
      toast.error(
        (result.payload as string) || "Failed to delete transaction",
      );
    }

    return result;
  };

  return {
    transactions,
    isLoading,
    error,
    addTransaction: handleAddTransaction,
    updateTransaction: handleUpdateTransaction,
    deleteTransaction: handleDeleteTransaction,
  };
}
