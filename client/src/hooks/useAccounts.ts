import { useEffect } from "react";

import {
  addAccount,
  deleteAccount,
  fetchAccounts,
  updateAccount,
} from "@/store/slices/accountSlice";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

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
    return dispatch(addAccount(account));
  };

  const handleUpdateAccount = async (
    id: string,
    account: UpdateAccountData,
  ) => {
    return dispatch(
      updateAccount({
        id,
        account,
      }),
    );
  };

  const handleDeleteAccount = async (id: string) => {
    return dispatch(deleteAccount(id));
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
