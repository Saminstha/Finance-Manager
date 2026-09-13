import { Saving } from "../models/Saving";
import type {
  CreateSavingInput,
  SavingAmountInput,
  UpdateSavingInput,
} from "../validation/savingSchema";

export async function createSaving(userId: string, input: CreateSavingInput) {
  if (input.savedAmount > input.targetAmount) {
    throw new Error("Saved amount cannot exceed target amount");
  }

  return Saving.create({
    userId,
    title: input.title,
    targetAmount: input.targetAmount,
    savedAmount: input.savedAmount,
    deadline: input.deadline,
    description: input.description,
  });
}

export async function getSavings(userId: string) {
  return Saving.find({ userId }).sort({
    createdAt: -1,
  });
}

export async function getSavingById(userId: string, savingId: string) {
  const saving = await Saving.findOne({
    _id: savingId,
    userId,
  });

  if (!saving) {
    throw new Error("Saving goal not found");
  }

  return saving;
}

export async function updateSaving(
  userId: string,
  savingId: string,
  input: UpdateSavingInput,
) {
  const saving = await Saving.findOne({
    _id: savingId,
    userId,
  });

  if (!saving) {
    throw new Error("Saving goal not found");
  }

  const targetAmount = input.targetAmount ?? saving.targetAmount;

  if (saving.savedAmount > targetAmount) {
    throw new Error("Target amount cannot be less than the saved amount");
  }

  Object.assign(saving, input);

  await saving.save();

  return saving;
}

export async function addSavingAmount(
  userId: string,
  savingId: string,
  input: SavingAmountInput,
) {
  const saving = await Saving.findOne({
    _id: savingId,
    userId,
  });

  if (!saving) {
    throw new Error("Saving goal not found");
  }

  const newSavedAmount = saving.savedAmount + input.amount;

  if (newSavedAmount > saving.targetAmount) {
    throw new Error("Saved amount cannot exceed target amount");
  }

  saving.savedAmount = newSavedAmount;

  await saving.save();

  return saving;
}

export async function removeSavingAmount(
  userId: string,
  savingId: string,
  input: SavingAmountInput,
) {
  const saving = await Saving.findOne({
    _id: savingId,
    userId,
  });

  if (!saving) {
    throw new Error("Saving goal not found");
  }

  const newSavedAmount = saving.savedAmount - input.amount;

  if (newSavedAmount < 0) {
    throw new Error("Saved amount cannot be less than 0");
  }

  saving.savedAmount = newSavedAmount;

  await saving.save();

  return saving;
}

export async function deleteSaving(userId: string, savingId: string) {
  const saving = await Saving.findOneAndDelete({
    _id: savingId,
    userId,
  });

  if (!saving) {
    throw new Error("Saving goal not found");
  }
}
