import { useEffect } from "react";

import {
  addAccount,
  deleteAccount,
  fetchAccounts,
  updateAccount,
} from "@/store/slices/accountSlice";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toast } from "@/components/ui/toast";

import type { CreateAccountData, UpdateAccountData } from "@/api/accounts";

export function useAccounts() {
  const dispatch = useAppDispatch();

  const { accounts, isLoading, error } = useAppSelector(
    (state) => state.accounts,
  );

  useEffect(() => {
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleAddAccount = async (account: CreateAccountData) => {
    const result = await dispatch(addAccount(account));

    if (addAccount.fulfilled.match(result)) {
      toast.success("Account added successfully");
    } else {
      toast.error((result.payload as string) || "Failed to add account");
    }

    return result;
  };

  const handleUpdateAccount = async (
    id: string,
    account: UpdateAccountData,
  ) => {
    const result = await dispatch(updateAccount({ id, account }));

    if (updateAccount.fulfilled.match(result)) {
      toast.success("Account updated successfully");
    } else {
      toast.error((result.payload as string) || "Failed to update account");
    }

    return result;
  };

  const handleDeleteAccount = async (id: string) => {
    const result = await dispatch(deleteAccount(id));

    if (deleteAccount.fulfilled.match(result)) {
      toast.success("Account deleted successfully");
    } else {
      toast.error((result.payload as string) || "Failed to delete account");
    }

    return result;
  };

  return {
    accounts,
    isLoading,
    error,
    addAccount: handleAddAccount,
    updateAccount: handleUpdateAccount,
    deleteAccount: handleDeleteAccount,
  };
}
