import { useEffect } from "react";

import {
  addTransaction,
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from "@/store/slices/transactionSlice";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

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
    return dispatch(addTransaction(transaction));
  };

  const handleUpdateTransaction = async (
    id: string,
    transaction: Omit<Transaction, "id">,
  ) => {
    return dispatch(
      updateTransaction({
        id,
        transaction,
      }),
    );
  };

  const handleDeleteTransaction = async (id: string) => {
    return dispatch(deleteTransaction(id));
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
