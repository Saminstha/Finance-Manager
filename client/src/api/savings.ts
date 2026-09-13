import httpClient from "./httpClient";
import { endpoints } from "./endpoints";

import type { Saving } from "@/types/saving";

export interface CreateSavingData {
  name: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string;
}

export interface UpdateSavingData {
  name: string;
  targetAmount: number;
  deadline?: string;
}

interface BackendSaving {
  _id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  deadline?: string;
  description?: string;
}

interface SavingsResponse {
  savings: BackendSaving[];
}

interface SavingResponse {
  saving: BackendSaving;
}

function mapSaving(saving: BackendSaving): Saving {
  return {
    id: saving._id,
    name: saving.title,
    targetAmount: saving.targetAmount,
    savedAmount: saving.savedAmount,
    deadline: saving.deadline ? saving.deadline.slice(0, 10) : undefined,
  };
}

export async function getSavings() {
  const response = await httpClient.get<SavingsResponse>(endpoints.savings.all);

  return response.data.savings.map(mapSaving);
}

export async function createSaving(data: CreateSavingData) {
  const response = await httpClient.post<SavingResponse>(
    endpoints.savings.all,
    {
      title: data.name,
      targetAmount: data.targetAmount,
      savedAmount: data.savedAmount,
      deadline: data.deadline || undefined,
    },
  );

  return mapSaving(response.data.saving);
}

export async function updateSaving(id: string, data: UpdateSavingData) {
  const response = await httpClient.patch<SavingResponse>(
    `${endpoints.savings.all}/${id}`,
    {
      title: data.name,
      targetAmount: data.targetAmount,
      deadline: data.deadline || undefined,
    },
  );

  return mapSaving(response.data.saving);
}

export async function addSavingAmount(id: string, amount: number) {
  const response = await httpClient.patch<SavingResponse>(
    `${endpoints.savings.all}/${id}/add`,
    {
      amount,
    },
  );

  return mapSaving(response.data.saving);
}

export async function removeSavingAmount(id: string, amount: number) {
  const response = await httpClient.patch<SavingResponse>(
    `${endpoints.savings.all}/${id}/remove`,
    {
      amount,
    },
  );

  return mapSaving(response.data.saving);
}

export async function deleteSaving(id: string) {
  const response = await httpClient.delete(`${endpoints.savings.all}/${id}`);

  return response.data;
}
