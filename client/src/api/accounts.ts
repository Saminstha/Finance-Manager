import httpClient from "./httpClient";
import { endpoints } from "./endpoints";
import type { Account, AccountType } from "@/types/account";

export interface CreateAccountData {
  name: string;
  type: AccountType;
  balance: number;
}

export interface UpdateAccountData {
  name: string;
  type: AccountType;
}

interface BackendAccount {
  _id: string;
  name: string;
  type: AccountType;
  balance: number;
}

interface AccountsResponse {
  accounts: BackendAccount[];
}

interface AccountResponse {
  account: BackendAccount;
}

function mapAccount(account: BackendAccount): Account {
  return {
    id: account._id,
    name: account.name,
    type: account.type,
    balance: account.balance,
  };
}

export async function getAccounts() {
  const response = await httpClient.get<AccountsResponse>(
    endpoints.accounts.all,
  );

  return response.data.accounts.map(mapAccount);
}

export async function createAccount(data: CreateAccountData) {
  const response = await httpClient.post<AccountResponse>(
    endpoints.accounts.all,
    data,
  );

  return mapAccount(response.data.account);
}

export async function updateAccount(id: string, data: UpdateAccountData) {
  const response = await httpClient.patch<AccountResponse>(
    `${endpoints.accounts.all}/${id}`,
    data,
  );

  return mapAccount(response.data.account);
}

export async function deleteAccount(id: string) {
  const response = await httpClient.delete(`${endpoints.accounts.all}/${id}`);

  return response.data;
}
