import { Budget } from "../models/Budget";
import type {
  CreateBudgetInput,
  UpdateBudgetInput,
} from "../validation/budgetSchema";

export async function createBudget(userId: string, input: CreateBudgetInput) {
  const existingBudget = await Budget.findOne({
    userId,
    category: input.category,
    month: input.month,
    year: input.year,
  });

  if (existingBudget) {
    throw new Error("A budget for this category and month already exists");
  }

  return Budget.create({
    userId,
    category: input.category,
    amount: input.amount,
    month: input.month,
    year: input.year,
  });
}

export async function getBudgets(userId: string) {
  return Budget.find({ userId }).sort({
    year: -1,
    month: -1,
    category: 1,
  });
}

export async function getBudgetById(userId: string, budgetId: string) {
  const budget = await Budget.findOne({
    _id: budgetId,
    userId,
  });

  if (!budget) {
    throw new Error("Budget not found");
  }

  return budget;
}

export async function updateBudget(
  userId: string,
  budgetId: string,
  input: UpdateBudgetInput,
) {
  const existingBudget = await Budget.findOne({
    _id: budgetId,
    userId,
  });

  if (!existingBudget) {
    throw new Error("Budget not found");
  }

  const category = input.category ?? existingBudget.category;
  const month = input.month ?? existingBudget.month;
  const year = input.year ?? existingBudget.year;

  const duplicateBudget = await Budget.findOne({
    _id: { $ne: budgetId },
    userId,
    category,
    month,
    year,
  });

  if (duplicateBudget) {
    throw new Error("A budget for this category and month already exists");
  }

  Object.assign(existingBudget, input);

  await existingBudget.save();

  return existingBudget;
}

export async function deleteBudget(userId: string, budgetId: string) {
  const budget = await Budget.findOneAndDelete({
    _id: budgetId,
    userId,
  });

  if (!budget) {
    throw new Error("Budget not found");
  }
}
