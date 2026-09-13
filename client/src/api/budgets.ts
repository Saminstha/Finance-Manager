import httpClient from "./httpClient";
import { endpoints } from "./endpoints";

import type { Budget } from "@/types/budget";

export interface CreateBudgetData {
  category: string;
  amount: number;
  month: number;
  year: number;
}

export type UpdateBudgetData = CreateBudgetData;

interface BackendBudget {
  _id: string;
  category: string;
  amount: number;
  month: number;
  year: number;
}

interface BudgetsResponse {
  budgets: BackendBudget[];
}

interface BudgetResponse {
  budget: BackendBudget;
}

function mapBudget(budget: BackendBudget): Budget {
  return {
    id: budget._id,
    category: budget.category,
    amount: budget.amount,
    month: budget.month,
    year: budget.year,
  };
}

export async function getBudgets() {
  const response = await httpClient.get<BudgetsResponse>(endpoints.budgets.all);

  return response.data.budgets.map(mapBudget);
}

export async function createBudget(data: CreateBudgetData) {
  const response = await httpClient.post<BudgetResponse>(
    endpoints.budgets.all,
    data,
  );

  return mapBudget(response.data.budget);
}

export async function updateBudget(id: string, data: UpdateBudgetData) {
  const response = await httpClient.patch<BudgetResponse>(
    `${endpoints.budgets.all}/${id}`,
    data,
  );

  return mapBudget(response.data.budget);
}

export async function deleteBudget(id: string) {
  const response = await httpClient.delete(`${endpoints.budgets.all}/${id}`);

  return response.data;
}
