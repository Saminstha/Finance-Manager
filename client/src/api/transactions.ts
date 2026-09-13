import httpClient from "./httpClient";
import { endpoints } from "./endpoints";

import type { Transaction, TransactionType } from "@/types/transaction";

export interface CreateTransactionData {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  accountId: string;
  date: string;
  description?: string;
}

export type UpdateTransactionData = CreateTransactionData;

interface BackendAccount {
  _id: string;
  name: string;
  type: "cash" | "bank" | "wallet";
}

interface BackendTransaction {
  _id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;

  // When populated, backend sends the account object.
  // When creating/updating, it can be just the ID.
  accountId: string | BackendAccount;

  date: string;
  description?: string;
}

interface TransactionsResponse {
  transactions: BackendTransaction[];
}

interface TransactionResponse {
  transaction: BackendTransaction;
}

/*
 * Convert backend transaction into the
 * frontend Transaction format.
 */
function mapTransaction(transaction: BackendTransaction): Transaction {
  const accountId =
    typeof transaction.accountId === "string"
      ? transaction.accountId
      : transaction.accountId._id;

  return {
    id: transaction._id,
    title: transaction.title,
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
    accountId,
    date: transaction.date,
    description: transaction.description,
  };
}

/*
 * GET ALL TRANSACTIONS
 */
export async function getTransactions() {
  const response = await httpClient.get<TransactionsResponse>(
    endpoints.transactions.all,
  );

  return response.data.transactions.map(mapTransaction);
}

/*
 * CREATE TRANSACTION
 */
export async function createTransaction(data: CreateTransactionData) {
  const response = await httpClient.post<TransactionResponse>(
    endpoints.transactions.all,
    data,
  );

  return mapTransaction(response.data.transaction);
}

/*
 * UPDATE TRANSACTION
 */
export async function updateTransaction(
  id: string,
  data: UpdateTransactionData,
) {
  const response = await httpClient.patch<TransactionResponse>(
    `${endpoints.transactions.all}/${id}`,
    data,
  );

  return mapTransaction(response.data.transaction);
}

/*
 * DELETE TRANSACTION
 */
export async function deleteTransaction(id: string) {
  const response = await httpClient.delete(
    `${endpoints.transactions.all}/${id}`,
  );

  return response.data;
}
